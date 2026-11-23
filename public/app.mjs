import { modules } from './lessons.mjs';
import { labs } from './labs.mjs';
import { chart } from './charts.mjs';
import { formulas, glossary } from './reference.mjs';
import { fmt } from './math.mjs';

const root = document.querySelector('main');
const button = document.querySelector('.theme');
const lessons = modules.flatMap(module=>module.lessons.map(lesson=>({...lesson,module})));
const repo = 'https://github.com/mixxermannipro/ki-lernstudio';
const storeKey = 'ki-lernstudio:v1';
const read = () => {
  try {
    const data = JSON.parse(localStorage.getItem(storeKey));
    return { done:Array.isArray(data?.done)?data.done:[], theme:['light','dark'].includes(data?.theme)?data.theme:'system' };
  } catch { return {done:[],theme:'system'}; }
};
const state=read();
function save() {
  try {localStorage.setItem(storeKey,JSON.stringify(state));} catch { /* In a blocked browser the session still works. */ }
}
const link = (path,label,cls='') => '<a class="'+cls+'" href="#/'+path+'">'+label+'</a>';
const status = id => state.done.includes(id);
const titles = {home:'Lernpfad',labor:'Rechenlabor',formeln:'Formelsammlung',glossar:'Glossar',mitmachen:'Mitmachen'};

