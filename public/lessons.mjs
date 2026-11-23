const lesson = (id, title, intro, steps, prompt, choices, correct, feedback, lab) =>
  ({ id, title, intro, steps, quiz: { prompt, choices, correct, feedback }, lab });

export const modules = [
  { id:'w1', label:'Woche 1', title:'Vom Datensatz zum Modell', summary:'KI-Landkarte, Merkmale, Labels und die erste Pipeline.', lessons:[
    lesson('landkarte','Die KI-Landkarte','KI ist ein Sammelbegriff. Manche Systeme folgen Regeln, andere lernen Muster aus Beispielen.',[
      ['Regeln oder Lernen','Eine Regel kann „wenn zu heiß, dann Alarm“ lauten. Ein ML-Modell lernt aus vielen Beispielen, welche Messwerte zu einem Ausfall passen.'],
      ['Lernarten','Überwachtes Lernen hat Zielwerte. Unüberwachtes Lernen sucht Struktur wie Gruppen. Beim bestärkenden Lernen lernt ein System durch Rückmeldung auf seine Handlungen.'],
      ['Deep Learning und generative KI','Tiefe Netze haben viele Verarbeitungsschichten. CNNs nutzen lokale Muster in Bildern, Transformer gewichten Beziehungen zwischen Teilen der Eingabe. Sprachmodelle arbeiten mit Tokens (Textstücken). Diffusionsmodelle können Bilder aus Rauschen erzeugen.'],
      ['Werkzeuge im Projekt','Für eine Tabelle ist ein kleiner Entscheidungsbaum oft ein sinnvoller Start. Ein Sprachmodell kann Texte erklären oder Code entwerfen. Ein Agent kann zusätzlich Werkzeuge einsetzen. RAG ergänzt eine Antwort mit gefundenen Textstellen. Prüfe Ergebnisse am Original.']
    ],'Wann liegt überwachtes Lernen vor?',['Du suchst Gruppen ohne Zielspalte.','Zu jedem Trainingsbild ist die Klasse bekannt.','Ein Programm folgt einer fest vorgegebenen Regel.'],1,'Bekannte Zielwerte geben beim überwachten Lernen die Rückmeldung.'),
    lesson('pipeline','Merkmale, Labels und ML-Pipeline','Ein Modell lernt nur aus den Informationen, die du ihm zum Training gibst. Plane zuerst die Aufgabe.',[
      ['Ziel formulieren','Beispiel Tasse oder Stift. Das Label ist die richtige Klasse. Masse und Verhältnis von Höhe zu Breite sind Merkmale.'],
      ['Daten sammeln','Bei einer Gestenerkennung brauchst du verschiedene Personen, Winkel und Hintergründe. Sonst lernt das Modell womöglich die Wandfarbe.'],
      ['Ausprobieren','In Teachable Machine kannst du Gesten sammeln, trainieren und live prüfen. In Orange führt Paint Data zur logistischen Regression, dann zu Test & Score und Confusion Matrix.'],
      ['Pipeline abschließen','Teile Daten für Training und Prüfung. Vergleiche mit einer einfachen Ausgangslösung. Stelle das Verfahren bereit, beobachte Fehler und prüfe bei neuen Daten erneut.']
    ],'Was ist beim Erkennen einer Tasse das Label?',['Masse in Gramm','Breite in Zentimetern','Tasse oder Stift'],2,'Das Label ist die Antwort, die das Modell lernen soll.')
  ]},
  { id:'w2', label:'Woche 2', title:'Geraden und Wahrscheinlichkeiten', summary:'Lineare Regression, Trenngerade, Logit und Sigmoid.', lessons:[
    lesson('gerade','Lineare Regression und Trenngerade','Eine Gerade beschreibt, wie sich ein Wert mit einer Eingabe verändert. Als Grenze kann sie zwei Gruppen trennen.',[
      ['Dateien finden','CSV enthält Tabellendaten. Eine Orange-Datei mit der Endung .ows speichert den Ablauf. Sie kann auf eine CSV verweisen. Ein relativer Pfad startet beim aktuellen Ordner, ein absoluter an der Wurzel oder am Laufwerk.'],
      ['Steigung berechnen','A = (1 | 2), B = (3 | 6). Senkrechte Änderung: 6 − 2 = 4. Waagerechte Änderung: 3 − 1 = 2. Steigung m = 4 / 2 = 2. Bei gleicher x-Koordinate ist die Gerade senkrecht.'],
      ['Startwert ermitteln','Setze A in y = m · x + b ein. 2 = 2 · 1 + b. Also b = 0. Für x = 4 sagt die Gerade y = 8 vorher.'],
      ['Grenze nutzen','Für eine Klassifikation kannst du z = w₁x₁ + w₂x₂ + b berechnen. z = 0 beschreibt die Grenze. Das Vorzeichen zeigt die Seite. Sind beide Gewichte null, gibt es keine eindeutige Gerade.']
    ],'Wie groß ist die Steigung zwischen (2 | 3) und (4 | 9)?',['2','3','6'],1,'Die Höhe ändert sich um 6, x um 2. Teile 6 durch 2.','gerade'),
    lesson('sigmoid','Logistische Regression und Sigmoid','Die logistische Regression verwandelt einen Rohwert (Logit) in eine geschätzte Wahrscheinlichkeit.',[
      ['Merkmale einsetzen','Sind x₁ = 0,6 und x₂ = 0,6, rechne z = 1 · 0,6 + 1,25 · 0,6 − 1 = 0,35.'],
      ['Wahrscheinlichkeit berechnen','Negiere z. Berechne e⁻⁰·³⁵ ≈ 0,7047, addiere 1 und teile 1 durch das Ergebnis. Du erhältst rund 0,5866 oder 58,66 %.'],
      ['Entscheiden','Bei einer Schwelle von 50 % wird dieses Beispiel positiv. Eine höhere Schwelle kann weniger positive Vorhersagen und mehr übersehene Fälle bedeuten.'],
      ['Geometrie verstehen','Multiplizierst du alle Gewichte und b mit derselben positiven Zahl, bleibt die Grenze z = 0 gleich. Die Wahrscheinlichkeiten springen nahe der Grenze steiler. Der senkrechte Abstand ergibt sich aus z geteilt durch die Länge des Gewichtsvektors.']
    ],'Welche Wahrscheinlichkeit kommt bei z = 0 heraus?',['0 %','50 %','100 %'],1,'e⁰ = 1. Der Nenner ist 2.','sigmoid')
  ]},
  { id:'w3', label:'Woche 3', title:'Klassifikation, Iris und SDD', summary:'Modelle trainieren, fair bewerten und prüfbar beschreiben.', lessons:[
    lesson('training','Verlust und Gradientenabstieg','Ein Training verändert Gewichte so, dass die Vorhersagen besser zu den bekannten Klassen passen.',[
      ['Vorhersagen erzeugen','Beginne mit w = 0 und b = 0. Dann hat jedes Beispiel z = 0 und p = 0,5.'],
      ['Fehler messen','Für y = 1 ist der Verlust −ln(p). p = 0,8 ergibt etwa 0,223. p = 0,2 ergibt etwa 1,609. Selbstsichere Fehlvorhersagen kosten mehr.'],
      ['Richtung und Schritt berechnen','Für x = 2, y = 1 und p = 0,5 ist der Gewichtsgradient (0,5 − 1) · 2 = −1. Bei Alpha = 0,1 ergibt sich w neu = 0 − 0,1 · (−1) = 0,1. Für b fehlt der Faktor x. Im Full Batch mitteln wir über alle Beispiele.'],
      ['Grenzen erkennen','Eine einzelne Gerade kann XOR (genau eine von zwei Eingaben ist 1) auf den ursprünglichen Eingaben nicht sauber trennen. Prüfe Fehler auf neuen Daten, weil niedriger Trainingsfehler allein wenig aussagt.']
    ],'Was passiert mit w bei Gradient −1 und positiver Lernrate?',['Es steigt.','Es sinkt.','Es bleibt gleich.'],0,'Du ziehst eine negative Zahl ab. Das ergibt eine Erhöhung.','gradient'),
    lesson('iris','Iris und Confusion Matrix','Iris ist ein Datensatz mit drei Arten. Die Merkmale messen Länge und Breite von Kelch- und Blütenblättern.',[
      ['Daten erkunden','Schau zuerst im Streudiagramm, welche Merkmale Arten sichtbar trennen. Setosa ist anhand der Blütenblattmaße oft klar getrennt.'],
      ['Matrix lesen','Zeilen sind hier die tatsächlichen Arten, Spalten die Vorhersagen. Auf der Diagonalen stehen die Treffer. Bei 50, 47 und 48 Treffern sind 145 von 150 richtig, also rund 96,7 %.'],
      ['Eine Klasse einzeln betrachten','Für Versicolor gilt TP = 47, FP = 2, FN = 3. Precision = 47 / 49 ≈ 95,9 %. Recall = 47 / 50 = 94 %. F1 fasst beide zusammen.'],
      ['Fair prüfen','In Orange Daten laden, Ziel festlegen, Daten erkunden, Modelle per Test & Score vergleichen und die Confusion Matrix lesen. Lerne Skalierung und Imputation nur aus dem jeweiligen Trainingsanteil.']
    ],'Welche Größe zählt übersehene positive Fälle?',['FP','TP','FN'],2,'FN bedeutet falsch negativ. Der Fall war positiv und wurde als negativ eingestuft.','matrix'),
    lesson('sdd','Spec-Driven Development','Eine Spezifikation (Beschreibung des gewünschten Verhaltens) macht eine Idee überprüfbar.',[
      ['Ergebnis beschreiben','Beispiel Regressionslabor. Lernende sollen einen Trainingsschritt und seine Wirkung nachvollziehen können.'],
      ['Abnahme festlegen','„Ein Klick führt genau ein Gewichtsupdate aus.“ Das ist beobachtbar und als Test formulierbar. Plane auch ungültige CSV-Werte und leere Eingaben.'],
      ['Mit KI umsetzen und prüfen','Trenne Anforderungen, Plan, Aufgaben und Umsetzung. In einer Übergabe stehen Entscheidungen, offene Punkte und Testbefunde. Prüfe erzeugten Code und Ergebnisse selbst.']
    ],'Welcher Satz lässt sich direkt prüfen?',['Die App soll gut sein.','Ein Klick berechnet genau einen Schritt.','Der Code soll modern wirken.'],1,'Du kannst den Zustand vor und nach einem Klick eindeutig vergleichen.')
  ]},
  { id:'w4', label:'Woche 4', title:'Entscheidungsbäume und Titanic', summary:'Ja-Nein-Regeln, Datenbereinigung, Gini und Entropie.', lessons:[
    lesson('baum','Entscheidungsbäume lesen','Ein Baum stellt eine Frage pro Knoten. Jede Antwort bestimmt den nächsten Ast. Im Blatt steht die Vorhersage.',[
      ['Pfad verfolgen','Ein Iris-Beispiel: Ist das Blütenblatt höchstens 1,9 cm lang? Ja führt in dieser Unterrichtsregel zu Setosa. Andernfalls folgt eine Frage zur Breite.'],
      ['Bereiche erkennen','Jede Frage zu genau einem Merkmal schneidet die Punktwolke entlang einer Achse. Mehrere aufeinanderfolgende Schnitte erzeugen rechteckige Bereiche.'],
      ['Komplexität steuern','Maximale Tiefe und minimale Zahl pro Blatt sind Hyperparameter (Vorgaben vor dem Training). Vergleiche Einstellungen anhand von Validierungsdaten.']
    ],'Wo endet die Vorhersage eines Beispiels?',['Im Blatt','Immer an der Wurzel','In der Confusion Matrix'],0,'Ein Blatt ist ein Knoten ohne weiteren Ast.','baum'),
    lesson('titanic','Titanic, Datenqualität und Imputation','EDA heißt explorative Datenanalyse. Sie hilft, Größenordnungen, fehlende Werte, Ausreißer und Beziehungen zu entdecken.',[
      ['Datenrollen setzen','Überleben ist das Ziel. Alter oder Ticketklasse können Merkmale sein. Eine Kennung hilft beim Zuordnen, kann dem Modell aber unerwünschte Abkürzungen geben.'],
      ['Fehlende Werte behandeln','Alter kann mit einem aus dem Training geschätzten Median ersetzt werden. Bei Kategorien bietet sich der häufigste Wert an. Löschen verändert die Fallzahl und möglicherweise die Zusammensetzung. Vergleiche die Folgen.'],
      ['Datenleck vermeiden','Trenne vor dem Schätzen von Ersatzwerten. In Orange zuerst Spaltenrollen und EDA prüfen. Angepasste Vorverarbeitung gehört in jeden Trainingsdurchlauf von Test & Score.']
    ],'Woraus darf der Median für die Imputation im jeweiligen Durchlauf gelernt werden?',['Aus allen Zeilen vor der Aufteilung','Nur aus dem Trainingsanteil','Nur aus den Testdaten'],1,'Die Bewertung soll unbekannte Daten nachbilden.'),
    lesson('splits','Gini, Entropie und der beste Split','Ein guter Split bringt Fälle derselben Klasse zusammen. Gini und Entropie messen, wie gemischt ein Knoten ist.',[
      ['Elternknoten rechnen','Von 10 Bauteilen sind 6 in Ordnung und 4 fehlerhaft. Gini = 1 − 0,6² − 0,4² = 0,48.'],
      ['Kinder getrennt rechnen','Links sind 4 in Ordnung und 0 fehlerhaft. Gini = 0. Rechts sind 2 in Ordnung und 4 fehlerhaft. Gini = 1 − (2/6)² − (4/6)² = 4/9.'],
      ['Gewichten und abziehen','Links zählt mit 4/10, rechts mit 6/10. Der Split-Gini ist 0,2667. Die Verbesserung ist 0,48 − 0,2667 ≈ 0,2133.'],
      ['Entropie vergleichen','Ersetze Gini durch H = −Σ pᵢ · log₂(pᵢ). Bei einer 50:50-Mischung ergibt das 1 Bit. Information Gain ist Elternentropie minus gewichtete Kinderentropie. Für einen leeren Klassenanteil zählt der Summand als null.']
    ],'Warum werden die Kinder gewichtet?',['Große Gruppen sollen entsprechend ihrer Fallzahl zählen.','Damit beide Kinder gleich viel zählen.','Damit unreine kleine Gruppen immer dominieren.'],0,'Jeder Fall trägt gleich viel bei, unabhängig davon, in welchem Kind er liegt.','gini')
  ]},
  { id:'w5', label:'Woche 5', title:'kNN, Skalierung und Streuung', summary:'Pruning, Kreuzvalidierung, Distanzen, Boxplots und Random Forest.', lessons:[
    lesson('pruning','Pruning und Kreuzvalidierung','Ein sehr tiefer Baum kann Zufall in den Trainingsdaten lernen. Pruning begrenzt oder kürzt den Baum.',[
      ['Vorher und nachher kürzen','Pre-Pruning begrenzt das Wachstum. Post-Pruning nimmt nach dem Training Äste weg. Zu starkes Kürzen kann echtes Muster verlieren.'],
      ['Kosten vergleichen','Vereinfachtes Beispiel: Baum A hat Fehler 0,08 und 7 Blätter. B hat Fehler 0,13 und 3 Blätter. Bei α = 0,02 sind die Kosten A = 0,22 und B = 0,19. B ist günstiger.'],
      ['In Folds prüfen','Bei 5 Folds (Teilmengen) trainierst du fünfmal mit jeweils vier Teilen. Der fünfte Teil dient jedes Mal zur Validierung. Vergleiche Mittelwert und Schwankung. Der Abschlusstest bleibt separat.'],
      ['Bias und Varianz','Ein zu starres Modell kann regelmäßig danebenliegen (hoher Bias). Ein sehr flexibles Modell kann stark davon abhängen, welche Trainingsfälle es gesehen hat (hohe Varianz des Modells).']
    ],'Was bewirkt ein größeres α in den Pruning-Kosten?',['Mehr Blätter werden attraktiver.','Zusätzliche Blätter werden stärker bestraft.','Der Trainingsfehler wird immer null.'],1,'Alpha wird mit der Zahl der Blätter multipliziert.','pruning'),
    lesson('knn','k nächste Nachbarn','kNN lässt die ähnlichsten bekannten Beispiele über die Vorhersage abstimmen.',[
      ['Differenzen bilden','Von Q = (2 | 1) nach A = (5 | 5) sind die Abstände je Achse 3 und 4.'],
      ['Abstandsregel anwenden','Euklidisch: √(3² + 4²) = 5. Manhattan: |3| + |4| = 7. Die Regel kann die Rangfolge der Nachbarn ändern.'],
      ['Sortieren und abstimmen','Sortiere nach Abstand. Wähle die ersten k. Bei 2 blauen und 1 rotem Nachbarn ist Blau die Mehrheit. Bei Gleichstand brauchst du eine feste Regel.'],
      ['Übertragen','Beim Wine-Beispiel oder bei Daten mit Alter und Einkommen können große Zahlenbereiche den Abstand dominieren. Erkunde die Daten und vergleiche skalierte und unskalierte Modelle unter derselben Validierung.']
    ],'Welche Manhattan-Distanz haben (2 | 1) und (5 | 5)?',['5','7','25'],1,'Addiere die absoluten Achsenabstände 3 und 4.','knn'),
    lesson('skalierung','Min-Max, z-Score und Robust Scaler','Skalierung verändert die Einheiten oder Größenordnungen der Merkmale. Das hilft Verfahren, die mit Abständen rechnen.',[
      ['Min-Max','Bei Trainingsminimum 10 und Maximum 50 ergibt x = 30 den Wert (30 − 10)/(50 − 10) = 0,5. Ein späterer Wert von 70 ergibt 1,5.'],
      ['Standardisieren','Bei Mittelwert 28 und Standardabweichung 12 ergibt x = 40 den z-Score (40 − 28)/12 = 1. Der Wert liegt eine Standardabweichung über dem Mittelwert.'],
      ['Robust skalieren','Bei Median 30 und IQR 20 ergibt x = 40 den Wert (40 − 30)/20 = 0,5. Ein extremer Wert verändert Median und IQR oft weniger als Mittelwert und Spannweite.'],
      ['Fair anwenden','Lerne die Kennzahlen im Trainingsanteil und verwende sie unverändert für den Test. Bei einer Skala von null muss das Verfahren den Sonderfall ausdrücklich behandeln.']
    ],'Kann ein neuer Datensatzwert nach Min-Max-Skalierung größer als 1 werden?',['Ja, über dem Trainingsmaximum.','Nur wenn Daten fehlen.','Nein, unter keinen Umständen.'],0,'Die Transformation verwendet weiter das Maximum aus dem Training.','scaler'),
    lesson('boxplot','Streuung, Quartile und Boxplots','Ein Durchschnitt kann ähnlich sein, obwohl die Werte sehr unterschiedlich verteilt sind. Streuungsmaße machen das sichtbar.',[
      ['Varianz berechnen','Werte 2, 4, 6 haben Mittelwert 4. Die Abstände sind −2, 0, 2. Quadriert ergibt das 4, 0, 4. Die Grundgesamtheitsvarianz beträgt 8/3. Die Standardabweichung ist √(8/3) ≈ 1,633.'],
      ['Quartile bestimmen','Sortiere 1, 2, 3, 4, 5, 6, 12. Median = 4. Lass ihn für beide Hälften weg. Q₁ = 2 und Q₃ = 6, also IQR = 4. Software kann andere Quartilregeln nutzen.'],
      ['Zäune und Enden','Untere Grenze: 2 − 1,5 · 4 = −4. Obere Grenze: 6 + 1,5 · 4 = 12. Eine Beobachtung auf der Grenze bleibt innerhalb. Die Whisker enden an echten Datenwerten.'],
      ['Ausreißer untersuchen','Ändere die 12 zu 15. Q₃ bleibt 6, der obere Zaun bleibt 12, der obere Whisker wird 6. Prüfe die Ursache eines Ausreißers, bevor du den Wert entfernst.']
    ],'Wo endet ein Whisker?',['Am rechnerischen Zaun, selbst ohne Beobachtung.','Am äußersten beobachteten Wert innerhalb der Zäune.','Immer am Maximum, auch bei Ausreißern.'],1,'Die Zäune legen die Auswahl fest. Der Whisker zeigt einen wirklichen Messwert.','boxplot'),
    lesson('wald','Bagging und Random Forest','Mehrere Modelle können zusammen stabiler sein als ein einzelnes Modell.',[
      ['Bootstrap ziehen','Ziehe für jeden Baum eine neue Stichprobe mit Zurücklegen aus den Trainingsfällen. Einige Fälle erscheinen mehrfach, andere fehlen.'],
      ['Bäume zusätzlich unterscheiden','Ein Random Forest beschränkt die verfügbaren Merkmale üblicherweise an jedem Split auf eine zufällige Auswahl. So ähneln sich die Bäume weniger.'],
      ['Vorhersagen zusammenführen','Bei Klassifikation kannst du die Stimmen oder gemittelten Klassenwahrscheinlichkeiten auswerten, abhängig vom Verfahren. Vergleiche das Ergebnis mit einem einzelnen Baum auf denselben Validierungsdaten.']
    ],'Was bedeutet mit Zurücklegen?',['Ein Fall kann mehrfach gezogen werden.','Jeder Fall kommt genau einmal vor.','Jeder Fall kommt höchstens einmal vor.'],0,'Nach jeder Ziehung steht derselbe Fall erneut zur Auswahl.')
  ]},
  { id:'recht', label:'Recht', title:'Rechtliche Grundlagen', summary:'Verträge, Steuerrechnungen und Schutzrechte an eigenen Fällen.', lessons:[
    lesson('vertrag','Zivilrecht und Verträge','Im Zivilrecht geht es um Rechtsbeziehungen zwischen Personen und Unternehmen. Ein typischer Fall fragt: Wer will was von wem woraus?',[
      ['Rechtsgebiete einordnen','Eine Kaufpreisforderung gehört typischerweise zum Zivilrecht. Das Verhältnis zur Behörde kann öffentlich-rechtlich sein. Im Strafrecht geht es um staatliche Verfolgung von Straftaten.'],
      ['Vertrag prüfen','Prüfe Angebot und Annahme. Stimmen beide inhaltlich überein und sind sie wirksam? Berücksichtige Geschäftsfähigkeit, Vertretung, Form, Zugang und eine mögliche Anfechtung.'],
      ['Vertragstyp erkennen','Kauf: Sache gegen Preis. Miete: Nutzung auf Zeit. Dienstvertrag: Tätigkeit. Werkvertrag: vereinbarter Erfolg. Prüfe beim Kauf erst Anspruch und Pflicht, dann mögliche Rechte bei Mängeln wie Nacherfüllung.'],
      ['Prüfschema anwenden','Beispiel: Eine Werkstatt bietet für 200 Euro eine konkret benannte Reparatur an. Der Kunde stimmt zu. Prüfe den vereinbarten Erfolg, die beteiligten Personen und dann die Voraussetzungen des Anspruchs.']
    ],'Welche Leistung steht beim Werkvertrag im Mittelpunkt?',['Ein vereinbarter Erfolg','Nur die aufgewendete Zeit','Immer der Verkauf einer Sache'],0,'Beim Werkvertrag ist ein bestimmtes Ergebnis geschuldet.'),
    lesson('steuern','Steuerarten und Brutto-Netto-Rechnung','In Aufgaben unterscheiden wir zum Beispiel Einkommensteuer, Körperschaftsteuer, Gewerbesteuer und Umsatzsteuer. Lies zuerst, welche Art und welche Bemessungsgrundlage gefragt sind.',[
      ['Bemessungsgrundlage erkennen','In diesem Rechenbeispiel beträgt der Nettopreis 200 € und der vorgegebene Satz 19 %. Ein Prozentsatz von 19 % ist als Dezimalzahl 0,19.'],
      ['Umsatzsteuer und Gesamtpreis','200 · 0,19 = 38 €. Addiere zum Nettopreis: 238 €. Direkt geht es mit 200 · 1,19.'],
      ['Rückwärts rechnen','Ist nur der Bruttopreis bekannt, teile 238 durch 1,19. Das ergibt 200 €. Die Differenz von 38 € ist die enthaltene Steuer.']
    ],'Wie rechnest du bei 19 % von Brutto nach Netto?',['Brutto · 0,81','Brutto / 1,19','Brutto / 0,19'],1,'Der Bruttopreis entspricht 119 % des Nettopreises.','steuer'),
    lesson('schutz','Urheberrecht, Marken und Patente','Die drei Schutzarten behandeln unterschiedliche Gegenstände. In einer Fallaufgabe kommt es darauf an, was genau geschützt werden soll.',[
      ['Urheberrecht','Prüfe bei einem eigenen Text, Bild oder Programm, ob eine geschützte Schöpfung vorliegt und welche Nutzung erlaubt wurde. Eine Quellenangabe allein sollte nicht mit einer Lizenz verwechselt werden.'],
      ['Markenrecht','Eine Marke kennzeichnet die Herkunft von Waren oder Dienstleistungen. Prüfe das Zeichen, die Waren oder Dienstleistungen und die konkrete Verwendung.'],
      ['Patentrecht','Bei einem patentfähigen technischen Gegenstand spielen Neuheit, erfinderische Tätigkeit und gewerbliche Anwendbarkeit eine Rolle. Die bloße Geschäftsidee ist eine andere Frage.']
    ],'Welches Rechtsgebiet ist für ein Unternehmenskennzeichen auf Produkten zuerst naheliegend?',['Mietrecht','Markenrecht','Einkommensteuerrecht'],1,'Marken dienen der Kennzeichnung von Waren oder Dienstleistungen.')
  ]},
  { id:'prozess', label:'Prozesse', title:'Prozesse und Projekte', summary:'Abläufe, Kennzahlen und Verbesserungen greifbar machen.', lessons:[
    lesson('prozess','Prozesse modellieren','Ein Prozess wandelt eine Eingabe über wiederkehrende Schritte in ein Ergebnis um. Ein Projekt ist demgegenüber ein zeitlich begrenztes Vorhaben.',[
      ['Grenze setzen','Definiere Auslöser, Ende, Ergebnis und verantwortliche Person. Beispiel: Supportanfrage kommt an → Anliegen klären → Lösung finden → Rückmeldung versenden.'],
      ['Prozesslandkarte und Ablauf','Kernprozesse liefern Kundennutzen. Unterstützungsprozesse stellen Mittel bereit. Führungsprozesse steuern Ziele. In einer Ablaufgrafik zeigen Entscheidungen alternative Wege, Swimlanes zeigen Zuständigkeiten.'],
      ['Ist und Soll vergleichen','Zeichne zuerst den tatsächlichen Ablauf. Markiere Wartezeiten, Übergaben und Wiederholungen. Beschreibe danach einen verbesserten Zielablauf mit überprüfbarer Wirkung.']
    ],'Wofür steht das Ende eines Prozesses?',['Für den ersten Eingang','Für das bereitgestellte Ergebnis','Für jeden Zuständigkeitswechsel'],1,'Das definierte Ergebnis macht das Prozessende überprüfbar.'),
    lesson('kpi','Kennzahlen, Optimierung und KI','Eine Kennzahl zeigt, ob eine Änderung im Ablauf wirkt. Verbinde sie mit einem Prozessziel.',[
      ['Messen','Durchlaufzeit reicht vom Eingang bis zum Ende, einschließlich Wartezeit. Die Bearbeitungszeit umfasst aktive Arbeit. Die Fehlerquote teilt fehlerhafte Fälle durch alle Fälle.'],
      ['Ziel festlegen','Beispiel: Durchschnittliche Durchlaufzeit in vier Wochen von 30 auf 24 Minuten senken. Verbesserung relativ zum Ausgangswert: (30 − 24)/30 = 20 %.'],
      ['Verbessern und prüfen','Im PDCA-Zyklus planst du, probierst aus, prüfst und passt an. Eine KI-Vorsortierung kann Zeit sparen. Miss daneben Fehlleitungen und prüfe kritische Fälle von Hand.']
    ],'Was ist die relative Verbesserung von 30 auf 24 Minuten?',['6 %','20 %','25 %'],1,'Du sparst 6 von ursprünglich 30 Minuten.','prozess')
  ]},
  { id:'pruefung', label:'Lernpraxis', title:'Lernmethoden und Prüfung', summary:'Aktiv wiederholen, Aufgaben lesen und Antworten begründen.', lessons:[
    lesson('lernen','Aktiv lernen und wiederholen','Eine Rechnung sitzt besser, wenn du den nächsten Schritt aus dem Kopf findest und ihn anschließend kontrollierst.',[
      ['Selbst abrufen','Blende die Lösung aus. Erkläre mit eigenen Worten, was das Ergebnis aussagt. Rechne danach mit anderen Zahlen.'],
      ['Verteilt wiederholen','Gehe schwierige Beispiele nach einem Abstand erneut durch. Mische anschließend Themen, etwa Gini, kNN und Streuung. So übst du die Wahl des passenden Verfahrens.'],
      ['Lernmethoden ausprobieren','Nutze Selbstreflexion: Wann hilft eine Skizze, wann ein Beispiel oder eine Erklärung für jemand anderen? Beurteile die Methode daran, was du hinterher selbst lösen kannst.']
    ],'Was übt den Abruf am direktesten?',['Die Lösung erneut lesen.','Den Lösungsweg zunächst selbst aufschreiben.','Nur das Ergebnis markieren.'],1,'Du holst das Gelernte ohne sichtbare Lösung aus dem Gedächtnis.'),
    lesson('operatoren','Prüfungsaufgaben und Operatoren','Der Arbeitsauftrag zeigt, wie ausgearbeitet eine Antwort sein soll. Trainiere mit eigenen Fällen im Stil der Kursaufgaben.',[
      ['Auftrag markieren','Nennen verlangt kurze Punkte. Erläutern verbindet Begriff, Zusammenhang und Beispiel. Berechnen verlangt Ansatz, Einsetzen, Zwischenschritte und Ergebnis. Bewerten braucht Kriterien und ein begründetes Urteil.'],
      ['Fall lesen','Unterstreiche Zielgröße, gegebene Werte, Einheiten und Annahmen. Zeichne bei Klassifikation auf, welche Klasse positiv ist und in welche Richtung die Matrix gelesen wird.'],
      ['Ergebnis prüfen','Beispiel: Ein zweiter Split senkt Gini stärker. Schreibe, welche Gruppen du verglichen hast, wie die Gewichte zustande kamen und welche Teilung du deshalb wählst. Prüfe für formale Prüfungsregeln die aktuellen Angaben deiner IHK.']
    ],'Was braucht „bewerten“?',['Nur eine Zahl','Ein Urteil mit Kriterien und Begründung','Nur die Aufgabenstellung in anderen Worten'],1,'Zeige, nach welchen Maßstäben du zu deinem Urteil kommst.')
  ]}
];
