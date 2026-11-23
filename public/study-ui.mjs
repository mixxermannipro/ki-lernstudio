import { labs } from './labs.mjs';
import { chart } from './charts.mjs';
import { examCases, examOutlook, examTopics } from './exam-content.mjs';
import { fmt, parseNumber } from './math.mjs';

export const link=(path,label,cls='')=>'<a class="'+cls+'" href="#/'+path+'">'+label+'</a>';
export const chevron='<span class="chevron" aria-hidden="true"></span>';

export function disclosure(title, body, open=false) {
  return '<details class="disclosure"'+(open?' open':'')+'><summary>'+title+chevron+'</summary><div class="disclosure-body">'+body+'</div></details>';
}

export function feedback(node, state, message) {
  node.dataset.state=state;
  node.textContent=message;
}

function answerValue(value, unit) {
  const expected={ '%':/\s*%$/, 'PP':/\s*(?:PP|Prozentpunkte)$/i, 'h':/\s*h$/i, 'h²':/\s*h(?:²|\^2)$/i, 's':/\s*s$/i };
  return parseNumber(expected[unit]?value.trim().replace(expected[unit],''):value);
}

function labInput(field,i) {
  const id='lab-'+i;
  if(field.options)return '<label class="lab-field" for="'+id+'">'+field.label+'<select id="'+id+'" data-lab-input>'+field.options.map((option,n)=>'<option value="'+n+'">'+option+'</option>').join('')+'</select></label>';
  if(field.text)return '<div class="lab-field"><label for="'+id+'">'+field.label+'</label><input type="text" data-lab-input id="'+id+'" value="'+field.value+'" maxlength="320" aria-describedby="'+id+'-hint"><p id="'+id+'-hint" class="field-hint">'+field.hint+'</p></div>';
  return '<div class="lab-field"><label class="range-label" for="'+id+'"><span>'+field.label+'</span><output for="'+id+'" id="value-'+i+'">'+fmt(field.value)+'</output></label><input data-lab-input id="'+id+'" type="range" min="'+field.min+'" max="'+field.max+'" step="'+field.step+'" value="'+field.value+'"></div>';
}

export function labWorkspace(key, inline=false) {
  const lab=labs[key];
  return '<section class="lab-workspace'+(inline?' inline-lab':'')+'" aria-labelledby="experiment-title">'+
    (inline?'<h2 id="experiment-title">Interaktiv rechnen</h2>':'')+
    '<div class="lab-layout"><div class="lab-controls"><'+(inline?'h3':'h2 id="experiment-title"')+'>'+lab.title+'</'+(inline?'h3':'h2')+'><p>'+lab.question+'</p><p class="formula">'+lab.formula+'</p>'+
    lab.inputs.map(labInput).join('')+
    '<button id="reset" class="secondary" type="button">Werte zurücksetzen</button></div>'+
    '<div class="lab-result"><div class="result-top"><h3>Ergebnis</h3><output id="result" aria-live="polite"></output></div><div id="plot"></div><p id="note"></p></div></div>'+
    '<div class="lab-work"><section><h3>Rechenweg</h3><ol id="calculation" class="calculation"></ol></section><section class="quiz"><h3>Selbst rechnen</h3><form id="numeric"><label for="answer">'+lab.exercise[0]+'</label><div class="answer-row"><input type="text" inputmode="decimal" id="answer" placeholder="z. B. 0,5" required><button class="primary">Prüfen</button></div><p class="feedback" id="answer-feedback" role="status"></p></form>'+
    disclosure('Lösungsweg anzeigen','<p>'+lab.exercise[2]+'</p>')+'</section></div></section>';
}

export function bindLab(key) {
  const lab=labs[key], fields=[...document.querySelectorAll('[data-lab-input]')];
  const plot=document.querySelector('#plot'), note=document.querySelector('#note');
  const result=document.querySelector('#result'), calculation=document.querySelector('#calculation');
  function update() {
    const values=fields.map((field,i)=>{
      if(lab.inputs[i].text)return field.value;
      const number=Number(field.value), label=document.querySelector('#value-'+i);
      if(label)label.value=fmt(number);
      return number;
    });
    const data=lab.run(values);
    result.value=data.result??'Eingabe prüfen';
    note.textContent=data.error??data.note;
    plot.innerHTML=data.error?'':chart(data.plot);
    const opened=[...calculation.querySelectorAll('details')].map(node=>node.open);
    calculation.innerHTML=(data.steps??[]).map((step,i)=>'<li>'+disclosure('Schritt '+(i+1),'<p>'+step+'</p>',opened[i]??i===0)+'</li>').join('');
  }
  fields.forEach(field=>field.addEventListener('input',update));
  document.querySelector('#reset').addEventListener('click',()=>{
    fields.forEach((field,i)=>field.value=lab.inputs[i].value);
    update();
  });
  document.querySelector('#numeric').addEventListener('submit',event=>{
    event.preventDefault();
    const prompt=lab.exercise[0];
    const value=answerValue(document.querySelector('#answer').value,prompt.includes('Prozent')?'%':'');
    const response=document.querySelector('#answer-feedback');
    if(value===null)feedback(response,'retry','Gib eine Zahl ein, zum Beispiel 0,5.');
    else if(Math.abs(value-lab.exercise[1])<0.00005)feedback(response,'right','Richtig. '+lab.exercise[2]);
    else feedback(response,'retry','Das Ergebnis passt noch nicht. Prüfe die Zwischenschritte und die Einheit.');
  });
  update();
}

