// Einordnung aus Rahmenplan und Musterunterlagen. Die Beispiele sind neu formuliert.
export const examTopics = [
  {name:'Metriken und Modellbewertung', evidence:'DQR-5-Muster 4, 14, 23–25 · DQR-4-Aufgabenmuster C2/C7', action:'Konfusionsmatrix lesen, Accuracy, Precision, Recall und F1 berechnen. Datenleck erkennen und eine Metrik begründen.', lessons:['matrix-binaer','iris','schwelle','aufteilung','kreuzvalidierung','modellvergleich']},
  {name:'Entscheidungsbäume und Ensembles', evidence:'DQR-5-Muster 1, 19, 20, 23 · DQR-4-Aufgabenmuster C1/C5 · Rahmenplan 1.3.10–1.3.12',action:'Einen Baum lesen, einen Split vergleichen, Overfitting erkennen und Begrenzung oder Ensemble begründen.',lessons:['baum','splits','entropie','pruning','wald']},
  {name:'kNN und Vorverarbeitung', evidence:'DQR-5-Muster 6, 8, 9, 10 · Rahmenplan 1.3.16–1.3.17',action:'Abstände von Hand berechnen, Nachbarn auswählen und erklären, warum Skalierung die Wahl ändert.',lessons:['knn','nachbarwahl','skalierung','skalierungswahl']},
  {name:'Regression, Klassifikation und Fehlermaße', evidence:'DQR-5-Muster 2, 3, 20 · DQR-4-Aufgabenmuster C3/C4',action:'Eine Gerade auswerten, MAE und RMSE erklären, eine Klassenwahrscheinlichkeit berechnen und den Ausgang einordnen.',lessons:['gerade','regressionsfehler','grenze','sigmoid','training']},
  {name:'Datenverständnis und Statistik',evidence:'DQR-4-Aufgabenmuster B2–B4 · Rahmenplan 1.2 und 1.3.5–1.3.7 · Kursaufgaben zum Boxplot',action:'Messwerte sortieren, Kennzahlen rechnen, Diagramme lesen und geeignete Datenkorrekturen vorschlagen.',lessons:['eda','datenqualitaet','titanic','lage','varianz','boxplot','korrelation']},
  {name:'Grundbegriffe, Modelle und Projektaufbau',evidence:'DQR-5-Muster 2, 5, 12, 13 · DQR-4-Aufgabenmuster A2–A4/C6',action:'Lernarten zuordnen, die Rolle von Schichten erklären, Trainingsschritte beschreiben und eine Anforderung prüfbar machen.',lessons:['lernarten','pipeline','netze','sdd','testfaelle']},
  {name:'Prozesse und Recht',evidence:'DQR-5-Rahmenplan, Handlungsbereiche 2 und 3 · Kursfälle',action:'Prozesse beschreiben, die Wirkung einer Änderung messen und in einem Rechtsfall Anspruch, Vertragstyp oder Schutzgegenstand zuordnen.',lessons:['prozess','wertkette','rechnung','kpi','vertrag','agb','kivertrag','steuern','schutz']}
];

export const examOutlook = [
  ['SQL und Datenfluss','Muster 1, 4, 14, 15, 19','Übe SELECT, WHERE, JOIN und GROUP BY. Prüfe, ob pro Fall weiterhin genau eine Zeile vorliegt, und unterscheide NULL von 0.'],
  ['Clustering, Anomalien und PCA','Muster 9, 10, 17, 18','Vergleiche k-Means und DBSCAN. Unterscheide Gruppen, dichte Regionen und Ausreißer. Erkläre bei PCA, wann eine niedrigere Dimension hilft.'],
  ['Zeitreihen und Prognosen','Muster 3, 16, 21','Beschreibe Trend und Saisonalität, bilde Zeitfenster, trenne chronologisch und begründe den Einsatz von MAE oder RMSE. Modelle wie Prophet und SARIMAX gehören in diesen Block.'],
  ['Vertiefung neuronaler Netze, CNN und PyTorch','Muster 5, 7, 11, 12, 16, 22','Erkläre Tensoren, DataLoader, Faltung, Kernel, Stride und Trainingsschleife. Rechne Eingabe- und Ausgabegrößen nach und vergleiche Architekturen.'],
  ['Datenschutz, Fairness, Bereitstellung und Betrieb','Muster 5, 7, 13 · DQR-4-Aufgabenmuster D1–D3','Benennen, welche Daten wofür gebraucht werden, Modellfehler je Gruppe untersuchen und Maßnahmen für einen überwachten Betrieb begründen. Datenschutz und KI-Recht stehen im Rechtsskript auch als Folgetermine.']
];

