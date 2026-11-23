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
  return '<div class="lab-field"><div class="range-label"><label for="'+id+'">'+field.label+'</label>'+
    '<input class="exact-value" type="text" inputmode="decimal" aria-label="'+field.label+', Wert eingeben" aria-describedby="'+id+'-message" maxlength="16" value="'+fmt(field.value)+'"></div>'+
    '<input data-lab-input id="'+id+'" type="range" min="'+field.min+'" max="'+field.max+'" step="'+field.step+'" value="'+field.value+'">'+
    '<p class="field-message" id="'+id+'-message" role="status" hidden></p></div>';
}

export function labWorkspace(key, inline=false) {
  const lab=labs[key];
  return '<section class="lab-workspace'+(inline?' inline-lab':'')+'" aria-labelledby="experiment-title">'+
    '<div class="experiment-heading"><div><h2 id="experiment-title">'+lab.title+'</h2><p>'+lab.question+'</p></div><p class="formula">'+lab.formula+'</p></div>'+
    '<div class="lab-layout"><div class="lab-result"><div class="result-top"><h3>Ergebnis</h3><output id="result" aria-live="polite"></output></div><div id="plot"></div><p id="note"></p></div>'+
    '<div class="lab-controls"><div class="controls-heading"><h3>Werte</h3><button id="reset" class="text-button" type="button">Zurücksetzen</button></div>'+
    lab.inputs.map(labInput).join('')+'</div></div>'+
    '<div class="lab-work"><section><h3>Rechenweg</h3><ol id="calculation" class="calculation"></ol></section><section class="quiz"><h3>Selbst rechnen</h3><form id="numeric"><label for="answer">'+lab.exercise[0]+'</label><div class="answer-row"><input type="text" inputmode="decimal" id="answer" placeholder="z. B. 0,5" required><button class="primary">Prüfen</button></div><p class="feedback" id="answer-feedback" role="status"></p></form>'+
    disclosure('Lösungsweg anzeigen','<p>'+lab.exercise[2]+'</p>')+'</section></div></section>';
}

export function bindLab(key) {
  const lab=labs[key], fields=[...document.querySelectorAll('[data-lab-input]')];
  const plot=document.querySelector('#plot'), note=document.querySelector('#note');
  const result=document.querySelector('#result'), calculation=document.querySelector('#calculation');
  function update() {
    const values=fields.map((field,i)=>lab.inputs[i].text?field.value:Number(field.value));
    const data=lab.run(values);
    result.value=data.result??'Eingabe prüfen';
    note.textContent=data.error??data.note;
    plot.innerHTML=data.error?'':chart(data.plot);
    const opened=[...calculation.querySelectorAll('details')].map(node=>node.open);
    calculation.innerHTML=(data.steps??[]).map((step,i)=>{
      const separator=step.indexOf(':');
      const title=separator>2&&separator<46?step.slice(0,separator):'Schritt '+(i+1);
      const body=title.startsWith('Schritt ')?step:step.slice(separator+1).trim();
      return '<li>'+disclosure(title,'<p>'+body+'</p>',opened[i]??i===0)+'</li>';
    }).join('');
  }
  const editors=fields.map(field=>{
    if(field.type!=='range'){
      field.addEventListener('input',update);
      return null;
    }
    const text=field.closest('.lab-field').querySelector('.exact-value');
    const message=document.getElementById(field.id+'-message');
    function sync() {
      text.value=fmt(Number(field.value));
      text.removeAttribute('aria-invalid');
      message.hidden=true;
    }
    field.addEventListener('input',()=>{sync();update();});
    function commit() {
      const value=parseNumber(text.value);
      const min=Number(field.min), max=Number(field.max), step=Number(field.step);
      const steps=(value-min)/step;
      if(value===null||value<min||value>max||Math.abs(steps-Math.round(steps))>1e-7){
        text.setAttribute('aria-invalid','true');
        message.textContent='Erlaubt sind '+fmt(min)+' bis '+fmt(max)+' in Schritten von '+fmt(step)+'.';
        message.hidden=false;
        return;
      }
      field.value=String(value);
      sync();
      update();
    }
    text.addEventListener('change',commit);
    text.addEventListener('keydown',event=>{
      if(event.key==='Enter'){event.preventDefault();commit();}
      if(event.key==='Escape'){event.preventDefault();sync();}
    });
    return sync;
  });
  document.querySelector('#reset').addEventListener('click',()=>{
    fields.forEach((field,i)=>{
      field.value=lab.inputs[i].value;
      editors[i]?.();
    });
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
    '<p class="intro">Rechne einen Fall durch oder sieh nach, welche Themen der Rahmenplan und die Musteraufgaben abdecken.</p>'+
    '<div class="exam-layout"><section aria-labelledby="case-list-title"><h2 id="case-list-title">Rechenfälle</h2><ul class="case-list">'+
    examCases.map(item=>'<li>'+link('fall/'+item.id,item.title)+'<span>'+item.tasks.length+' Teilfragen</span></li>').join('')+'</ul></section>'+
    '<aside class="exam-guide" aria-labelledby="exam-topics"><h2 id="exam-topics">Was soll ich können?</h2>'+
    examTopics.map(topic=>disclosure(topic.name,'<p class="source-label">'+topic.evidence+'</p><p>'+topic.action+'</p><ul class="topic-links">'+
      topic.lessons.map(id=>'<li>'+link('lektion/'+id,lessonById.get(id).title)+'</li>').join('')+'</ul>')).join('')+
    disclosure('Wie sind die Themen eingeordnet?','<p>Die Quellen zeigen, was du üben kannst. Welche Aufgaben in deiner Prüfung gestellt werden, steht damit nicht fest. DQR-4-Beispiele eignen sich als Einstieg in die Grundrechnungen.</p>')+'</aside></div>'+
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
