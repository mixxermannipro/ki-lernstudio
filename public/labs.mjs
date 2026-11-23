import { distribution, entropy, fmt, gini, mean, metrics, pct, ratio, sigmoid } from './math.mjs';

const input = (label, min, max, value, step = 1) => ({ label, min, max, value, step });
const bars = (labels, values, color) => ({ kind:'bars', labels, values, color });

export const labs = {
  sigmoid: {
    title:'Die S-Kurve', formula:'p = 1 / (1 + e⁻ᶻ)', question:'Wie verändert ein höherer Rohwert die Wahrscheinlichkeit?',
    inputs:[input('Rohwert z', -6, 6, 0.35, 0.05), input('Entscheidungsschwelle (%)', 5, 95, 50, 5)],
    run([z, threshold]) {
      const p = sigmoid(z);
      return { result:pct(p), note:'Vorhersage bei dieser Schwelle: Klasse ' + Number(p >= threshold / 100),
        steps:['Drehe das Vorzeichen um: −z = ' + fmt(-z), 'Berechne e hoch −z: ' + fmt(Math.exp(-z)), 'Addiere 1: ' + fmt(1 + Math.exp(-z)), 'Teile 1 durch diesen Wert: ' + fmt(p), 'Vergleiche ' + pct(p) + ' mit ' + threshold + ' %.'],
        plot:{kind:'sigmoid',z,p,threshold:threshold / 100} };
    },
    exercise:['Bei welchem Rohwert ist p genau 50 %?',0,'Bei z = 0 ist e⁰ = 1 und der Nenner 2.']
  },
  gerade: {
    title:'Geraden zeichnen', formula:'ŷ = m · x + b', question:'Wie wirken sich Steigung und Achsenabschnitt auf die Vorhersage aus?',
    inputs:[input('Steigung m',-3,3,2,0.25),input('Achsenabschnitt b',-5,5,0,0.5),input('Eingabe x',-4,4,3,0.25)],
    run([m,b,x]) {
      const y = m*x+b;
      return { result:'ŷ = '+fmt(y), note:'Der markierte Punkt liegt bei ('+fmt(x)+' | '+fmt(y)+').',
        steps:['Multipliziere m und x: '+fmt(m)+' · '+fmt(x)+' = '+fmt(m*x), 'Addiere b: '+fmt(m*x)+' + ('+fmt(b)+') = '+fmt(y), 'Bei x = 0 ist ŷ = '+fmt(b)+'. Das ist der Schnitt mit der y-Achse.'],
        plot:{kind:'line',m,b,x,y} };
    },
    exercise:['Rechne mit m = 2, x = 4 und b = −1. Wie groß ist ŷ?',7,'2 · 4 − 1 = 7.']
  },
  gradient: {
    title:'Ein Trainingsschritt', formula:'w neu = w − α · (p − y) · x', question:'Wie verändern Fehler und Lernrate das Gewicht?',
    inputs:[input('Gewicht w',-2,2,0,0.05),input('Merkmal x',-3,3,2,0.5),input('Tatsächliche Klasse y',0,1,1),input('Lernrate α',0,1,0.1,0.05)],
    run([w,x,y,a]) {
      const p = sigmoid(w*x), loss = y ? -Math.log(p) : -Math.log1p(-p);
      const g = (p-y)*x;
      const next = w-a*g;
      return {result:'w neu = '+fmt(next),note:'Ein Beispiel, fester Bias b = 0. Verlust vor dem Schritt: '+fmt(loss)+'.',
        steps:['Rohwert z = '+fmt(w)+' · '+fmt(x)+' = '+fmt(w*x),'Sigmoid ergibt p = '+fmt(p)+'.','Abweichung p − y = '+fmt(p-y)+'.','Gradient = '+fmt(p-y)+' · '+fmt(x)+' = '+fmt(g)+'.','Update: '+fmt(w)+' − '+fmt(a)+' · ('+fmt(g)+') = '+fmt(next)+'.'],
        plot:bars(['p vorher','p nachher','Ziel y'],[p,sigmoid(next*x),y])};
    },
    exercise:['w = 0, x = 2, y = 1 und α = 0,1. Wie groß ist w nach einem Schritt?',0.1,'p = 0,5, Gradient = −1 und w neu = 0 − 0,1 · (−1).']
  },
  matrix: {
    title:'Confusion Matrix', formula:'Precision = TP / (TP + FP)', question:'Was passiert, wenn das Modell mehr positive Fälle übersieht?',
    inputs:[input('TP · richtig positiv',0,50,8),input('FP · falsch positiv',0,50,2),input('FN · falsch negativ',0,50,4),input('TN · richtig negativ',0,50,16)],
    run([tp,fp,fn,tn]) {
      const [a,p,r,f] = metrics(tp,fp,fn,tn);
      return {result:'F1: '+pct(f), note:'Durch null teilen ist nicht möglich. Die entsprechende Kennzahl bleibt undefiniert.',
        steps:['Accuracy: ('+tp+' + '+tn+') / '+(tp+fp+fn+tn)+' → '+pct(a),'Precision: '+tp+' / '+(tp+fp)+' → '+pct(p),'Recall: '+tp+' / '+(tp+fn)+' → '+pct(r),'F1: '+(2*tp)+' / '+(2*tp+fp+fn)+' → '+pct(f)],
        plot:{kind:'matrix',tp,fp,fn,tn}};
    },
    exercise:['TP = 8 und FP = 2. Wie viel Prozent beträgt die Precision?',80,'8 von 10 positiven Vorhersagen stimmen.']
  },
  baum: {
    title:'Einen Baum durchlaufen', formula:'Länge ≤ 1,9 cm → Setosa', question:'Wo landet deine Iris-Blüte im vereinfachten Beispielbaum?',
    inputs:[input('Länge des Blütenblatts (cm)',1,7,1.4,0.1),input('Breite des Blütenblatts (cm)',0.1,2.5,1.5,0.1)],
    run([length,width]) {
      const short = length <= 1.9, narrow = width <= 1.7;
      const result = short ? 'Setosa' : narrow ? 'Versicolor' : 'Virginica';
      return {result,note:'Vereinfachte Iris-Regeln als Lernbeispiel. Modelle können andere Grenzen lernen.',
        steps:['Prüfe '+fmt(length)+' ≤ 1,9: '+(short?'ja.':'nein.'), short?'Folge dem Ast zu Setosa.':'Prüfe '+fmt(width)+' ≤ 1,7: '+(narrow?'ja.':'nein.'),'Blatt: '+result+'.'],
        plot:{kind:'tree',short,narrow,result}};
    },
    exercise:['Wie viele Fragen stellt der Baum bei Länge 1,5 cm?',1,'Der erste Ast führt bereits in ein Blatt.']
  },
  gini: {
    title:'Einen Split prüfen', formula:'ΔG = G(Eltern) − gewichteter Gini der Kinder', question:'Wie stark sinkt die Mischung durch deine Aufteilung?',
    inputs:[input('Links · Klasse A',0,20,4),input('Links · Klasse B',0,20,0),input('Rechts · Klasse A',0,20,2),input('Rechts · Klasse B',0,20,4)],
    run([a,b,c,d]) {
      const n = a+b+c+d, l = gini(a,b), r = gini(c,d);
      const parent = gini(a+c,b+d), split = n ? ((a+b)*l+(c+d)*r)/n : null;
      const hSplit = n ? ((a+b)*entropy(a,b)+(c+d)*entropy(c,d))/n : null;
      return {result:'ΔG = '+fmt(n ? parent-split : null),note:n && a+b && c+d ? 'Information Gain (Entropie): '+fmt(entropy(a+c,b+d)-hSplit)+' Bit.' : 'Ein gültiger Split braucht Fälle in beiden Kindern.',
        steps:['Eltern: '+(a+c)+' A und '+(b+d)+' B. Gini = '+fmt(n ? parent : null)+'.','Links: '+a+' A und '+b+' B. Gini = '+fmt(a+b ? l : null)+'.','Rechts: '+c+' A und '+d+' B. Gini = '+fmt(c+d ? r : null)+'.','Gewichte: '+(a+b)+'/'+n+' und '+(c+d)+'/'+n+'. Split-Gini = '+fmt(split)+'.'],
        plot:bars(['Eltern','Links','Rechts','Split'], n ? [parent,a+b?l:null,c+d?r:null,split] : [null,null,null,null])};
    },
    exercise:['Eine Gruppe besteht aus 5 Fällen der Klasse A und 5 Fällen der Klasse B. Wie groß ist Gini?',0.5,'1 − 0,5² − 0,5² = 0,5.']
  },
  pruning: {
    title:'Baumgröße abwägen', formula:'Kosten = Trainingsfehler + α · Blattzahl', question:'Ab welcher Strafe lohnt der kleinere Baum?',
    inputs:[input('Straffaktor α',0,0.1,0.02,0.005)],
    run([a]) {
      const deep = 0.08 + a*7, flat = 0.13+a*3;
      return {result:Math.abs(deep-flat)<1e-10?'Gleichstand':deep<flat?'Großer Baum':'Kleiner Baum',note:'Illustrative Kosten. Im Modellvergleich die gewählte Größe auf getrennten Daten prüfen.',
        steps:['7 Blätter: 0,08 + '+fmt(a)+' · 7 = '+fmt(deep),'3 Blätter: 0,13 + '+fmt(a)+' · 3 = '+fmt(flat),'Wähle den kleineren Kostenwert.'],
        plot:bars(['7 Blätter','3 Blätter'],[deep,flat])};
    },
    exercise:['Ein Baum hat 4 Blätter und Fehler 0,1. Kosten bei α = 0,02?',0.18,'0,1 + 0,02 · 4 = 0,18.']
  },
  knn: {
    title:'Nachbarn abstimmen lassen', formula:'L2 = √(Δx² + Δy²) · L1 = |Δx| + |Δy|', question:'Wie ändern Punkt, Nachbarzahl und Distanzregel die Klasse?',
    inputs:[input('Testpunkt x',0,10,5,0.5),input('Testpunkt y',0,10,5,0.5),input('Nachbarn k',1,7,3),{label:'Distanz',value:0,options:['Euklidisch (L2)','Manhattan (L1)']}],
    run([x,y,k,method]) {
      const points = [[2,3,'A'],[3,3,'A'],[3,6,'A'],[4,5,'A'],[6,4,'B'],[7,6,'B'],[8,7,'B']];
      const ranked = points.map(([px,py,c],i) => {
        const dx = Math.abs(px-x), dy = Math.abs(py-y);
        return {px,py,c,i,dx,dy,d:method ? dx+dy : Math.hypot(dx,dy)};
      }).sort((a,b)=>a.d-b.d || a.i-b.i);
      const neighbors = ranked.slice(0,k), count = neighbors.filter(p=>p.c==='A').length;
      return {result:count === k-count ? 'Gleichstand' : 'Klasse '+(count>k-count?'A':'B'),
        note:count+' Stimmen für A, '+(k-count)+' für B. Bei gleichem Abstand entscheidet hier die feste Punktreihenfolge.',
        steps:neighbors.map(p=>'('+fmt(p.px)+' | '+fmt(p.py)+'), '+p.c+': '+(method ? fmt(p.dx)+' + '+fmt(p.dy) : '√('+fmt(p.dx)+'² + '+fmt(p.dy)+'²)')+' = '+fmt(p.d)),
        plot:{kind:'scatter',x,y,points:ranked,k}};
    },
    exercise:['Euklidischer Abstand zwischen (2 | 1) und (5 | 5)?',5,'√(3² + 4²) = √25 = 5.']
  },
  scaler: {
    title:'Merkmale skalieren', formula:'x′ = (x − Zentrum) / Skala', question:'Was macht ein extremer Trainingswert mit den drei Skalierern?',
    inputs:[input('Neuer Wert x',0,100,40),input('Größter Trainingswert',50,150,50)],
    run([x,max]) {
      const data = distribution([10,20,30,40,max]);
      const sd = Math.sqrt(data.variance);
      const scores = [(x-10)/(max-10),(x-data.average)/sd,(x-data.q2)/data.iqr];
      return {result:'Min-Max: '+fmt(scores[0]),note:'Training: '+data.xs.join(', ')+'. x wird erst danach umgerechnet.',
        steps:['Min-Max: ('+x+' − 10) / ('+max+' − 10) = '+fmt(scores[0]),'Standard: ('+x+' − '+fmt(data.average)+') / '+fmt(sd)+' = '+fmt(scores[1]),'Robust: ('+x+' − '+fmt(data.q2)+') / '+fmt(data.iqr)+' = '+fmt(scores[2])],
        plot:bars(['Min-Max','Standard','Robust'],scores)};
    },
    exercise:['Minimum 10, Maximum 50. Welcher Min-Max-Wert entsteht bei x = 30?',0.5,'(30 − 10) / (50 − 10) = 20 / 40.']
  },
  boxplot: {
    title:'Streuung und Boxplot', formula:'IQR = Q₃ − Q₁', question:'Wann wird ein großer Wert zum Ausreißer?',
    inputs:[input('Letzter Messwert',6,22,15)],
    run([last]) {
      const s = distribution([1,2,3,4,5,6,last]);
      return {result:s.outliers.length?'Ausreißer: '+s.outliers.map(fmt).join(', '):'Kein Ausreißer',note:'Datensatz: '+s.xs.join(', ')+'. Quartile hier als Mediane der Hälften, ohne den mittleren Wert.',
        steps:['Q₁ = '+fmt(s.q1)+', Median = '+fmt(s.q2)+', Q₃ = '+fmt(s.q3)+'.','IQR = '+fmt(s.q3)+' − '+fmt(s.q1)+' = '+fmt(s.iqr)+'.','Die Zäune liegen bei '+s.fences.map(fmt).join(' und ')+'. Die Whisker enden bei '+s.whiskers.map(fmt).join(' und ')+'.','Mittelwert = '+fmt(s.average)+'. Die mittlere quadrierte Abweichung ist '+fmt(s.variance)+', für die Stichprobenvarianz durch n − 1 teilen: '+fmt(s.sampleVariance)+'.','Standardabweichung der Grundgesamtheit = √'+fmt(s.variance)+' = '+fmt(Math.sqrt(s.variance))+'.'],
        plot:{kind:'box',...s}};
    },
    exercise:['Q₁ = 2 und Q₃ = 6. Wo liegt der obere Tukey-Zaun?',12,'6 + 1,5 · (6 − 2) = 12.']
  },
  steuer: {
    title:'Netto und Brutto', formula:'Brutto = Netto · (1 + Steuersatz)', question:'Wie berechnest du den Gesamtpreis und wieder zurück?',
    inputs:[input('Nettopreis in Euro',0,500,200,5),input('Vorgegebener Satz (%)',0,30,19)],
    run([net,rate]) {
      const tax = net*rate/100;
      return {result:fmt(net+tax)+' € brutto',note:'Der Satz kommt in dieser Übung aus deiner Eingabe.',
        steps:['Satz umrechnen: '+rate+' / 100 = '+fmt(rate/100),'Steuer: '+net+' · '+fmt(rate/100)+' = '+fmt(tax)+' €','Gesamt: '+net+' + '+fmt(tax)+' = '+fmt(net+tax)+' €','Rückweg: '+fmt(net+tax)+' / '+fmt(1+rate/100)+' = '+net+' €'],
        plot:bars(['Netto','Steuer','Brutto'],[net,tax,net+tax])};
    },
    exercise:['Brutto 119 € bei vorgegebenen 19 %. Wie hoch ist Netto?',100,'119 / 1,19 = 100 €.']
  },
  prozess: {
    title:'Prozesszeit vergleichen', formula:'Verbesserung = (Zeit vorher − Zeit nachher) / Zeit vorher', question:'Wie viel Zeit gewinnt oder verliert der neue Ablauf?',
    inputs:[input('Zeit vorher (Minuten)',1,60,30),input('Zeit nachher (Minuten)',1,60,24)],
    run([before,after]) {
      const saving = before-after;
      return {result:pct(saving/before),note:saving>=0?'Positive Werte zeigen eine Verkürzung.':'Negative Werte zeigen eine Verlängerung.',
        steps:['Differenz: '+before+' − '+after+' = '+saving+' Minuten.','Durch den Ausgangswert teilen: '+saving+' / '+before+' = '+fmt(saving/before)+'.','Mit 100 multiplizieren: '+pct(saving/before)+'.'],
        plot:bars(['Vorher','Nachher'],[before,after])};
    },
    exercise:['Vorher 40 Minuten, nachher 30 Minuten. Wie viel Prozent beträgt die Verkürzung?',25,'(40 − 30) / 40 = 0,25.']
  },
  folds: {
    title:'Kreuzvalidierung auswerten', formula:'Mittel = Summe der Fold-Werte / Zahl der Folds', question:'Wie stark wirkt sich ein schlechter Fold auf das Ergebnis aus?',
    inputs:[input('F1 in Fold 1 (%)',0,100,82),input('F1 in Fold 2 (%)',0,100,85),input('F1 in Fold 3 (%)',0,100,81),input('F1 in Fold 4 (%)',0,100,77),input('F1 in Fold 5 (%)',0,100,85)],
    run(values) {
      const total = values.reduce((a,b)=>a+b,0), low = Math.min(...values), high = Math.max(...values);
      return {result:fmt(mean(values))+' % im Mittel',note:'Spannweite: '+(high-low)+' Prozentpunkte. Vergleiche beide Werte.',
        steps:['Addiere die fünf Ergebnisse: '+values.join(' + ')+' = '+total+'.','Teile durch 5: '+total+' / 5 = '+fmt(mean(values))+'.','Spannweite: '+high+' − '+low+' = '+(high-low)+'.'],plot:bars(values.map((_,i)=>'Fold '+(i+1)),values)};
    },
    exercise:['Die drei Folds liefern 80 %, 90 % und 70 %. Was ist ihr Mittelwert in Prozent?',80,'(80 + 90 + 70) / 3 = 80.']
  }
};
