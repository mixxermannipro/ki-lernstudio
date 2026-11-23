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
  await c('Page.enable');await c('Runtime.enable');
  await c('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await navigate('','#preview-z');
  const initial=await evaluate("document.querySelector('#preview-value').innerText");
  await evaluate("(()=>{const s=document.querySelector('#preview-z');s.value=0;s.dispatchEvent(new Event('input'))})()");
  assert.match(await evaluate("document.querySelector('#preview-value').innerText"),/50/);
  assert.notEqual(initial,await evaluate("document.querySelector('#preview-value').innerText"));
  if(output){
    await evaluate("document.querySelector('#preview-z').value=.35; document.querySelector('#preview-z').dispatchEvent(new Event('input'))");
    await new Promise(r=>setTimeout(r,650));
    await writeFile(output+'-desktop.png',Buffer.from((await c('Page.captureScreenshot',{format:'png'})).data,'base64'));
  }
  await evaluate("document.querySelector('.hero .primary').click()");
  await wait('#quiz');
  await evaluate("document.querySelector('#quiz input[value=\"1\"]').click(); document.querySelector('#quiz button').click()");
  assert.match(await evaluate("document.querySelector('#quiz-feedback').innerText"),/^Richtig/);
  await evaluate("document.querySelector('#done').click(); location.hash='/'");
  await wait('#preview-z');
  await c('Page.reload');
  await wait('.progress-summary');
  assert.match(await evaluate("document.querySelector('.progress-summary').innerText"),/^1 von /);

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

  await c('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
  await c('Emulation.setTouchEmulationEnabled',{enabled:true});
  await navigate('#/labor/knn','#lab-0');
  await evaluate("document.querySelector('.theme').click();document.querySelector('.theme').click()");
  assert.equal(await evaluate("document.documentElement.dataset.theme"),'dark');
  assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true);
  if(output){
    await new Promise(resolve=>setTimeout(resolve,400));
    await writeFile(output+'-handy.png',Buffer.from((await c('Page.captureScreenshot',{format:'png'})).data,'base64'));
  }
  for(const route of ['#/','#/labor/matrix','#/labor/boxplot','#/formeln','#/glossar','#/lektion/sigmoid','#/mitmachen']) {
    await navigate(route,'main h1');
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"),true,route);
  }
  assert.deepEqual(errors,[]);
  console.log('Chromium OK: Start, Quiz, Fortschritt, Labore, Rechenprüfung, Suche, Dark Mode und sieben Handyansichten.');
} finally { ws.close(); browser.kill(); }
