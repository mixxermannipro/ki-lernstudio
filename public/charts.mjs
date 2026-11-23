import { fmt, sigmoid } from './math.mjs';

const frame = (content, label) => '<svg class="chart" viewBox="0 0 520 226" role="img" aria-label="'+label+'">'+content+'</svg>';
const line = (x1,y1,x2,y2,cls='axis') => '<line class="'+cls+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>';
const circle = (x,y,r,cls) => '<circle class="'+cls+'" cx="'+x+'" cy="'+y+'" r="'+r+'"/>';
const text = (x,y,value,align='middle') => '<text x="'+x+'" y="'+y+'" text-anchor="'+align+'">'+value+'</text>';
const path = points => '<path class="curve" d="'+points.map(([x,y],i)=>(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)).join(' ')+'"/>';
const range = (count, map) => Array.from({length:count},(_,i)=>map(i));
const rows = ([...values], toY) => values.map(v=>line(46,toY(v),494,toY(v),'gridline')+text(37,toY(v)+4,fmt(v),'end')).join('');
const xPlot = (x,min,max) => 46+(x-min)/(max-min)*448;

export function chart(data) {
  if(data.kind === 'sigmoid') {
    const x = v=>xPlot(v,-6,6), y = v=>186-v*155;
    return frame(rows([0,0.25,0.5,0.75,1],y)+line(46,186,494,186)+line(x(0),30,x(0),186,'gridline')+
      [-6,-3,0,3,6].map(v=>text(x(v),207,fmt(v))).join('')+
      line(46,y(data.threshold),494,y(data.threshold),'guide')+
      path(range(121,i=>{const v=-6+i/10;return [x(v),y(sigmoid(v))];}))+
      line(x(data.z),186,x(data.z),y(data.p),'guide')+circle(x(data.z),y(data.p),7,'point current'),
      'Sigmoid. Markierter Rohwert '+fmt(data.z)+' und Wahrscheinlichkeit '+fmt(data.p));
  }
  if(data.kind === 'line') {
    const x = v=>xPlot(v,-4,4), lim = Math.max(2,Math.abs(data.m*4+data.b),Math.abs(-data.m*4+data.b));
    const y = v=>105-v/lim*80;
    return frame(rows([-lim,0,lim],y)+line(x(0),23,x(0),188)+line(46,y(0),494,y(0))+
      [-4,-2,0,2,4].map(v=>text(x(v),208,v)).join('')+
      path([[-4,-4*data.m+data.b],[4,4*data.m+data.b]].map(([u,v])=>[x(u),y(v)]))+
      circle(x(data.x),y(data.y),7,'point current'),'Gerade mit markiertem Punkt '+fmt(data.x)+' und '+fmt(data.y));
  }
  if(data.kind === 'scatter') {
    const x = v=>xPlot(v,0,10), y = v=>184-v*15;
    return frame(rows([0,2,4,6,8,10],y)+[0,2,4,6,8,10].map(v=>text(x(v),207,v)).join('')+
      data.points.slice(0,data.k).map(p=>line(x(data.x),y(data.y),x(p.px),y(p.py),'guide')).join('')+
      data.points.map((p,i)=>circle(x(p.px),y(p.py),i<data.k?8:5,p.c==='A'?'point class-a':'point class-b')+
        text(x(p.px),y(p.py)-13,p.c)).join('')+circle(x(data.x),y(data.y),8,'point current'),'Punktwolke. Linien verbinden den Testpunkt mit den '+data.k+' nächsten Nachbarn.');
  }
  if(data.kind === 'box') {
    const x = v=>xPlot(v,Math.min(0,data.fences[0]),Math.max(data.fences[1],data.xs.at(-1))+1), ticks=[...new Set([...data.fences,...data.whiskers,data.q2])];
    return frame(line(46,166,494,166)+ticks.map(v=>line(x(v),162,x(v),171)+text(x(v),192,fmt(v))).join('')+
      data.fences.map(v=>line(x(v),42,x(v),165,'guide')).join('')+line(x(data.whiskers[0]),94,x(data.whiskers[1]),94,'curve')+
      data.whiskers.map(v=>line(x(v),78,x(v),110,'curve')).join('')+
      '<rect class="box" x="'+x(data.q1)+'" y="64" width="'+(x(data.q3)-x(data.q1))+'" height="60"/>'+
      line(x(data.q2),65,x(data.q2),124,'curve')+data.outliers.map(v=>circle(x(v),94,7,'point current')).join(''),
      'Boxplot. Median '+fmt(data.q2)+', Quartile '+fmt(data.q1)+' und '+fmt(data.q3)+'.');
  }
  if(data.kind === 'matrix') {
    return '<table class="matrix"><caption>Binäre Confusion Matrix</caption><thead><tr><th scope="col">Tatsächlich</th><th scope="col">Positiv vorhergesagt</th><th scope="col">Negativ vorhergesagt</th></tr></thead><tbody>'+
      '<tr><th scope="row">Positiv</th><td class="hit">TP '+data.tp+'</td><td>FN '+data.fn+'</td></tr>'+
      '<tr><th scope="row">Negativ</th><td>FP '+data.fp+'</td><td class="hit">TN '+data.tn+'</td></tr></tbody></table>';
  }
  if(data.kind === 'tree') {
    return frame(line(260,42,128,100,data.short?'curve':'axis')+line(260,42,384,100,!data.short?'curve':'axis')+
      line(384,108,321,168,!data.short&&data.narrow?'curve':'axis')+line(384,108,452,168,!data.short&&!data.narrow?'curve':'axis')+
      text(260,27,'Länge ≤ 1,9?')+text(128,123,'Setosa')+text(384,94,'Breite ≤ 1,7?')+
      text(321,192,'Versicolor')+text(452,192,'Virginica'), 'Entscheidungsbaum. Gewähltes Blatt: '+data.result);
  }
  const min=Math.min(0,...data.values.filter(v=>v!==null)), max=Math.max(0,...data.values.filter(v=>v!==null)), span=max-min||1;
  const y = v=>168-(v-min)/span*121, lane=450/data.values.length;
  const marks=data.values.map((v,i)=>{
    const x=37+lane*(i+0.5), width=Math.min(56,lane*0.55);
    if(v===null) return text(x,205,data.labels[i])+text(x,140,'–');
    return '<rect class="bar" x="'+(x-width/2)+'" y="'+Math.min(y(0),y(v))+'" width="'+width+'" height="'+Math.max(1,Math.abs(y(0)-y(v)))+'" rx="4"/>'+
      text(x,v<0?y(v)+16:y(v)-11,fmt(v))+text(x,205,data.labels[i]);
  }).join('');
  return frame(line(38,y(0),489,y(0))+marks,'Balkendiagramm. '+data.labels.map((l,i)=>l+': '+fmt(data.values[i])).join(', '));
}
