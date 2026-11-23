import { modules } from './lessons.mjs';
import { labs } from './labs.mjs';
import { formulas, glossary } from './reference.mjs';
import { examCases, examTopics } from './exam-content.mjs';
import { bindCase, bindLab, casePage, chevron, disclosure, examPage, feedback, labWorkspace, link } from './study-ui.mjs';

const root = document.querySelector('main');
const themePicker=document.querySelector('.theme-picker');
const themeSummary=themePicker.querySelector('summary');
const themeOptions=[...themePicker.querySelectorAll('[data-theme-choice]')];
const lessons = modules.flatMap(module=>module.lessons.map(lesson=>({...lesson,module})));
const lessonById=new Map(lessons.map(lesson=>[lesson.id,lesson]));
const examByLesson=new Map(examTopics.flatMap(topic=>topic.lessons.map(id=>[id,topic])));
const repo = 'https://github.com/mixxermannipro/ki-lernstudio';
const storeKey = 'ki-lernstudio:v1';
const read = () => {
  try {
    const data = JSON.parse(localStorage.getItem(storeKey));
    return { done:Array.isArray(data?.done)?data.done:[], theme:['light','dark'].includes(data?.theme)?data.theme:'system', last:lessonById.has(data?.last)?data.last:null };
  } catch { return {done:[],theme:'system',last:null}; }
};
const state=read();
function save() {
  try {localStorage.setItem(storeKey,JSON.stringify(state));} catch { /* In a blocked browser the session still works. */ }
}
const status = id => state.done.includes(id);
const titles = {home:'Themen',pruefung:'Prüfungstraining',labor:'Rechenlabor',formeln:'Formelsammlung',glossar:'Glossar',mitmachen:'Mitmachen'};

function theme() {
  const dark=state.theme==='dark'||state.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme=dark?'dark':'light';
  document.querySelector('[name="theme-color"]').content=dark?'#17211e':'#f4f5ee';
  const icons={
    system:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
    light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
    dark:'<path d="M21 13.2A9 9 0 0 1 10.8 3a9 9 0 1 0 10.2 10.2Z"/>'
  };
  const labels={system:'System',light:'Hell',dark:'Dunkel'};
  themeSummary.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6">'+icons[state.theme]+'</svg><span>'+labels[state.theme]+'</span>';
  themeSummary.setAttribute('aria-label','Darstellung wählen. Aktuell: '+labels[state.theme]);
  themeOptions.forEach(option=>option.setAttribute('aria-pressed',String(option.dataset.themeChoice===state.theme)));
}
themeOptions.forEach(option=>option.addEventListener('click',()=>{
  state.theme=option.dataset.themeChoice;
  save();
  theme();
  themePicker.open=false;
  themeSummary.focus();
}));
document.addEventListener('click',event=>{
  if(!themePicker.contains(event.target))themePicker.open=false;
});
themePicker.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    themePicker.open=false;
    themeSummary.focus();
  }
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',theme);

const chapterNames=['KI-Grundlagen','Daten','Statistik','Regression','Modellbewertung','Entscheidungsbäume','kNN & Skalierung','Prozesse & Projekte','Recht & Steuern','Lernmethoden'];
const chapterNumber=index=>String(index+1).padStart(2,'0');
let directoryQuery='';
const topicState=new Map();