const task=(question,answer,unit,explanation)=>({question,answer,unit,explanation});
export const examCases = [
  {id:'mangel', title:'Defekte in der Fertigung', lab:'matrix', context:'Von 100 Teilen sind 20 defekt. Das Modell erkennt 15 davon. Es markiert außerdem 10 intakte Teile als defekt.',
   tasks:[task('Berechne die Zahl der übersehenen Defekte (FN).',5,'','20 tatsächlich defekt − 15 erkannte Defekte = 5 FN.'),
    task('Berechne Precision in Prozent.',60,'%', 'Die 25 positiven Vorhersagen bestehen aus 15 Treffern und 10 Fehlalarmen. 15 / 25 = 60 %.'),
    task('Berechne Recall in Prozent.',75,'%', 'Von den 20 tatsächlich defekten Teilen werden 15 erkannt. 15 / 20 = 75 %.'),
    task('Berechne Accuracy in Prozent.',85,'%', '70 der 80 intakten Teile werden richtig erkannt. (15 + 70) / 100 = 85 %.')],
   hint:'Defekt ist die positive Klasse. Zeichne zwei Zeilen für die wahren Klassen.', transfer:'Wenn übersehene Defekte besonders teuer sind, ist Recall für die Entscheidung wichtig. Prüfe auch die Auswirkungen zusätzlicher Fehlalarme.'},
  {id:'split',title:'Einen Baum-Split bewerten',lab:'gini',context:'Ein Knoten hat 10 Teile, 6 gut und 4 fehlerhaft. Nach einem Split enthält das linke Kind 4 gute Teile. Im rechten Kind bleiben die übrigen 6 Teile.',
   tasks:[task('Berechne den Gini-Wert des Elternknotens.',.48,'','1 − (6/10)² − (4/10)² = 0,48.'),
    task('Berechne den gewichteten Gini-Wert des Splits. Runde auf vier Stellen.',.2667,'','Links Gini 0. Rechts 1 − (2/6)² − (4/6)² = 4/9. Gewichtet: 4/10 · 0 + 6/10 · 4/9 ≈ 0,2667.'),
    task('Berechne die Gini-Abnahme auf vier Stellen.',.2133,'','0,48 − 0,2667 ≈ 0,2133.')],
   hint:'Rechne erst für jedes Kind, danach gewichte mit seiner Fallzahl.',transfer:'Unter denselben Kandidaten ist eine größere Gini-Abnahme für diesen Knoten günstiger. Prüfe anschließend die Generalisierung des ganzen Baums.'},
  {id:'wartung',title:'Prognosefehler bei Wartungsfällen',lab:'fehler',context:'Vier gemessene Prognosefehler sind −2, 0, 2 und 8 Stunden. Ein Team möchte typische sowie ungewöhnlich große Fehler beurteilen.',
   tasks:[task('Berechne MAE in Stunden.',3,'h','(2 + 0 + 2 + 8) / 4 = 3.'),
    task('Berechne MSE in Quadratstunden.',18,'h²','(4 + 0 + 4 + 64) / 4 = 18.'),
    task('Berechne RMSE auf zwei Dezimalstellen.',4.24,'h','√18 ≈ 4,24.')],
   hint:'Bei MAE Beträge bilden. Bei RMSE zuerst quadrieren, dann mitteln, dann die Wurzel ziehen.',transfer:'Wenn große Fehler unverhältnismäßig teuer sind, kann RMSE eine passende Ergänzung zur mittleren absoluten Abweichung sein.'},
  {id:'skalierung',title:'Merkmale vor kNN skalieren',lab:'scaler',context:'Das Trainingsalter liegt zwischen 20 und 60 Jahren. Der Trainingsmittelwert beträgt 40 Jahre und die Standardabweichung 10 Jahre. Beurteile einen neuen Fall mit 50 Jahren.',
   tasks:[task('Berechne den Min-Max-Wert.',.75,'','(50 − 20) / (60 − 20) = 30/40 = 0,75.'),
    task('Berechne den z-Score.',1,'','(50 − 40) / 10 = 1.')],
   hint:'Für Min-Max sind Minimum und Maximum relevant. Für z-Score brauchst du Mittelwert und Standardabweichung.',transfer:'Der neue Fall bestimmt die Trainingskennzahlen nicht mit. Dadurch bleibt die Bewertung vergleichbar mit späteren, unbekannten Fällen.'},
  {id:'abstand',title:'Eine kNN-Distanz nachrechnen',lab:'knn',context:'Von einem Testpunkt Q = (2 | 1) zu einem Trainingspunkt P = (5 | 5) sollst du zwei Distanzen bestimmen.',
   tasks:[task('Berechne Manhattan-Distanz.',7,'','|5 − 2| + |5 − 1| = 3 + 4 = 7.'),
    task('Berechne euklidische Distanz.',5,'','√(3² + 4²) = √25 = 5.')],
   hint:'Die Koordinatendifferenzen sind 3 und 4.',transfer:'Bei neuer Distanzmetrik musst du die Distanzen zu allen Kandidaten neu berechnen und danach erneut sortieren.'},
  {id:'streuung',title:'Lage und Ausreißer',lab:'datenwerte',context:'Eine Anlage braucht für sieben Aufgaben 1, 2, 3, 4, 5, 6 und 15 Sekunden. Bei ungeradem n wird der Median bei der Bildung der beiden Hälften weggelassen.',
   tasks:[task('Bestimme den Median.',4,'s','Die vierte von sieben sortierten Beobachtungen ist 4.'),
    task('Berechne den IQR.',4,'s','Q₁ = 2 und Q₃ = 6. Daher 6 − 2 = 4.'),
    task('Bestimme den oberen Tukey-Zaun.',12,'s','6 + 1,5 · 4 = 12.'),
    task('Welcher Messwert ist ein Ausreißer?',15,'s','15 liegt oberhalb des oberen Zauns. Der obere Whisker endet am letzten beobachteten Wert innerhalb des Zauns, also bei 6.')],
   hint:'Berechne getrennt die Mitte der unteren und oberen drei Werte.',transfer:'Prüfe, ob der Ausreißer ein Messfehler oder eine echte Verzögerung war. Die Zahl allein entscheidet nicht über das Entfernen.'},
  {id:'validierung',title:'Kreuzvalidierung beurteilen',lab:'folds',context:'Fünf Folds liefern jeweils 78 %, 88 %, 82 %, 80 % und 92 % Accuracy.',
   tasks:[task('Berechne die durchschnittliche Accuracy in Prozent.',84,'%', '(78 + 88 + 82 + 80 + 92) / 5 = 84 %.'),
    task('Berechne die Spannweite in Prozentpunkten.',14,'PP','92 − 78 = 14 Prozentpunkte.')],
   hint:'Der Mittelwert benutzt alle fünf Werte. Die Spannweite nutzt nur Minimum und Maximum.',transfer:'Prüfe bei schwankenden Fold-Werten besonders ungleiche Klassenverhältnisse, kleine Teilmengen und auffällige Gruppen.'},
  {id:'prozessziel',title:'Erfolg einer Prozessänderung messen',lab:'quote',context:'Vor der OCR-Unterstützung wurden 40 % der Rechnungen automatisch und korrekt erfasst, danach 60 %.',
   tasks:[task('Berechne den Unterschied in Prozentpunkten.',20,'PP','60 % − 40 % = 20 Prozentpunkte.'),
    task('Berechne die relative Verbesserung in Prozent.',50,'%', '20 / 40 = 0,5 = 50 %.')],
   hint:'Für die relative Verbesserung ist die ursprüngliche Quote der Bezugswert.',transfer:'Ergänze eine Kontrollkennzahl, etwa die Quote falsch erfasster Beträge. Nur dann ist erkennbar, ob der schnellere Ablauf verlässlich bleibt.'}
];
