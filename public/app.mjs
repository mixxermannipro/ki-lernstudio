import { modules } from './lessons.mjs';
import { labs } from './labs.mjs';
import { chart } from './charts.mjs';
import { formulas, glossary } from './reference.mjs';
import { fmt } from './math.mjs';
import { examCases, examTopics } from './exam-content.mjs';
import { bindCase, bindLab, casePage, chevron, disclosure, examPage, feedback, labWorkspace, link } from './study-ui.mjs';

const root = document.querySelector('main');
const button = document.querySelector('.theme');
const lessons = modules.flatMap(module=>module.lessons.map(lesson=>({...lesson,module})));
const lessonById=new Map(lessons.map(lesson=>[lesson.id,lesson]));
const examByLesson=new Map(examTopics.flatMap(topic=>topic.lessons.map(id=>[id,topic])));
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
const status = id => state.done.includes(id);
const titles = {home:'Themen',pruefung:'Prüfungstraining',labor:'Rechenlabor',formeln:'Formelsammlung',glossar:'Glossar',mitmachen:'Mitmachen'};

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
  return '<section class="hero"><div class="hero-copy"><h1>KI verstehen.<br>Selbst rechnen.</h1><p>Lerne künstliche Intelligenz und maschinelles Lernen nach Themen. Klappe Erklärungen auf, probiere eigene Werte aus und übe für die Prüfung.</p>'+
    '<div class="actions"><button class="primary" type="button" data-jump="themen">Themen entdecken</button>'+link('pruefung','Prüfungstraining','secondary')+'</div></div>'+
    '<div class="hero-demo" aria-label="Interaktive Sigmoid-Vorschau"><div class="demo-top"><span>Sigmoid</span><strong id="preview-value">58,66 %</strong></div><div id="preview-chart"></div>'+
    '<label class="range-label" for="preview-z"><span>Rohwert z</span><output id="preview-z-value" for="preview-z">0,35</output></label><input id="preview-z" type="range" min="-6" max="6" step="0.05" value="0.35"></div></section>'+
    '<section class="learning" id="themen" tabindex="-1"><div class="section-title"><div><h2>Themenübersicht</h2><p>Starte dort, wo du weiterlernen möchtest.</p></div>'+
    '<div class="progress-summary"><span>'+count+' von '+lessons.length+' erledigt</span><progress value="'+count+'" max="'+lessons.length+'">'+count+'</progress></div></div>'+
    '<div class="directory-tools"><div><label class="search-label" for="topics-search">Thema suchen</label><input type="search" class="search" id="topics-search" placeholder="z. B. Gini, Skalierung oder Verträge"></div>'+
    link('lektion/'+next.id,count===0?'Erste Lektion':count===lessons.length?'Lektionen wiederholen':'Weiterlernen','secondary')+'</div>'+
    '<p id="topic-matches" class="matches" role="status" hidden></p>'+
    '<div class="module-list">'+modules.map(module=>'<details class="module" data-topic '+(module.id===next.module.id?'open':'')+'><summary><span class="module-main"><strong>'+module.title+'</strong><span>'+module.summary+'</span></span><span class="module-count">'+module.lessons.filter(l=>status(l.id)).length+'/'+module.lessons.length+'</span>'+chevron+'</summary>'+
    '<ul>'+module.lessons.map(l=>'<li data-lesson="'+l.id+'">'+link('lektion/'+l.id,l.title)+'<span>'+(status(l.id)?'Erledigt':l.lab?'Rechenlabor':'')+'</span></li>').join('')+'</ul></details>').join('')+'</div></section>';
}