function theme() {
  const dark = state.theme==='dark'||state.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme=dark?'dark':'light';
  document.querySelector('[name="theme-color"]').content=dark?'#141722':'#f5f6fa';
  const icons = {
    system:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
    light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
    dark:'<path d="M21 13.2A9 9 0 0 1 10.8 3a9 9 0 1 0 10.2 10.2Z"/>'
  };
  const labels={system:'System',light:'Hell',dark:'Dunkel'};
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5">'+icons[state.theme]+'</svg><span>'+labels[state.theme]+'</span>';
  button.setAttribute('aria-label','Farbschema: '+labels[state.theme]+'. Farbschema wechseln');
}
button.addEventListener('click',()=>{
  state.theme={system:'light',light:'dark',dark:'system'}[state.theme];
  save();
  theme();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',theme);

function home() {
  const count=lessons.filter(l=>status(l.id)).length;
  const next=lessons.find(l=>!status(l.id))??lessons[0];
  return '<section class="hero"><div class="hero-copy"><h1>KI und maschinelles Lernen verstehen.</h1><p>Vom ersten Datensatz bis zum eigenen Rechenweg. Lerne den Kursstoff in einfachen Schritten und probiere aus, was passiert, wenn du die Zahlen änderst.</p>'+
    '<div class="actions">'+link('lektion/'+next.id,count===0?'Lernpfad starten':count===lessons.length?'Lernpfad wiederholen':'Weiterlernen','primary')+link('labor','Rechenlabor','secondary')+'</div></div>'+
    '<div class="hero-demo" aria-label="Interaktive Sigmoid-Vorschau"><div class="demo-top"><span>Sigmoid</span><strong id="preview-value">58,66 %</strong></div><div id="preview-chart"></div>'+
    '<label class="range-label" for="preview-z"><span>Rohwert z</span><output id="preview-z-value" for="preview-z">0,35</output></label><input id="preview-z" type="range" min="-6" max="6" step="0.05" value="0.35"></div></section>'+
    '<section class="learning"><div class="section-title"><div><h2>Dein Lernpfad</h2><p>Wähle eine Lektion oder setze beim nächsten offenen Thema an.</p></div>'+
    '<div class="progress-summary"><span>'+count+' von '+lessons.length+' erledigt</span><progress value="'+count+'" max="'+lessons.length+'">'+count+'</progress></div></div>'+
    '<div class="module-list">'+modules.map(module=>'<details class="module" '+(module.id===next.module.id?'open':'')+'><summary><span class="module-label">'+module.label+'</span><span class="module-main"><strong>'+module.title+'</strong><span>'+module.summary+'</span></span><span class="module-count">'+module.lessons.filter(l=>status(l.id)).length+'/'+module.lessons.length+'</span><span class="chevron" aria-hidden="true"></span></summary>'+
    '<ul>'+module.lessons.map(l=>'<li>'+link('lektion/'+l.id,l.title)+'<span>'+(status(l.id)?'Erledigt':'')+'</span></li>').join('')+'</ul></details>').join('')+'</div></section>';
}

function lessonPage(lesson) {
  const q=lesson.quiz;
  const next=lessons[lessons.indexOf(lesson)+1];
  return '<article class="reading">'+link('','Zum Lernpfad','back')+
    '<h1>'+lesson.title+'</h1><p class="intro">'+lesson.intro+'</p><ol class="lesson-steps">'+
    lesson.steps.map(([name,body])=>'<li><h2>'+name+'</h2><p>'+body+'</p></li>').join('')+'</ol>'+
    (lesson.lab?'<div class="lab-callout">'+link('labor/'+lesson.lab,'Im Rechenlabor ausprobieren','secondary')+(lesson.id==='pruning'?link('labor/folds','Kreuzvalidierung rechnen','secondary'):'')+'</div>':'')+
    '<section class="quiz"><h2>Selbstcheck</h2><form id="quiz"><fieldset><legend>'+q.prompt+'</legend>'+
    q.choices.map((choice,i)=>'<label><input name="choice" type="radio" value="'+i+'" required> '+choice+'</label>').join('')+'</fieldset>'+
    '<button class="primary" type="submit">Antwort prüfen</button><p class="feedback" id="quiz-feedback" role="status"></p></form></section>'+
    '<div class="lesson-end"><button class="secondary" id="done" aria-pressed="'+status(lesson.id)+'">'+(status(lesson.id)?'Erledigt · rückgängig machen':'Als erledigt markieren')+'</button>'+
    (next?link('lektion/'+next.id,'Nächste Lektion','secondary'):link('','Zum Lernpfad','secondary'))+'</div></article>';
}

function labPage(key) {
  const lab=labs[key];
  return '<section><h1>Rechenlabor</h1><p class="intro">Ändere die Werte und verfolge den Rechenweg. Prüfe danach, ob du ein Beispiel selbst lösen kannst.</p>'+
    '<label class="lab-select">Experiment <select id="lab-select">'+Object.entries(labs).map(([id,item])=>'<option value="'+id+'" '+(id===key?'selected':'')+'>'+item.title+'</option>').join('')+'</select></label>'+
    '<div class="lab-layout"><div class="lab-controls"><h2>'+lab.title+'</h2><p>'+lab.question+'</p><p class="formula">'+lab.formula+'</p>'+
      lab.inputs.map((field,i)=>field.options?'<label class="lab-field" for="lab-'+i+'">'+field.label+'<select id="lab-'+i+'" data-lab-input>'+field.options.map((o,n)=>'<option value="'+n+'">'+o+'</option>').join('')+'</select></label>':
      '<div class="lab-field"><label class="range-label" for="lab-'+i+'"><span>'+field.label+'</span><output for="lab-'+i+'" id="value-'+i+'">'+fmt(field.value)+'</output></label><input data-lab-input id="lab-'+i+'" type="range" min="'+field.min+'" max="'+field.max+'" step="'+field.step+'" value="'+field.value+'"></div>').join('')+
    '<button id="reset" class="secondary" type="button">Werte zurücksetzen</button></div>'+
    '<div class="lab-result"><div class="result-top"><h2>Ergebnis</h2><output id="result" aria-live="polite"></output></div><div id="plot"></div><p id="note"></p></div></div>'+
    '<div class="lab-work"><section><h2>Schritt für Schritt</h2><ol id="calculation"></ol></section><section class="quiz"><h2>Selbst rechnen</h2><form id="numeric"><label for="answer">'+lab.exercise[0]+'</label><div class="answer-row"><input type="text" inputmode="decimal" id="answer" placeholder="z. B. 0,5" required><button class="primary">Prüfen</button></div><p class="feedback" id="answer-feedback" role="status"></p></form><details><summary>Lösungsweg anzeigen</summary><p>'+lab.exercise[2]+'</p></details></section></div></section>';
}

function referencePage(type) {
  const isFormula=type==='formeln';
  const items=isFormula?formulas:glossary;
  return '<section class="reading reference"><h1>'+titles[type]+'</h1><p class="intro">'+(isFormula?'Formeln aus den Lernwochen mit Erklärung der Zeichen und kurzen Rechenbeispielen.':'Die wichtigsten Begriffe kurz erklärt, von Abnahmekriterium bis z-Score.')+'</p>'+
    '<label class="search-label" for="search">Suchen</label><input class="search" id="search" type="search" placeholder="'+(isFormula?'z. B. Gini, F1 oder Steigung':'z. B. Overfitting oder Median')+'">'+
    '<p id="matches" class="matches" role="status">'+items.length+' Einträge</p>'+
    '<div class="reference-list">'+items.map(item=>isFormula?'<details data-entry><summary><strong>'+item.name+'</strong><span class="chevron" aria-hidden="true"></span></summary><div><p class="formula">'+item.equation+'</p><p>'+item.symbols+'</p><p><strong>Beispiel.</strong> '+item.example+'</p>'+link('labor/'+item.lab,'Im Rechenlabor öffnen','back')+'</div></details>':
      '<section data-entry><h2>'+item[0]+'</h2><p>'+item[1]+'</p></section>').join('')+'</div></section>';
}

function normalize(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('de');
}
function wire(type,lesson,key) {
  if(type==='home') {
    const slider=document.querySelector('#preview-z');
    function preview() {
      const z=Number(slider.value), data=labs.sigmoid.run([z,50]);
      document.querySelector('#preview-z-value').value=fmt(z);
      document.querySelector('#preview-value').textContent=data.result;
      document.querySelector('#preview-chart').innerHTML=chart(data.plot);
    }
    slider.addEventListener('input',preview);
    preview();
  }
  if(type==='lektion') {
    const form=document.querySelector('#quiz'), done=document.querySelector('#done');
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const right=Number(new FormData(form).get('choice'))===lesson.quiz.correct;
      const feedback=document.querySelector('#quiz-feedback');
      feedback.textContent=(right?'Richtig. ':'Versuch es noch einmal. ')+lesson.quiz.feedback;
      feedback.dataset.state=right?'right':'retry';
    });
    done.addEventListener('click',()=>{
      state.done=status(lesson.id)?state.done.filter(id=>id!==lesson.id):[...state.done,lesson.id];
      save();
      done.setAttribute('aria-pressed',String(status(lesson.id)));
      done.textContent=status(lesson.id)?'Erledigt · rückgängig machen':'Als erledigt markieren';
    });
  }
  if(type==='labor') {
    const lab=labs[key], inputs=[...document.querySelectorAll('[data-lab-input]')];
    function update() {
      const values=inputs.map((el,i)=>{
        const value=Number(el.value), label=document.querySelector('#value-'+i);
        if(label) label.value=fmt(value);
        return value;
      });
      const data=lab.run(values);
      document.querySelector('#result').value=data.result;
      document.querySelector('#note').textContent=data.note;
      document.querySelector('#plot').innerHTML=chart(data.plot);
      document.querySelector('#calculation').innerHTML=data.steps.map(step=>'<li>'+step+'</li>').join('');
    }
    document.querySelector('#lab-select').addEventListener('change',event=>{
      location.hash='/labor/'+event.target.value;
    });
    inputs.forEach(el=>el.addEventListener('input',update));
    document.querySelector('#reset').addEventListener('click',()=>{inputs.forEach((el,i)=>el.value=lab.inputs[i].value);update();});
    document.querySelector('#numeric').addEventListener('submit',event=>{
      event.preventDefault();
      const raw=document.querySelector('#answer').value.trim().replace('−','-').replace(',','.').replace(/\s*%$/,'');
      const feedback=document.querySelector('#answer-feedback');
      const valid=/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw);
      const right=valid && Math.abs(Number(raw)-lab.exercise[1])<0.00005;
      feedback.dataset.state=right?'right':'retry';
      feedback.textContent=right?'Richtig. '+lab.exercise[2]:valid?'Das Ergebnis passt noch nicht. Rechne jeden Schritt einzeln.':'Gib eine Zahl ein, zum Beispiel 0,5.';
    });
    update();
  }
  if(type==='formeln'||type==='glossar') {
    const search=document.querySelector('#search'), entries=[...document.querySelectorAll('[data-entry]')];
    const values=entries.map(el=>normalize(el.textContent));
    search.addEventListener('input',()=>{
      const terms=normalize(search.value.trim()).split(/\s+/);
      let count=0;
      entries.forEach((el,i)=>{el.hidden=!terms.every(term=>values[i].includes(term));if(!el.hidden)count++;});
      document.querySelector('#matches').textContent=count===0?'Keine Einträge gefunden.':count===1?'1 Eintrag':count+' Einträge';
    });
  }
}

