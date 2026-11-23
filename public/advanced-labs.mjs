import { distribution, entropy, fmt, mean, metrics, parseSeries, pct, ratio, sigmoid } from './math.mjs';

const field=(label,min,max,value,step=1)=>({label,min,max,value,step});
const bar=(labels,values)=>({kind:'bars',labels,values});
const points=[[1,2],[2,3],[3,2],[4,5]];

export const advancedLabs = {
  datenwerte: {
    title:'Eigene Daten auswerten', formula:'μ = Σ xᵢ / n · σ² = Σ (xᵢ − μ)² / n',
    question:'Gib eine eigene Zahlenreihe ein und rechne Lage, Streuung und Boxplot nach.',
    inputs:[{label:'Messwerte',value:'2; 3; 5; 6; 19',text:true,hint:'2 bis 24 Werte, getrennt durch Semikolon oder Leerzeichen. Dezimalzahlen gehen mit Komma.'}],
    run([raw]) {
      const xs=parseSeries(raw);
      if(!xs)return {error:'Gib 2 bis 24 Zahlen zwischen −1.000.000 und 1.000.000 ein. Trenne die Werte durch Semikolon oder Leerzeichen.'};
      const d=distribution(xs), sum=xs.reduce((a,b)=>a+b,0);
      let total=0;
      const differences=d.xs.map(x=>{const square=(x-d.average)**2;total+=square;return '('+fmt(x)+' − '+fmt(d.average)+')² = '+fmt(square);});
      return {result:'Mittelwert '+fmt(d.average),note:'Median '+fmt(d.q2)+' · Spannweite '+fmt(d.xs.at(-1)-d.xs[0])+' · Ausreißer: '+(d.outliers.map(fmt).join(', ')||'keine')+'.',
        steps:['Sortieren: '+d.xs.map(fmt).join(' · ')+'.','Addieren und teilen: '+fmt(sum)+' / '+xs.length+' = '+fmt(d.average)+'.','Quadrierte Abstände: '+differences.join(' · ')+'. Summe: '+fmt(total)+'.','Grundgesamtheit: '+fmt(total)+' / '+xs.length+' = '+fmt(d.variance)+'. Standardabweichung: '+fmt(Math.sqrt(d.variance))+'.','Stichprobe: '+fmt(total)+' / '+(xs.length-1)+' = '+fmt(d.sampleVariance)+'.','Median '+fmt(d.q2)+', Q₁ '+fmt(d.q1)+', Q₃ '+fmt(d.q3)+'. Tukey-Zäune: '+d.fences.map(fmt).join(' und ')+'.'],
        plot:{kind:'box',...d}};
    },
    exercise:['Werte 2, 4, 6. Wie groß ist die korrigierte Stichprobenvarianz?',4,'Mittelwert 4. Quadrierte Abstände 4, 0, 4. Summe 8. Teile durch 3 − 1.']
  },
  fehler: {
    title:'Regressionsfehler vergleichen', formula:'MAE = Σ |eᵢ| / n · RMSE = √(Σ eᵢ² / n)',
    question:'Verändere einen Prognosefehler und beobachte, wie stark sich MAE und RMSE bewegen.',
    inputs:[field('Fehler 1',-20,20,1),field('Fehler 2',-20,20,-2),field('Fehler 3',-20,20,3)],
    run(errors) {
      const abs=errors.map(Math.abs), squares=errors.map(e=>e*e), mae=mean(abs), mse=mean(squares);
      return {result:'RMSE '+fmt(Math.sqrt(mse)),note:'MAE '+fmt(mae)+' · MSE '+fmt(mse)+'. Gib alle Fehler in derselben Einheit ein.',
        steps:['Vorzeichen für MAE entfernen: '+abs.join(' + ')+' = '+abs.reduce((a,b)=>a+b,0)+'.','Durch 3 teilen: MAE = '+fmt(mae)+'.','Fehler quadrieren: '+squares.join(' + ')+' = '+squares.reduce((a,b)=>a+b,0)+'.','Durch 3 teilen: MSE = '+fmt(mse)+'.','Wurzel ziehen: RMSE = √'+fmt(mse)+' ≈ '+fmt(Math.sqrt(mse))+'.'],
        plot:bar(['MAE','MSE','RMSE'],[mae,mse,Math.sqrt(mse)])};
    },
    exercise:['Fehler −2, 2 und 4. Wie groß ist MSE?',8,'(4 + 4 + 16) / 3 = 8.']
  },
  grenze: {
    title:'Punkt und Trenngerade', formula:'z = w₁x₁ + w₂x₂ + b · d = z / √(w₁² + w₂²)',
    question:'Verschiebe die Grenze und den Punkt. Beobachte Seite und senkrechten Abstand.',
    inputs:[field('Gewicht w₁',-3,3,2,.5),field('Gewicht w₂',-3,3,-1,.5),field('Bias b',-6,6,0,.5),field('Punkt x₁',-4,4,2,.5),field('Punkt x₂',-4,4,3,.5)],
    run([a,b,c,x,y]) {
      const z=a*x+b*y+c, norm=Math.hypot(a,b), d=ratio(z,norm);
      return {result:'z = '+fmt(z),note:norm?'Signierter Abstand '+fmt(d)+'. Bei z = 0 liegt der Punkt auf der Grenze.':'Beide Gewichte sind null. Der Score hängt dann nicht von den Koordinaten ab.',
        steps:['Beiträge: '+fmt(a)+' · '+fmt(x)+' = '+fmt(a*x)+' und '+fmt(b)+' · '+fmt(y)+' = '+fmt(b*y)+'.','Addiere beide Beiträge und Bias '+fmt(c)+': z = '+fmt(z)+'.','Sigmoid schätzt für die positive Klasse '+pct(sigmoid(z))+'.','Norm der Gewichte: √('+fmt(a*a)+' + '+fmt(b*b)+') = '+fmt(norm)+'. Abstand: '+fmt(d)+'.'],
        plot:{kind:'boundary',a,b,c,x,y}};
    },
    exercise:['z = 2 und Gewichte 3, 4. Wie groß ist der signierte Abstand?',.4,'√(3² + 4²) = 5. Also 2 / 5 = 0,4.']
  },
  entropie: {
    title:'Information Gain berechnen', formula:'IG = H Eltern − Σ (n Kind / n gesamt) · H Kind',
    question:'Schiebe Fälle zwischen Klassen und beobachte die Unsicherheit im Elternknoten und in den Kindern.',
    inputs:[field('Links: Klasse A',0,20,4),field('Links: Klasse B',0,20,0),field('Rechts: Klasse A',0,20,0),field('Rechts: Klasse B',0,20,4)],
    run([a,b,c,d]) {
      const l=a+b,r=c+d,n=l+r,h=entropy(a+c,b+d),left=entropy(a,b),right=entropy(c,d);
      const post=n?(l*left+r*right)/n:null;
      return {result:'IG: '+fmt(n?h-post:null)+(n?' Bit':''),note:l&&r?'Ein höherer Wert steht für mehr gewonnene Information.':'Ein gültiger Split braucht Fälle in beiden Kindern.',
        steps:['Aus den Elternzahlen '+(a+c)+' und '+(b+d)+' werden die Anteile '+fmt(ratio(a+c,n))+' und '+fmt(ratio(b+d,n))+'.','Eltern: Addiere die Terme −p · log₂(p). H = '+fmt(n?h:null)+'.','H links = '+fmt(l?left:null)+', H rechts = '+fmt(r?right:null)+'.','Gewichte '+fmt(ratio(l,n))+' und '+fmt(ratio(r,n))+'. Ziehe die gewichtete Entropie '+fmt(post)+' von H ab.'],
        plot:bar(['Eltern','Links','Rechts','Split'],[n?h:null,l?left:null,r?right:null,post])};
    },
    exercise:['Elternentropie 1 Bit. Die gleich großen Kinder haben 0 und 0,5 Bit. Wie groß ist IG?',.75,'1 − (0,5 · 0 + 0,5 · 0,5) = 0,75 Bit.']
  },
  schwellenwert: {
    title:'Schwelle an zehn Fällen testen', formula:'Score ≥ Schwelle → positiv',
    question:'Finde eine Schwelle für ein Team, das möglichst wenige Defekte übersehen möchte.',
    inputs:[field('Schwelle (%)',0,100,50,5)],
    run([limit]) {
      const scores=[95,81,72,65,55,49,42,34,19,10];
      const truth=[1,1,0,1,0,1,0,1,0,0];
      const values=[0,0,0,0];
      const cases=scores.map((score,i)=>{
        const positive=score>=limit;
        const bucket=truth[i]?(positive?0:2):(positive?1:3);
        values[bucket]++;
        return {score,actual:truth[i],predicted:Number(positive)};
      });
      const [tp,fp,fn,tn]=values;
      const [,precision,recall]=metrics(...values);
      return {result:'Recall '+pct(recall),note:'Precision '+pct(precision)+' · '+fn+' übersehen · '+fp+' Fehlalarme.',
        steps:['Markiere alle Scores ab '+limit+' % als positiv.','Vergleiche mit der tatsächlichen Klasse: TP '+tp+', FP '+fp+', FN '+fn+', TN '+tn+'.','Recall = TP / (TP + FN) = '+tp+' / '+(tp+fn)+' = '+pct(recall)+'.','Precision = TP / (TP + FP) = '+tp+' / '+(tp+fp)+' = '+pct(precision)+'.'],
        plot:{kind:'scores',cases,limit}};
    },
    exercise:['Ein tatsächlicher Defekt hat Score 64 %. Ist er bei Schwelle 65 % ein TP (1) oder ein FN (0)?',0,'64 < 65. Das Modell sagt negativ, obwohl der Fall tatsächlich positiv ist.']
  },
  neuron: {
    title:'Ein Neuron selbst rechnen', formula:'z = w₁x₁ + w₂x₂ + b · ReLU(z) = max(0, z)',
    question:'Teste, wann das Neuron bei ReLU ein Signal weitergibt.',
    inputs:[field('Eingabe x₁',-4,4,2,.5),field('Eingabe x₂',-4,4,-1,.5),field('Gewicht w₁',-3,3,.5,.5),field('Gewicht w₂',-3,3,2,.5),field('Bias',-3,3,.5,.5)],
    run([x,y,a,b,c]) {
      const z=x*a+y*b+c, relu=Math.max(0,z);
      return {result:'ReLU = '+fmt(relu),note:'Zum Vergleich: Sigmoid(z) = '+fmt(sigmoid(z))+'. Beide Funktionen verarbeiten denselben Rohwert.',
        steps:['Erster Beitrag: '+fmt(x)+' · '+fmt(a)+' = '+fmt(x*a)+'.','Zweiter Beitrag: '+fmt(y)+' · '+fmt(b)+' = '+fmt(y*b)+'.','Beide Beiträge und Bias addieren: z = '+fmt(z)+'.','Größeren Wert aus 0 und z wählen: '+fmt(relu)+'.'],
        plot:bar(['x₁ · w₁','x₂ · w₂','Bias','z','ReLU'],[x*a,y*b,c,z,relu])};
    },
    exercise:['x₁ = 4, w₁ = 0,5, x₂ = 1, w₂ = −1, b = 0,5. Welche ReLU-Ausgabe entsteht?',1.5,'4 · 0,5 + 1 · (−1) + 0,5 = 1,5. ReLU lässt positive Werte unverändert.']
  },
  korrelation: {
    title:'Pearson-Korrelation sehen',formula:'r = Σ [(xᵢ − x̄)(yᵢ − ȳ)] / √[Σ (xᵢ − x̄)² · Σ (yᵢ − ȳ)²]',
    question:'Verschiebe den letzten Punkt. Wann wird der Zusammenhang schwächer oder kehrt sich um?',
    inputs:[field('Letzter y-Wert bei x = 5',-5,10,6,.5)],
    run([last]) {
      const samples=[...points,[5,last]], mx=mean(samples.map(p=>p[0])),my=mean(samples.map(p=>p[1]));
      const offsets=samples.map(([x,y])=>[x-mx,y-my]);
      const cross=offsets.reduce((sum,[x,y])=>sum+x*y,0);
      const sx=offsets.reduce((sum,[x])=>sum+x*x,0),sy=offsets.reduce((sum,[,y])=>sum+y*y,0);
      const r=ratio(cross,Math.sqrt(sx*sy));
      return {result:'r = '+fmt(r),note:'Ein Zusammenhang im Diagramm sagt nichts darüber aus, welcher Wert den anderen verursacht.',
        steps:['Mittelwerte: x̄ = '+fmt(mx)+' und ȳ = '+fmt(my)+'.','Je Punkt die Mittelwerte abziehen, dann beide Abweichungen multiplizieren. Die Summe ist '+fmt(cross)+'.','Quadrierte Abweichungen je Achse addieren: '+fmt(sx)+' und '+fmt(sy)+'.','Durch √('+fmt(sx)+' · '+fmt(sy)+') teilen: r = '+fmt(r)+'.'],
        plot:{kind:'paired',samples}};
    },
    exercise:['Punkte (1|2), (2|4), (3|6) liegen auf einer steigenden Geraden. Wie groß ist r?',1,'Alle Punkte liegen exakt auf derselben steigenden Geraden.']
  },
  iris: {
    title:'Iris-Matrix für drei Klassen',formula:'Accuracy = Summe der Diagonale / Gesamtzahl',
    question:'Ändere die Verwechslungen zwischen Versicolor und Virginica. Jede Art hat 50 tatsächliche Fälle.',
    inputs:[field('Versicolor als Virginica',0,25,3),field('Virginica als Versicolor',0,25,2)],
    run([a,b]) {
      const tp=50-a, [,precision,recall,f1]=metrics(tp,b,a,100-b);
      const result=(150-a-b)/150;
      return {result:'Accuracy '+pct(result),note:'Für Versicolor: Precision '+pct(precision)+' · Recall '+pct(recall)+' · F1 '+pct(f1)+'.',
        steps:['Diagonale: 50 + '+(50-a)+' + '+(50-b)+' = '+(150-a-b)+' Treffer.','Gesamtzahl: 50 + 50 + 50 = 150. Accuracy = '+(150-a-b)+' / 150 = '+pct(result)+'.','Versicolor einzeln: TP = '+tp+', FP = '+b+', FN = '+a+'.','Precision = '+tp+' / '+(tp+b)+' = '+pct(precision)+'. Recall = '+tp+' / 50 = '+pct(recall)+'.'],
        plot:{kind:'multiclass',labels:['Setosa','Versicolor','Virginica'],values:[[50,0,0],[0,50-a,a],[0,b,50-b]]}};
    },
    exercise:['Auf der Diagonale stehen 50, 45 und 40. Bei 150 Fällen: Wie viel Prozent Accuracy?',90,'(50 + 45 + 40) / 150 = 135 / 150 = 90 %.']
  },
  batch: {
    title:'Logistische Regression: Batch trainieren',formula:'gⱼ = (1/n) · Σ (pᵢ − yᵢ) · xᵢⱼ',
    question:'Beobachte, was aus zwei Trainingsbeispielen nach mehreren Updates wird.',
    inputs:[field('Lernrate α',0,1,.1,.05),field('Anzahl Updates',1,24,1)],
    run([rate,iterations]) {
      const history=[];
      let w1=0,w2=0,b=0,p0,p1,g,gBias,old;
      for(let step=0;step<=iterations;step++){
        p0=sigmoid(b);
        p1=sigmoid(w1+w2+b);
        history.push(-Math.log1p(-p0)/2-Math.log(p1)/2);
        if(step===iterations)break;
        g=(p1-1)/2;
        gBias=(p0+p1-1)/2;
        old=[w1,w2,b,p0,p1];
        w1-=rate*g;
        w2-=rate*g;
        b-=rate*gBias;
      }
      return {result:'Loss '+fmt(history.at(-1)),note:'Trainingsfälle (0 | 0) → 0 und (1 | 1) → 1. Ergebnis nach '+iterations+' Updates.',
        steps:['Vor dem letzten Update: w₁ = '+fmt(old[0])+', w₂ = '+fmt(old[1])+', b = '+fmt(old[2])+'.','Berechne σ(b) = '+fmt(old[3])+' und σ(w₁ + w₂ + b) = '+fmt(old[4])+'.','Für jedes Gewicht ist der Mittelwert der Fehlerbeiträge (0 + ('+fmt(old[4])+' − 1)) / 2 = '+fmt(g)+'. Für den Bias ohne Merkmalsfaktor: '+fmt(gBias)+'.','Aktualisiere alle Parameter gleichzeitig: w₁ = '+fmt(w1)+', w₂ = '+fmt(w2)+', b = '+fmt(b)+'.','Mit den neuen Parametern ergibt sich p₀ = '+fmt(p0)+' und p₁ = '+fmt(p1)+'. Der Verlust beginnt bei '+fmt(history[0])+' und endet bei '+fmt(history.at(-1))+'.'],
        plot:{kind:'history',values:history}};
    },
    exercise:['Starte bei w₁ = w₂ = b = 0 und α = 0,1. Wie groß ist w₁ nach genau einem Update?',.025,'Der Gradient ist (0 + (0,5 − 1)) / 2 = −0,25. Das Update ist 0 − 0,1 · (−0,25) = 0,025.']
  },
  quote: {
    title:'Prozent und Prozentpunkte', formula:'Prozentpunkte = neue Quote − alte Quote',
    question:'Wie unterscheiden sich relative Änderung und Abstand zwischen zwei Quoten?',
    inputs:[field('Alte Quote (%)',0,100,40),field('Neue Quote (%)',0,100,65)],
    run([before,after]) {
      const diff=after-before, relative=ratio(diff,before);
      return {result:fmt(diff)+' Prozentpunkte',note:'Relative Änderung: '+pct(relative)+'. Bei Ausgangswert null ist sie undefiniert.',
        steps:['Ziehe direkt ab: '+before+' % → '+after+' % ergibt '+diff+' Prozentpunkte.','Für die relative Änderung ist die alte Quote der Nenner: '+diff+' / '+before+'.','Relatives Ergebnis als Prozentsatz: '+pct(relative)+'.'],
        plot:bar(['Alt (%)','Neu (%)'],[before,after])};
    },
    exercise:['Von 40 % auf 60 %. Wie groß ist die relative Steigerung in Prozent?',50,'Die Differenz beträgt 20 Prozentpunkte. 20 ÷ 40 = 0,5 = 50 %.']
  }
};