function lessonPage(lesson) {
  const q=lesson.quiz;
  const next=lesson.module.lessons[lesson.module.lessons.findIndex(item=>item.id===lesson.id)+1];
  const exam=examByLesson.get(lesson.id);
  return '<article class="reading study-page">'+link('', 'Themenübersicht','back')+
    '<h1>'+lesson.title+'</h1><p class="intro">'+lesson.intro+'</p><div class="lesson-tools">'+
    (lesson.lab?'<button class="secondary" type="button" data-jump="experiment-title">Zum Rechenbeispiel</button>':'')+
    '<button class="secondary" type="button" id="toggle-explanations" aria-controls="lesson-explanations" aria-expanded="false">Alle Erklärungen öffnen</button></div>'+
    '<section aria-labelledby="explanation-title"><h2 id="explanation-title" class="lesson-section-title">Einfach erklärt</h2><ol class="lesson-steps" id="lesson-explanations">'+
    lesson.steps.map(([name,body],i)=>'<li>'+disclosure(name,'<p>'+body+'</p>',i===0)+'</li>').join('')+'</ol></section>'+
    (lesson.lab?labWorkspace(lesson.lab,true):'')+
    (lesson.id==='training'?link('labor/batch','Batch-Training mit zwei Fällen ausprobieren','secondary'):'')+
    (exam?'<section class="exam-context">'+disclosure('Prüfungsbezug','<p class="source-label">'+exam.evidence+'</p><p>'+exam.action+'</p>'+link('pruefung','Prüfungstraining öffnen','back'))+'</section>':'')+
    '<section class="quiz"><h2>Selbstcheck</h2><form id="quiz"><fieldset><legend>'+q.prompt+'</legend>'+
    q.choices.map((choice,i)=>'<label><input name="choice" type="radio" value="'+i+'" required> '+choice+'</label>').join('')+'</fieldset>'+
    '<button class="primary" type="submit">Antwort prüfen</button><p class="feedback" id="quiz-feedback" role="status"></p></form></section>'+
    '<div class="lesson-end"><button class="secondary" id="done" aria-pressed="'+status(lesson.id)+'">'+(status(lesson.id)?'Erledigt · rückgängig machen':'Als erledigt markieren')+'</button>'+
    (next?link('lektion/'+next.id,'Nächste Lektion','secondary'):link('','Zur Themenübersicht','secondary'))+'</div></article>';
}

function labPage(key) {
  return '<section><h1>Rechenlabor</h1><p class="intro">Ändere die Werte und öffne die Rechenschritte einzeln. Prüfe danach, ob du ein Beispiel selbst lösen kannst.</p>'+
    '<label class="lab-select">Experiment <select id="lab-select">'+Object.entries(labs).map(([id,item])=>'<option value="'+id+'" '+(id===key?'selected':'')+'>'+item.title+'</option>').join('')+'</select></label>'+
    labWorkspace(key)+'</section>';
}

function referencePage(type) {
  const isFormula=type==='formeln';
  const items=isFormula?formulas:glossary;
  return '<section class="reading reference"><h1>'+titles[type]+'</h1><p class="intro">'+(isFormula?'Formeln aus dem Kursstoff mit Erklärung der Zeichen und kurzen Rechenbeispielen.':'Die wichtigsten Begriffe kurz erklärt, von Abnahmekriterium bis z-Score.')+'</p>'+
    '<label class="search-label" for="search">Suchen</label><input class="search" id="search" type="search" placeholder="'+(isFormula?'z. B. Gini, F1 oder Steigung':'z. B. Overfitting oder Median')+'">'+
    '<p id="matches" class="matches" role="status">'+items.length+' Einträge</p>'+
    '<div class="reference-list">'+items.map(item=>isFormula?'<details data-entry><summary><strong>'+item.name+'</strong><span class="chevron" aria-hidden="true"></span></summary><div><p class="formula">'+item.equation+'</p><p>'+item.symbols+'</p><p><strong>Beispiel.</strong> '+item.example+'</p>'+link('labor/'+item.lab,'Im Rechenlabor öffnen','back')+'</div></details>':
      '<section data-entry><h2>'+item[0]+'</h2><p>'+item[1]+'</p></section>').join('')+'</div></section>';
}

function normalize(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('de');
}
function bindTopicSearch() {
  const search=document.querySelector('#topics-search');
  const result=document.querySelector('#topic-matches');
  const entries=[...document.querySelectorAll('[data-topic]')].map((node,i)=>({
    node, topic:modules[i], rows:[...node.querySelectorAll('[data-lesson]')], open:node.open
  }));
  let filtering=false;
  search.addEventListener('input',()=>{
    const value=normalize(search.value.trim());
    const terms=value.split(/\s+/);
    let count=0;
    for(const {node,topic,rows,open} of entries) {
      const category=normalize(topic.title+' '+topic.summary);
      rows.forEach((row,i)=>{
        const lesson=topic.lessons[i];
        const haystack=normalize(category+' '+lesson.title+' '+lesson.intro+' '+lesson.steps.map(step=>step[0]).join(' '));
        row.hidden=Boolean(value)&&!terms.every(term=>haystack.includes(term));
      });
      const visible=rows.filter(row=>!row.hidden).length;
      count+=visible;
      node.hidden=visible===0;
      if(value)node.open=visible>0;
      else if(filtering)node.open=open;
    }
    filtering=Boolean(value);
    result.hidden=!filtering;
    result.textContent=count===0?'Keine passenden Lektionen gefunden.':count===1?'1 passende Lektion':count+' passende Lektionen';
  });
}