function render(moveFocus=false) {
  const hash=location.hash;
  if(hash==='#content') return;
  const [,page,id]=hash.split('/');
  const type=page||'home';
  const lesson=lessons.find(l=>l.id===id);
  const key=Object.hasOwn(labs,id)?id:'sigmoid';
  const isLab=type==='labor'&&(!id||Object.hasOwn(labs,id));
  const body=type==='home'?home():type==='lektion'&&lesson?lessonPage(lesson):isLab?labPage(key):
    type==='formeln'||type==='glossar'?referencePage(type):type==='mitmachen'?
    '<section class="reading"><h1>Mitmachen</h1><p class="intro">Habt ihr einen leichteren Rechenweg, eine zusätzliche Übung oder einen Fehler entdeckt? Teilt euren Vorschlag im öffentlichen GitHub-Projekt.</p><div class="actions"><a class="primary" href="'+repo+'/issues/new">Vorschlag melden</a><a class="secondary" href="'+repo+'">Änderungen beitragen</a></div></section>':
    '<section class="reading"><h1>Seite nicht gefunden</h1>'+link('','Zum Lernpfad','primary')+'</section>';
  const labSelectFocused=document.activeElement?.id==='lab-select';
  root.innerHTML=body;
  document.title=type==='home'?'KI-Lernstudio':(lesson?.title??titles[type]??'Seite nicht gefunden')+' · KI-Lernstudio';
  document.querySelectorAll('[data-nav]').forEach(nav=>{
    const active=nav.dataset.nav===(type==='lektion'?'home':type);
    if(active)nav.setAttribute('aria-current','page');else nav.removeAttribute('aria-current');
  });
  wire(isLab?type:type==='labor'?'missing':type,lesson,key);
  if(moveFocus){
    if(labSelectFocused&&isLab)document.querySelector('#lab-select').focus();
    else root.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}
window.addEventListener('hashchange',()=>render(true));
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();root.focus();root.scrollIntoView();});
theme();
render();