export function examPage(lessonById) {
  return '<section class="reading exam-page"><h1>Prüfungstraining</h1>'+
    '<p class="intro">Übe mit Aufgaben, die sich an deinen Kursunterlagen, dem DQR-5-Rahmenplan und den Musteraufgaben orientieren.</p>'+
    '<p class="exam-note">Die Quellen zeigen, was du üben kannst. Welche Aufgaben in deiner Prüfung gestellt werden, steht damit nicht fest. DQR-4-Beispiele eignen sich als Einstieg in die Grundrechnungen.</p>'+
    '<div class="actions">'+link('fall/'+examCases[0].id,'Ersten Fall lösen','primary')+'<button class="secondary" type="button" data-jump="exam-topics">Themen ansehen</button></div>'+
    '<section class="exam-section" id="exam-topics" tabindex="-1"><h2>Was soll ich können?</h2>'+
    examTopics.map(topic=>disclosure(topic.name,'<p class="source-label">'+topic.evidence+'</p><p>'+topic.action+'</p><ul class="topic-links">'+
      topic.lessons.map(id=>'<li>'+link('lektion/'+id,lessonById.get(id).title)+'</li>').join('')+'</ul>')).join('')+'</section>'+
    '<section class="exam-section"><h2>Prüfungsnahe Rechenfälle</h2><p>Bearbeite jede Teilfrage. Hinweise und Musterwege kannst du einzeln öffnen.</p><ul class="case-list">'+
    examCases.map(item=>'<li>'+link('fall/'+item.id,item.title)+'<span>'+item.tasks.length+' Teilfragen</span></li>').join('')+'</ul></section>'+
    '<section class="exam-section"><h2>Weitere Themen aus den DQR-5-Mustern</h2><p>Diese Vertiefungen stammen aus dem Prüfungsmaterial. Der bisherige Unterricht ist für sie in den gelesenen Mitschriften nicht vollständig belegt.</p>'+
    examOutlook.map(([title,source,text])=>disclosure(title,'<p class="source-label">DQR-5 '+source+'</p><p>'+text+'</p>')).join('')+'</section></section>';
}

export function casePage(item) {
  const next=examCases[examCases.indexOf(item)+1];
  return '<article class="reading exam-page">'+link('pruefung','Zum Prüfungstraining','back')+'<h1>'+item.title+'</h1><p class="intro">'+item.context+'</p>'+
    disclosure('Hinweis öffnen','<p>'+item.hint+'</p>')+
    '<form id="case-form"><ol class="case-questions">'+item.tasks.map((task,i)=>'<li><label for="task-'+i+'">'+task.question+'</label><div class="answer-row"><input id="task-'+i+'" type="text" inputmode="decimal" aria-describedby="task-feedback-'+i+'" placeholder="Dein Ergebnis">'+
    (task.unit?'<span class="answer-unit">'+task.unit+'</span>':'')+'</div><p class="feedback" id="task-feedback-'+i+'"></p>'+disclosure('Musterweg öffnen','<p>'+task.explanation+'</p>')+'</li>').join('')+
    '</ol><button class="primary">Antworten prüfen</button><p id="case-feedback" class="feedback" role="status"></p></form>'+
    '<div class="transfer">'+disclosure('Ergebnis einordnen','<p>'+item.transfer+'</p>')+'</div>'+
    '<div class="actions">'+link('labor/'+item.lab,'Passendes Rechenlabor','secondary')+(next?link('fall/'+next.id,'Nächster Fall','primary'):link('pruefung','Zur Fallübersicht','primary'))+'</div></article>';
}

export function bindCase(item) {
  document.querySelector('#case-form').addEventListener('submit',event=>{
    event.preventDefault();
    let correct=0;
    item.tasks.forEach((task,i)=>{
      const value=answerValue(document.querySelector('#task-'+i).value,task.unit);
      const right=value!==null&&Math.abs(value-task.answer)<0.000051;
      if(right)correct++;
      feedback(document.querySelector('#task-feedback-'+i),right?'right':'retry',
        right?'Richtig.':value===null?'Gib hier dein Ergebnis als Zahl ein.':'Prüfe den Ansatz und die Rundung.');
    });
    feedback(document.querySelector('#case-feedback'),correct===item.tasks.length?'right':'retry',
      correct+' von '+item.tasks.length+' Teilfragen richtig.');
  });
}