function home() {
  const count=lessons.filter(lesson=>status(lesson.id)).length;
  const recent=lessonById.get(state.last);
  const next=recent&&!status(recent.id)?recent:lessons.find(lesson=>!status(lesson.id))??lessons[0];
  const caption=recent===next?'Zuletzt geöffnet':count===lessons.length?'Zum Wiederholen':'Nächste Lektion';
  return '<div class="desk"><aside class="chapter-index" aria-labelledby="chapter-title"><h2 id="chapter-title">Inhalt</h2><ol>'+
    modules.map((module,i)=>'<li><button type="button" data-topic-jump="'+module.id+'"><span>'+chapterNumber(i)+'</span>'+chapterNames[i]+'</button></li>').join('')+
    '</ol><div class="index-progress"><span>'+count+' von '+lessons.length+' Lektionen abgeschlossen</span><progress value="'+count+'" max="'+lessons.length+'">'+count+'</progress></div></aside>'+
    '<div class="desk-page"><section class="desk-intro"><h1>Dein Arbeitsheft.</h1><p>Künstliche Intelligenz und maschinelles Lernen für die Weiterbildung. Steig bei einem Thema ein oder rechne einen Prüfungsfall.</p></section>'+
    '<section class="resume" aria-label="Lernstand"><div><p>'+caption+'</p><h2>'+next.title+'</h2></div>'+
    link('lektion/'+next.id,recent===next?'Weiterlesen':count===0?'Lektion starten':'Lektion öffnen','primary')+'</section>'+
    '<section class="learning" id="themen" tabindex="-1"><div class="section-title"><div><h2>Themen</h2><p class="mobile-progress">'+count+' von '+lessons.length+' Lektionen abgeschlossen</p></div>'+link('pruefung','Prüfungsfälle','back')+'</div>'+
    '<div class="directory-tools"><label class="search-label" for="topics-search">Im Lernstoff suchen</label><input type="search" class="search" id="topics-search" placeholder="Gini, Skalierung, Verträge …"></div>'+
    '<p id="topic-matches" class="matches" role="status" hidden></p>'+
    '<div class="module-list">'+modules.map((module,i)=>{
      const completed=module.lessons.filter(lesson=>status(lesson.id)).length;
      return '<details id="thema-'+module.id+'" class="module" data-topic '+((topicState.get(module.id)??module.id===next.module.id)?'open':'')+'>'+
        '<summary><span class="chapter-number" aria-hidden="true">'+chapterNumber(i)+'</span><span class="module-main"><strong>'+module.title+'</strong><span>'+module.summary+'</span></span>'+
        '<span class="module-count">'+(completed?completed+'/'+module.lessons.length+' erledigt':module.lessons.length+' Lektionen')+'</span>'+chevron+'</summary>'+
        '<ul>'+module.lessons.map(lesson=>'<li data-lesson="'+lesson.id+'">'+link('lektion/'+lesson.id,lesson.title)+(status(lesson.id)?'<span>Erledigt</span>':lesson.lab?'<span>Mit Labor</span>':'')+'</li>').join('')+'</ul></details>';
    }).join('')+'</div></section></div></div>';
}

