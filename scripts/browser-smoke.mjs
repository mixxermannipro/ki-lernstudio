import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import assert from 'node:assert/strict';

const origin=process.argv[2]??'http://127.0.0.1:8267';
const output=process.argv[3];
const profile=await mkdtemp(tmpdir()+'/ki-browser-');
const browser=spawn(process.env.CHROME_BIN ?? 'google-chrome',['--headless','--no-sandbox','--disable-gpu','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank']);
const url=await new Promise((resolve,reject)=>{
  let stderr='';
  const expiry=setTimeout(()=>{
    browser.kill();
    reject(new Error('Chromium wurde nicht rechtzeitig gestartet.\n'+stderr));
  },15000);
  browser.stderr.on('data',chunk=>{
    stderr=(stderr+chunk).slice(-4000);
    const match=stderr.match(/DevTools listening on (ws:\/\/\S+)/);
    if(match){clearTimeout(expiry);resolve(match[1]);}
  });
  browser.once('error',error=>{clearTimeout(expiry);reject(error);});
  browser.once('exit',code=>{
    clearTimeout(expiry);
    reject(new Error('Chromium exit '+code+'\n'+stderr));
  });
});
const ws=new WebSocket(url);
await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
let id=0;
const waiting=new Map(), errors=[];
ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(message.id){const handlers=waiting.get(message.id);waiting.delete(message.id);if(message.error)handlers.reject(message.error);else handlers.resolve(message.result);}
  if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);
});
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
  const message={id:++id,method,params,...(sessionId?{sessionId}:{})};
  waiting.set(id,{resolve,reject});ws.send(JSON.stringify(message));
});
try {
  const { targetId }=await send('Target.createTarget',{url:'about:blank'});
  const { sessionId }=await send('Target.attachToTarget',{targetId,flatten:true});
  const c=(method,params)=>send(method,params,sessionId);
  const evaluate=async expression=>{
    const result=await c('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description??result.exceptionDetails.text);
    return result.result.value;
  };
  const wait=async selector=>{
    for(let i=0;i<100;i++){
      if(await evaluate('Boolean(document.querySelector('+JSON.stringify(selector)+'))'))return;
      await new Promise(r=>setTimeout(r,40));
    }
    throw new Error('Fehlt: '+selector);
  };
  const navigate=async(path,selector)=>{await c('Page.navigate',{url:origin+'/'+path});await wait(selector);};
  const documentFrame=()=>evaluate('document.fonts.ready.then(()=>new Promise(resolve=>requestAnimationFrame(resolve))).then(()=>Promise.allSettled(document.getAnimations().map(animation=>animation.finished)))');
  await c('Page.enable');await c('Runtime.enable');
  await c('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('','#topics-search');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.tab-dock')).position"),'static');
  assert.equal(await evaluate("document.querySelector('.tab-dock').getBoundingClientRect().top < 60"),true);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.tab-dock svg')).display"),'none');
  if(output){
    await evaluate("document.fonts.ready.then(()=>true)");
    await writeFile(output+'-desktop.png',Buffer.from((await c('Page.captureScreenshot',{format:'png'})).data,'base64'));
  }
  await evaluate("document.querySelector('#thema-statistik summary').click()");
  assert.equal(await evaluate("document.querySelector('#thema-statistik').open"),true);
  await evaluate("(()=>{const x=document.querySelector('#preview-z');x.value=0;x.dispatchEvent(new Event('input'))})()");
  assert.match(await evaluate("document.querySelector('#preview-value').value"),/^50\s%$/);
  assert.equal(await evaluate("document.querySelectorAll('[data-topic]').length"),10);
  await evaluate("(()=>{const s=document.querySelector('#topics-search');s.value='tukey';s.dispatchEvent(new Event('input'))})()");
  assert.match(await evaluate("document.querySelector('#topic-matches').innerText"),/passende Lektion/);
  assert.equal(await evaluate("document.querySelector('[data-lesson=boxplot]').hidden"),false);
  assert.equal(await evaluate("document.querySelector('[data-lesson=landkarte]').hidden"),true);
  await evaluate("(()=>{const s=document.querySelector('#topics-search');s.value='xyz-ohne-treffer';s.dispatchEvent(new Event('input'))})()");
  assert.match(await evaluate("document.querySelector('#topic-matches').innerText"),/Keine Lektionen gefunden/);
  await evaluate("(()=>{const s=document.querySelector('#topics-search');s.value='';s.dispatchEvent(new Event('input'))})()");
  await evaluate("document.querySelector('.hero .primary').click()");
  await wait('#quiz');
  await evaluate("document.querySelector('#quiz input[value=\"1\"]').click(); document.querySelector('#quiz button').click()");
  assert.match(await evaluate("document.querySelector('#quiz-feedback').innerText"),/^Richtig/);
  await evaluate("location.hash='/'");
  await wait('.resume-label');
  assert.match(await evaluate("document.querySelector('.resume-label').innerText"),/Zuletzt geöffnet/);
  await evaluate("document.querySelector('.hero .primary').click()");
  await wait('#done');
  await evaluate("document.querySelector('#done').click(); location.hash='/'");
  await wait('#topics-search');
  await c('Page.reload');
  await wait('.learning-progress');
  assert.match(await evaluate("document.querySelector('.learning-progress').innerText"),/^1 von /);

  await navigate('#/lektion/sigmoid','#lab-0');
  assert.equal(await evaluate("document.querySelectorAll('#lesson-explanations details[open]').length"),1);
  await evaluate("document.querySelector('#toggle-explanations').click()");
  assert.equal(await evaluate("document.querySelectorAll('#lesson-explanations details:not([open])').length"),0);
  await evaluate("document.querySelector('#toggle-explanations').click()");
  assert.equal(await evaluate("document.querySelectorAll('#lesson-explanations details[open]').length"),0);
  await evaluate("(()=>{document.querySelector('#calculation li:nth-child(2) summary').click();const input=document.querySelector('#lab-0');input.value='0';input.dispatchEvent(new Event('input'))})()");
  assert.equal(await evaluate("document.querySelector('#calculation li:nth-child(2) details').open"),true);
  assert.equal(await evaluate("document.querySelector('#result').value"),'50 %');
  await evaluate("(()=>{const field=document.querySelector('.exact-value');field.value='-0,35';field.dispatchEvent(new Event('change'))})()");
  assert.equal(await evaluate("document.querySelector('#lab-0').value"),'-0.35');
  assert.match(await evaluate("document.querySelector('#result').value"),/^41,3382/);
  await evaluate("(()=>{const field=document.querySelector('.exact-value');field.value='12';field.dispatchEvent(new Event('change'))})()");
  assert.equal(await evaluate("document.querySelector('.exact-value').getAttribute('aria-invalid')"),'true');
  await evaluate("document.querySelector('#reset').click()");
  assert.equal(await evaluate("document.querySelector('.exact-value').value"),'0,35');

  await navigate('#/labor/datenwerte','#lab-0');
  await evaluate("(()=>{const input=document.querySelector('#lab-0');input.value='-2; 0; 2,5';input.dispatchEvent(new Event('input'))})()");
  assert.match(await evaluate("document.querySelector('#result').value"),/0,1667/);
  await evaluate("document.querySelector('#lab-0').value='kein Wert';document.querySelector('#lab-0').dispatchEvent(new Event('input'))");
  assert.equal(await evaluate("document.querySelector('#result').value"),'Eingabe prüfen');
  await evaluate("document.querySelector('#reset').click()");
  assert.match(await evaluate("document.querySelector('#result').value"),/Mittelwert 7/);

  await navigate('#/pruefung','.case-list');
  assert.equal(await evaluate("document.querySelectorAll('.case-list li').length"),8);
  await evaluate("document.querySelector('.case-list li a').click()");
  await wait('#case-form');
  await evaluate("document.querySelector('#task-0').value='5';document.querySelector('#task-1').value='60 %';document.querySelector('#task-2').value='70';document.querySelector('#case-form button').click()");
  assert.match(await evaluate("document.querySelector('#case-feedback').innerText"),/^2 von 4/);
  await evaluate("document.querySelector('#task-2').value='75';document.querySelector('#task-3').value='85';document.querySelector('#case-form button').click()");
  assert.match(await evaluate("document.querySelector('#case-feedback').innerText"),/^4 von 4/);
  await evaluate("document.querySelector('.case-questions details summary').click()");
  assert.equal(await evaluate("document.querySelector('.case-questions details').open"),true);

  await navigate('#/labor/gini','#lab-0');
  assert.match(await evaluate("document.querySelector('#result').innerText"),/0,2133/);
  await evaluate("document.querySelector('#answer').value='0,5'; document.querySelector('#numeric button').click()");
  assert.match(await evaluate("document.querySelector('#answer-feedback').innerText"),/^Richtig/);
  await evaluate("(()=>{const s=document.querySelector('#lab-0');s.value=7;s.dispatchEvent(new Event('input'))})()");
  assert.notEqual(await evaluate("document.querySelector('#result').innerText"),'ΔG = 0,2133');
  await evaluate("document.querySelector('#reset').click()");
  assert.equal(await evaluate("document.querySelector('#result').innerText"),'ΔG = 0,2133');
  await navigate('#/formeln','#search');
  await evaluate("(()=>{const s=document.querySelector('#search');s.value='tukey';s.dispatchEvent(new Event('input'))})()");
  assert.equal(await evaluate("document.querySelector('#matches').innerText"),'1 Eintrag');
  await navigate('#/glossar','#search');
  await evaluate("(()=>{const s=document.querySelector('#search');s.value='overfitting';s.dispatchEvent(new Event('input'))})()");
  assert.equal(await evaluate("document.querySelector('#matches').innerText"),'1 Eintrag');

  await c('Emulation.setDeviceMetricsOverride',{width:721,height:812,deviceScaleFactor:1,mobile:false});
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.tab-dock')).position"),'static');
  const tablet=await evaluate("({width:innerWidth,nav:document.querySelector('.tab-dock').getBoundingClientRect().left,brand:document.querySelector('.brand').getBoundingClientRect().right})");
  assert.ok(tablet.nav > tablet.brand,JSON.stringify(tablet));
  await c('Emulation.setDeviceMetricsOverride',{width:720,height:812,deviceScaleFactor:1,mobile:true});
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.tab-dock')).position"),'fixed');
  await c('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
  await c('Emulation.setTouchEmulationEnabled',{enabled:true});
  await navigate('#/labor/knn','#lab-0');
  await evaluate("document.querySelector('.theme').click();document.querySelector('[data-theme-choice=dark]').click()");
  assert.equal(await evaluate("document.documentElement.dataset.theme"),'dark');
  assert.equal(await evaluate("getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()"),'#000');
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true);
  assert.equal(await evaluate("getComputedStyle(document.body).backgroundColor"),'rgb(0, 0, 0)');
  assert.equal(await evaluate("document.querySelector('.tab-dock [aria-current]').dataset.nav"),'labor');
  const dock="document.querySelector('.tab-dock').getBoundingClientRect()";
  assert.equal(await evaluate(dock+".bottom <= innerHeight && "+dock+".top > innerHeight - 100"),true);
  if(output){
    await evaluate("document.querySelector('main').focus({preventScroll:true}); window.scrollTo(0,0)");
    await documentFrame();
    await writeFile(output+'-handy.png',Buffer.from((await c('Page.captureScreenshot',{format:'png'})).data,'base64'));
  }
  for(const route of ['#/','#/labor/matrix','#/labor/boxplot','#/labor/iris','#/formeln','#/glossar','#/lektion/sigmoid','#/pruefung','#/fall/mangel','#/mitmachen']) {
    await navigate(route,'main h1');
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true,route);
  }
  await evaluate("window.scrollTo(0,document.documentElement.scrollHeight)");
  assert.equal(await evaluate("document.querySelector('footer').getBoundingClientRect().bottom < document.querySelector('.tab-dock').getBoundingClientRect().top"),true);
  assert.equal(await evaluate("document.querySelector('footer a[href*=github]').href"),'https://github.com/mixxermannipro/ki-lernstudio');
  assert.equal(await evaluate("document.querySelector('main a[href*=CONTRIBUTING]').pathname"),'/mixxermannipro/ki-lernstudio/blob/main/CONTRIBUTING.md');
  await c('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await navigate('#/lektion/sigmoid','#quiz');
  assert.equal(await evaluate("String(getComputedStyle(document.querySelector('.disclosure'),'::details-content').transitionDuration)"),'0s');
  await c('Emulation.setDeviceMetricsOverride',{width:320,height:740,deviceScaleFactor:1,mobile:true});
  await navigate('#/','#topics-search');
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true);
  await navigate('#/labor/knn','#lab-0');
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true);
  assert.deepEqual(errors,[]);
  console.log('Chromium OK: Themensuche, Fortschritt, aufklappbare Erklärung, Laboreingabe, Prüfungstraining, Formelsuche, Dunkelmodus und zehn Handyansichten.');
} finally { ws.close(); browser.kill(); }