function wire(type,lesson,key,examCase) {
  document.querySelectorAll('[data-jump]').forEach(button=>button.addEventListener('click',()=>{
    const target=document.getElementById(button.dataset.jump);
    target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }));
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
    bindTopicSearch();
  }
  if(type==='lektion') {
    const form=document.querySelector('#quiz'), done=document.querySelector('#done');
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const right=Number(new FormData(form).get('choice'))===lesson.quiz.correct;
      feedback(document.querySelector('#quiz-feedback'),right?'right':'retry',
        right?'Richtig. '+lesson.quiz.feedback:'Versuch es noch einmal. Klappe bei Bedarf die passende Erklärung auf.');
    });
    const toggle=document.querySelector('#toggle-explanations');
    const explanations=[...document.querySelectorAll('#lesson-explanations details')];
    function updateToggle() {
      const open=explanations.every(item=>item.open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.textContent=open?'Alle Erklärungen schließen':'Alle Erklärungen öffnen';
    }
    toggle.addEventListener('click',()=>{
      const open=!explanations.every(item=>item.open);
      explanations.forEach(item=>item.open=open);
      updateToggle();
    });
    explanations.forEach(item=>item.addEventListener('toggle',updateToggle));
    if(lesson.lab)bindLab(lesson.lab);
    done.addEventListener('click',()=>{
      state.done=status(lesson.id)?state.done.filter(id=>id!==lesson.id):[...state.done,lesson.id];
      save();
      done.setAttribute('aria-pressed',String(status(lesson.id)));
      done.textContent=status(lesson.id)?'Erledigt · rückgängig machen':'Als erledigt markieren';
    });
  }
  if(type==='labor') {
    document.querySelector('#lab-select').addEventListener('change',event=>{
      location.hash='/labor/'+event.target.value;
    });
    bindLab(key);
  }
  if(type==='fall'&&examCase)bindCase(examCase);
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
  const lesson=lessonById.get(id);
  const examCase=examCases.find(item=>item.id===id);
  const key=Object.hasOwn(labs,id)?id:'sigmoid';
  const isLab=type==='labor'&&(!id||Object.hasOwn(labs,id));
  const body=type==='home'?home():type==='lektion'&&lesson?lessonPage(lesson):isLab?labPage(key):
    type==='formeln'||type==='glossar'?referencePage(type):type==='pruefung'?examPage(lessonById):type==='fall'&&examCase?casePage(examCase):type==='mitmachen'?
    '<section class="reading"><h1>Mitmachen</h1><p class="intro">Habt ihr einen leichteren Rechenweg, eine zusätzliche Übung oder einen Fehler entdeckt? Teilt euren Vorschlag im öffentlichen GitHub-Projekt.</p><div class="actions"><a class="primary" href="'+repo+'/issues/new">Vorschlag melden</a><a class="secondary" href="'+repo+'">Änderungen beitragen</a></div></section>':
    '<section class="reading"><h1>Seite nicht gefunden</h1>'+link('','Zum Lernpfad','primary')+'</section>';
  const labSelectFocused=document.activeElement?.id==='lab-select';
  root.innerHTML=body;
  if(moveFocus&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
    root.animate([{opacity:.75,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:210,easing:'cubic-bezier(.16,1,.3,1)'});
  document.title=type==='home'?'KI-Lernstudio':(lesson?.title??examCase?.title??titles[type]??'Seite nicht gefunden')+' · KI-Lernstudio';
  document.querySelectorAll('[data-nav]').forEach(nav=>{
    const active=nav.dataset.nav===(type==='lektion'?'home':type==='fall'?'pruefung':type);
    if(active)nav.setAttribute('aria-current','page');else nav.removeAttribute('aria-current');
  });
  wire(isLab?type:type==='labor'||type==='lektion'&&!lesson?'missing':type,lesson,key,examCase);
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