function lessonPage(lesson) {
  const q=lesson.quiz;
  const next=lesson.module.lessons[lesson.module.lessons.findIndex(item=>item.id===lesson.id)+1];
  const exam=examByLesson.get(lesson.id);
  const location=lesson.module.lessons.findIndex(item=>item.id===lesson.id)+1;
  return '<article class="reading study-page"><div class="breadcrumb">'+link('', 'Themen','back')+'<span>'+lesson.module.title+'</span></div>'+
    '<div class="lesson-position">Lektion '+location+' von '+lesson.module.lessons.length+'</div>'+
    '<h1>'+lesson.title+'</h1><p class="intro">'+lesson.intro+'</p><div class="lesson-tools">'+
    (lesson.lab?'<button class="secondary" type="button" data-jump="experiment-title">Zum Rechenbeispiel</button>':'')+
    '<button class="text-button" type="button" id="toggle-explanations" aria-controls="lesson-explanations" aria-expanded="false">Alle Erklärungen öffnen</button></div>'+
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

const labGroups=[
  ['Daten & Statistik',['datenwerte','boxplot','korrelation','scaler']],
  ['Regression & Training',['gerade','grenze','sigmoid','fehler','gradient','batch','neuron']],
  ['Modelle & Bewertung',['baum','gini','entropie','pruning','knn','matrix','iris','schwellenwert','folds']],
  ['Recht & Prozesse',['steuer','prozess','quote']]
];

function labPage(key) {
  return '<section class="lab-page"><div class="lab-header"><div><h1>Rechenlabor</h1><p class="intro">Wähle ein Experiment. Zieh am Regler oder gib einen Wert ein.</p></div>'+
    '<label class="lab-select">Experiment <select id="lab-select">'+labGroups.map(([group,ids])=>'<optgroup label="'+group+'">'+ids.map(id=>
      '<option value="'+id+'" '+(id===key?'selected':'')+'>'+labs[id].title+'</option>').join('')+'</optgroup>').join('')+'</select></label></div>'+
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
function focusSection(target) {
  target.setAttribute('tabindex','-1');
  target.focus({preventScroll:true});
  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}

function bindTopicSearch() {
  const search=document.querySelector('#topics-search');
  const result=document.querySelector('#topic-matches');
  const entries=[...document.querySelectorAll('[data-topic]')].map((node,i)=>({
    node, topic:modules[i], rows:[...node.querySelectorAll('[data-lesson]')], open:node.open
  }));
  let filtering=false;
  function filter() {
    directoryQuery=search.value;
    const query=normalize(search.value.trim());
    const terms=query.split(/\s+/);
    let count=0;
    for(const {node,topic,rows,open} of entries) {
      const category=normalize(topic.title+' '+topic.summary);
      rows.forEach((row,i)=>{
        const lesson=topic.lessons[i];
        const haystack=normalize(category+' '+lesson.title+' '+lesson.intro+' '+lesson.steps.flat().join(' '));
        row.hidden=Boolean(query)&&!terms.every(term=>haystack.includes(term));
      });
      const visible=rows.filter(row=>!row.hidden).length;
      count+=visible;
      node.hidden=visible===0;
      if(query)node.open=visible>0;
      else if(filtering)node.open=topicState.get(topic.id)??open;
    }
    filtering=Boolean(query);
    result.hidden=!filtering;
    result.textContent=count===0?'Keine Lektionen gefunden. Prüfe den Suchbegriff.':count===1?'1 passende Lektion':count+' passende Lektionen';
  }
  search.value=directoryQuery;
  filter();
  search.addEventListener('input',filter);
  for(const {node,topic} of entries)node.querySelector('summary').addEventListener('click',()=>{
    if(filtering)return;
    topicState.set(topic.id,!node.open);
  });
  root.querySelectorAll('[data-topic-jump]').forEach(button=>button.addEventListener('click',()=>{
    search.value='';
    filter();
    const topic=document.getElementById('thema-'+button.dataset.topicJump);
    topic.open=true;
    topicState.set(button.dataset.topicJump,true);
    focusSection(topic.querySelector('summary'));
  }));
}

function wire(type,lesson,key,examCase) {
  document.querySelectorAll('[data-jump]').forEach(button=>button.addEventListener('click',()=>{
    focusSection(document.getElementById(button.dataset.jump));
  }));
  if(type==='home')bindTopicSearch();
  if(type==='lektion') {
    if(state.last!==lesson.id){state.last=lesson.id;save();}
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
    '<section class="reading"><h1>Mitmachen</h1><p class="intro">Habt ihr einen leichteren Rechenweg, eine zusätzliche Übung oder einen Fehler entdeckt? Teilt euren Vorschlag im öffentlichen GitHub-Projekt.</p><div class="actions"><a class="primary" href="'+repo+'">Repository auf GitHub</a><a class="secondary" href="'+repo+'/blob/main/CONTRIBUTING.md">Beitragsanleitung</a><a class="secondary" href="'+repo+'/issues/new">Fehler oder Idee melden</a></div></section>':
    '<section class="reading"><h1>Seite nicht gefunden</h1>'+link('','Zum Lernpfad','primary')+'</section>';
  const labSelectFocused=document.activeElement?.id==='lab-select';
  root.innerHTML=body;
  if(moveFocus&&typeof root.animate==='function'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
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
