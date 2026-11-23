// Eigene Lerntexte und Fälle, geordnet über die Themenliste in lessons.mjs.
export const extraLessons = [
  ['lernarten','Überwacht, unüberwacht oder bestärkend?','Die passende Lernart hängt davon ab, welche Rückmeldung du für das Training hast.',[
    ['Überwacht','Zu jeder Beobachtung kennst du die Lösung. Ein Zahlenziel wie Lieferzeit führt zur Regression. Eine Kategorie wie pünktlich oder verspätet führt zur Klassifikation.'],
    ['Unüberwacht','Du hast Merkmale ohne fertige Zielspalte. Clustering sucht Gruppen, etwa ähnliche Verbrauchsmuster. Prüfe anschließend, ob die Gruppen fachlich Sinn ergeben.'],
    ['Bestärkend','Ein System wählt Handlungen und bekommt Belohnungen. Ein Spielzug kann erst mehrere Schritte später zum Gewinn führen. Deshalb ist die Rückmeldung auf einen einzelnen Zug indirekt.']
  ],'Du hast Verbrauchsdaten ohne Gruppennamen und möchtest ähnliche Tage bündeln. Welcher Ansatz passt?',['Regression','Clustering','Klassifikation'],1,'Ohne bekannte Klassen ist die Gruppenbildung unüberwacht.'],
  ['kamera','Teachable Machine und Daten für Bilder','Eine Kamera liefert Pixel. Eine gelabelte Sammlung zeigt dem Modell, welche Bilder zu welcher Klasse gehören.',[
    ['Klassen aufnehmen','Lege zum Beispiel offene Hand und Faust an. Sammle pro Klasse verschiedene Winkel, Abstände und Lichtverhältnisse.'],
    ['Auf Abkürzungen testen','Nimm Faust vor einem dunklen und einem hellen Hintergrund auf. Wenn nur eine Wandfarbe mit einer Klasse vorkam, kann das Modell die Wand statt der Hand nutzen.'],
    ['Verwechslungen dokumentieren','Teste mit bisher ungesehenen Aufnahmen. Notiere wahre Klasse, vorhergesagte Klasse und Aufnahmebedingung. Ein zweiter Durchlauf mit mehr unterschiedlichen Beispielen zeigt, ob sich die Fehler ändern.']
  ],'Welche Testaufnahme zeigt am ehesten, ob das Modell den Hintergrund gelernt hat?',['Eine bekannte Trainingsaufnahme','Dieselbe Geste vor einer neuen Wand','Ein zweites identisches Foto'],1,'Ändere gezielt den Hintergrund bei gleicher Geste.'],
  ['netze','Neuron, Schichten und Aktivierung','Ein künstliches Neuron bildet eine gewichtete Summe und wendet danach eine Funktion an.',[
    ['Rechenschritt','Setze x₁ = 2, x₂ = −1, w₁ = 0,5, w₂ = 2 und b = 0,5 ein. z = 1 − 2 + 0,5 = −0,5. ReLU gibt max(0, z) = 0 aus.'],
    ['Schichten','Die Eingabe liefert Merkmale. Verborgene Schichten bilden Zwischenrepräsentationen. Die Ausgabeschicht richtet sich nach der Aufgabe, etwa eine Zahl für Regression oder Klassenwerte für Klassifikation.'],
    ['Architekturen einordnen','CNNs filtern lokale Muster, etwa Bildkanten. RNNs verarbeiten Folgen über einen wiederkehrenden Zustand. Transformer gewichten Beziehungen in einer Eingabefolge. Diese Grundideen stehen in der KI-Landkarte.'],
    ['Parameter und Training','Gewichte und Bias werden gelernt. Lernrate, Anzahl Epochen und Batch-Größe sind Vorgaben, die du beim Training festlegst.']
  ],'Welche Ausgabe hat ReLU für z = −3?',['−3','0','3'],1,'ReLU nimmt das Maximum aus 0 und z.','neuron'],
  ['agenten','LLM, RAG und Agenten einordnen','Ein Sprachmodell erzeugt Text. Um damit verlässlich zu arbeiten, musst du Antworten und Datenquellen getrennt prüfen.',[
    ['Tokens und Kontext','Ein Modell verarbeitet Textstücke (Tokens). Das Kontextfenster begrenzt, wie viel Eingabe und Ausgabe gleichzeitig berücksichtigt werden kann. Eine lange Eingabe garantiert keine richtige Antwort.'],
    ['RAG und Werkzeuge','RAG sucht passende Abschnitte und gibt sie dem Modell als Kontext. Ein Agent kann weitere Werkzeuge wie Suche oder Rechner benutzen. Beides hängt von den übergebenen Daten und der Werkzeugausgabe ab.'],
    ['Tabellendaten als Vergleich','Für die Vorhersage einer Maschinenstörung aus Messwerten starte mit einem einfachen Modell und sauber getrennten Testdaten. Ein LLM kann bei der Dokumentation oder beim Erstellen des Vergleichsplans helfen.']
  ],'Was prüfst du zuerst, wenn eine RAG-Antwort eine falsche Regel nennt?',['Ob die richtige Quelle gefunden und korrekt gelesen wurde','Ob das Modell größer ist als gestern','Ob die Antwort lang genug ist'],0,'Fehler können schon bei der Suche oder erst bei der Interpretation entstehen.'],
  ['dateien','CSV, Workflows und Dateipfade','Daten und der Ablauf, der sie verarbeitet, liegen häufig in verschiedenen Dateien.',[
    ['Dateien unterscheiden','CSV speichert eine Tabelle als Text. In Orange beschreibt eine .ows-Datei die Anordnung und Verbindungen der Widgets (Bausteine). Der Ablauf kann auf externe Daten verweisen.'],
    ['Pfade lesen','Ein absoluter Pfad gibt den vollständigen Ort an. Ein relativer Pfad bezieht sich auf einen Ausgangsordner. ../ führt eine Ebene nach oben. Prüfe, auf welchen Ordner sich dein Werkzeug bezieht.'],
    ['Import prüfen','Achte bei CSV auf Trennzeichen, Kopfzeile, Dezimalzeichen und leere Werte. Wenn aus 100 Zeilen plötzlich 99 werden, kläre die Ursache vor dem Training.']
  ],'Ein Workflow findet eine CSV nach dem Verschieben nicht mehr. Was prüfst du zuerst?',['Die Baumtiefe','Den Dateipfad zum Datensatz','Die Verlustfunktion'],1,'Das Modell kann die Tabelle erst benutzen, wenn der Pfad wieder stimmt.'],
  ['orange','Orange-Workflows verstehen','Ein Workflow verbindet Daten, Lernverfahren und die Auswertung. Die Art der Verbindung entscheidet, was tatsächlich berechnet wird.',[
    ['Daten erkunden','File oder Datasets laden Daten. Data Table zeigt Fälle und Spalten. Select Columns legt Merkmale, Ziel und Metadaten fest. Scatter Plot stellt zwei Merkmale gegeneinander dar.'],
    ['Modelle vergleichen','Schließe denselben Datensatz und mehrere Learner (Lernverfahren) an Test & Score an. Confusion Matrix zeigt danach die Verwechslungen. Tree Viewer erklärt Regeln eines konkreten Baums.'],
    ['Transfer auf Kursbeispiele','Paint Data eignet sich für künstliche Punktwolken. Iris eignet sich für drei Klassen, Titanic für fehlende Werte und Wine oder das Anzeigenbeispiel für Distanz und Skalierung.']
  ],'Warum gehören dieselben Validierungsaufteilungen zu einem fairen Modellvergleich?',['Damit Unterschiede nicht nur an verschiedenen Testfällen liegen','Damit alle Modelle gleich viele Parameter haben','Damit kein Modell Fehler macht'],0,'Vergleiche Modelle unter denselben Bedingungen.'],
  ['eda','Tabellen, Scatterplots und Verteilungen','Erkunde Daten, bevor du ein Modell trainierst. Jedes Diagramm beantwortet eine andere Frage.',[
    ['Tabelle lesen','Eine Zeile ist etwa eine Person, eine Blume oder ein Messzeitpunkt. Eine Spalte ist eine Eigenschaft. Prüfe Datentyp, Einheit und fehlende Werte.'],
    ['Diagramm auswählen','Ein Histogramm zeigt die Häufigkeitsverteilung einer Zahl. Ein Streudiagramm zeigt Paare von Messwerten. Ein Boxplot fasst Lage und Streuung zusammen.'],
    ['Erste Vermutung prüfen','Wenn zwei Klassen im Iris-Plot überlappen, prüfe ein anderes Merkmalspaar. Ein Zweierplot kann zusätzliche Informationen aus anderen Spalten ausblenden.']
  ],'Was zeigt ein Scatterplot mit Alter auf x und Einkommen auf y?',['Ein Wertepaar pro Fall','Nur den Mittelwert jeder Spalte','Den exakten kausalen Einfluss des Alters'],0,'Jeder Punkt liegt an der Position seiner beiden Messwerte.'],
  ['datenqualitaet','Fehlerhafte Daten, Klassenverteilung und Bias','Gute Daten passen zur Aufgabe. Viele Daten allein helfen wenig, wenn die wichtigen Fälle fehlen oder falsch gelabelt sind.',[
    ['Typische Probleme','Suche leere Felder, doppelte Zeilen, wechselnde Einheiten, vertauschte Labels und unplausible Werte. Unterscheide einen echten seltenen Fall von einem Messfehler.'],
    ['Klassen und Gruppen prüfen','Bei 190 normalen und 10 fehlerhaften Teilen macht die seltene Klasse nur 5 % aus. Zähle einzelne Gruppen getrennt, wenn sich Aufnahmebedingungen oder Zielpopulation unterscheiden.'],
    ['Verbesserung begründen','Ergänze gezielt fehlende Beispiele oder korrigiere Labels nach einer einheitlichen Regel. Vergleiche Datenqualität und Modellfehler vor und nach der Änderung.']
  ],'Du findest 100 identische Messzeilen vom selben Einzelteil. Warum ist das für den Test wichtig?',['Dasselbe Teil kann sonst in Training und Test landen.','Die Matrix wird immer quadratisch.','Die Lernrate muss dadurch null sein.'],0,'Nahezu identische Fälle können die Bewertung zu optimistisch machen.'],
  ['lage','Mittelwert, Median und Spannweite','Lagewerte zeigen, wo Daten typischerweise liegen. Die Spannweite zeigt den Abstand zwischen kleinstem und größtem Wert.',[
    ['Sortieren und zusammenzählen','Aus 3, 6, 2, 5, 19 wird 2, 3, 5, 6, 19. Die Summe ist 35, der Mittelwert 35 ÷ 5 = 7.'],
    ['Median bilden','Der mittlere Wert ist 5. Bei vier sortierten Werten mittelt man die beiden mittleren Werte.'],
    ['Einordnen','Die Spannweite beträgt 19 − 2 = 17. Wenn nur der größte Wert weiter steigt, ändern sich Mittelwert und Spannweite. Der Median kann gleich bleiben.']
  ],'Der größte Wert steigt von 19 auf 29. Wie groß ist der Median dann?',['5','7','9'],0,'Der Wert an der mittleren Position bleibt 5.','datenwerte'],
  ['varianz','Varianz und Standardabweichung','Quadriere die Abstände zum Durchschnitt, damit sich positive und negative Abweichungen beim Mitteln nicht aufheben.',[
    ['Abstände hinschreiben','Für 2, 4, 6 ist der Mittelwert 4. Die Abstände sind −2, 0 und 2. Quadriert sind das 4, 0 und 4.'],
    ['Divisor wählen','Für die Grundgesamtheit teilst du die Summe 8 durch n = 3. Für die korrigierte Stichprobenvarianz teilst du durch n − 1 = 2. Sie ist bei n = 1 undefiniert.'],
    ['Einheit zurückholen','Die Standardabweichung ist die Wurzel aus der Varianz. Wenn die Daten in Sekunden vorliegen, ist die Varianz in Sekunden² und die Standardabweichung wieder in Sekunden.'],
    ['Wahrscheinlichkeit statt Häufigkeit','Beim fairen Würfel haben alle sechs Augen Wahrscheinlichkeit 1/6. E(X) = 3,5. Die Summe der quadrierten Abweichungen beträgt 17,5. Gewichte mit 1/6: Var(X) ≈ 2,9167 und σ ≈ 1,7078.']
  ],'Welche Stichprobenvarianz erhältst du für 2, 4, 6?',['2','8/3','4'],2,'Die quadrierten Abweichungen ergeben 8. Teile durch n − 1 = 2.','datenwerte'],
  ['korrelation','Korrelation und gemeinsame Veränderung','Ein Scatterplot kann zeigen, ob zwei Zahlen tendenziell zusammen steigen oder gegeneinander laufen.',[
    ['Richtung lesen','Zieht eine Punktwolke von links unten nach rechts oben, deutet sie auf positiven linearen Zusammenhang. Das Gegenmuster steht für einen negativen.'],
    ['Zahl einordnen','Der Pearson-Koeffizient liegt zwischen −1 und 1. Werte um null sagen, dass wenig linearer Zusammenhang sichtbar ist. Eine U-Form kann trotzdem klar von x abhängen.'],
    ['Plausibilität prüfen','Ein Ausreißer kann r stark verändern. Ein gemeinsamer Einfluss kann beide Merkmale bewegen. Prüfe immer Rohdaten und Sachzusammenhang.']
  ],'Die Punkte liegen genau auf einer fallenden Geraden. Wie ist der Pearson-Wert?',['−1','0','1'],0,'Eine perfekt fallende Gerade hat einen perfekt negativen linearen Zusammenhang.','korrelation'],
  ['regressionsfehler','MAE, MSE und RMSE','Bei einer Zahlvorhersage wollen wir wissen, wie weit sie vom echten Wert entfernt ist.',[
    ['Residuum bilden','Nutze zum Beispiel Ist minus Vorhersage. Für Ist 12 und Prognose 9 ist der Fehler +3. Das Vorzeichen hilft bei der Diagnose.'],
    ['Drei Kennzahlen','Bei Fehlern 1, −2, 3 sind die Beträge 1, 2, 3. MAE = 6 ÷ 3 = 2. Die Quadrate sind 1, 4, 9. MSE = 14 ÷ 3 ≈ 4,6667. RMSE ≈ 2,1602.'],
    ['In Worte übersetzen','MAE beschreibt die mittlere absolute Abweichung. RMSE gewichtet größere Abweichungen stärker und ist wieder in der Ausgangseinheit. Wähle die Kennzahl nach den Folgen großer Fehler.']
  ],'Wodurch wirkt ein großer Fehler stärker auf RMSE als auf MAE?',['Durch das Runden','Durch das Quadrieren','Durch die Reihenfolge der Fälle'],1,'Ein doppelt so großer Fehler ergibt ein viermal so großes Quadrat.','fehler'],
  ['grenze','Trenngerade, Logit und Abstand zur Grenze','Die Entscheidung kann man als Linie sehen: Auf der einen Seite ist der Rohwert positiv, auf der anderen negativ.',[
    ['Von zwei Punkten zur Steigung','A = (1 | 2), B = (3 | 6). Senkrecht ändert sich 4, waagerecht 2. m = 4 ÷ 2 = 2. Aus 2 = 2 · 1 + b folgt b = 0.'],
    ['Explizit und implizit','Aus x₂ = 2x₁ folgt 0 = 2x₁ − x₂. Setze einen Testpunkt ein, etwa (2 | 3). z = 4 − 3 = 1. Der Punkt liegt auf der positiven Seite.'],
    ['Abstand und Senkrechte','Teile z durch √(2² + (−1)²), also durch √5. Der signierte senkrechte Abstand beträgt etwa 0,4472. Stimmen die x-Werte zweier verschiedener Punkte überein, ist die Gerade senkrecht.']
  ],'Wo liegt ein Punkt mit z = 0?',['Auf der Trennlinie','Immer über beiden Achsen','Immer im Ursprung'],0,'Alle Punkte auf der Grenze erfüllen z = 0.','grenze'],
  ['xor','Lineare Grenzen und XOR','Eine Gerade kann manche Punkte sauber trennen. Bei überlappenden Klassen und bei XOR stößt sie an Grenzen.',[
    ['Vier Eckpunkte','Die Klasse ist 1 bei (0 | 1) und (1 | 0), sonst 0. Die gleichen Klassen liegen auf gegenüberliegenden Ecken.'],
    ['Versuch mit einer Trennlinie','Ziehe eine gerade Linie zwischen den Klassen. Welche Ecke bleibt falsch? Die Diagonalen verbinden jeweils gleiche Klassen und schneiden sich. Deshalb kann eine Gerade die Gruppen nicht strikt trennen.'],
    ['Passende Erweiterung','Mit einem Zusatzmerkmal wie x₁ · x₂ oder mit mehreren Baumregeln lässt sich das Muster ausdrücken. Validiere immer, ob eine komplexere Lösung auch auf unbekannten Daten hilft.']
  ],'Warum ist XOR mit einer einzigen linearen Grenze nicht trennbar?',['Weil die beiden Klassen auf wechselnden gegenüberliegenden Ecken liegen','Weil XOR drei Klassen hat','Weil alle Punkte dasselbe Label haben'],0,'Die Anordnung verlangt eine nichtlineare Entscheidungsgrenze im ursprünglichen Raum.'],
  ['matrix-binaer','Binäre Konfusionsmatrix und Kennzahlen','Die Matrix unterscheidet Treffer und zwei unterschiedliche Fehlerarten.',[
    ['Tatsächlich und vorhergesagt','Wähle zuerst die positive Klasse, zum Beispiel Defekt. Ein falsch negatives Ergebnis ist ein übersehener Defekt. Ein falsch positives Ergebnis ist ein fälschlich als Defekt markiertes Teil.'],
    ['Werte einsetzen','Beispiel TP = 8, FP = 2, FN = 4, TN = 16. Accuracy = 24/30 = 80 %. Precision = 8/10 = 80 %. Recall = 8/12 ≈ 66,67 %. F1 = 16/(16+2+4) ≈ 72,73 %.'],
    ['Kennzahl begründen','Wenn ein übersehener Fehler gefährlich ist, ist Recall besonders wichtig. Wenn jede Warnung eine teure manuelle Prüfung auslöst, ist auch Precision wichtig. Nenne die Folgen beider Fehler im Aufgabenkontext.']
  ],'Welcher Nenner gehört zum Recall?',['TP + FP','TP + FN','TN + FP'],1,'Gesucht ist der Anteil unter allen tatsächlich positiven Fällen.','matrix'],
  ['schwelle','Schwellenwert, Fehlalarme und übersehene Fälle','Dasselbe Modell kann bei zwei verschiedenen Entscheidungsschwellen sehr unterschiedlich wirken.',[
    ['Score von Klasse trennen','Ein Modell sagt eine Wahrscheinlichkeit von 0,65 voraus. Bei Schwelle 0,50 ist der Fall positiv, bei 0,70 negativ. Die Modellwerte selbst bleiben gleich.'],
    ['Änderung am Beispiel','Liegt ein tatsächlicher Defekt bei Score 0,65, wird ein bisheriger Treffer zum FN. Liegt ein intaktes Teil bei 0,65, wird ein bisheriger Fehlalarm zum TN.'],
    ['Unterschied zu ROC und AUC','ROC zeigt über Schwellen die Trefferquote gegen die Falsch-Positiv-Rate. Die Fläche darunter (AUC) bewertet die Rangordnung, während Precision und Recall bei einer gewählten Schwelle die konkreten Entscheidungen bewerten.']
  ],'Was ändert sich beim Verschieben der Schwelle?',['Die Zielwerte der Daten','Die Zuordnung der Scores zu vorhergesagten Klassen','Die Zahl der vorhandenen Fälle'],1,'Die Schwelle wird erst nach der Score-Berechnung angewendet.','schwellenwert'],
  ['aufteilung','Training, Validierung, Test und Datenlecks','Jeder Datenteil hat einen eigenen Zweck. Eine Bewertung soll die spätere Nutzung möglichst gut nachbilden.',[
    ['Drei Aufgaben','Training lernt Parameter. Validierung hilft bei Hyperparametern und Modellauswahl. Der Test bleibt bis zur abschließenden Bewertung getrennt.'],
    ['Leck vermeiden','Wenn der Mittelwert der alten und der späteren Testdaten vor der Trennung in die Imputation eingeht, hat das Training bereits Testinformation gesehen. Lerne die Transformation nur aus Trainingsdaten.'],
    ['Passend teilen','Wenn mehrere Zeilen von derselben Person stammen, halte diese nach Möglichkeit im selben Teil. Bei Zeitreihen trainiere auf früheren Daten und prüfe auf späteren.']
  ],'Wann soll der Abschlusstest bei der Modellwahl benutzt werden?',['Bei jeder kleinen Änderung','Nach der Modellauswahl','Vor dem Training zur Wahl der besten Merkmale'],1,'Nur ein bis dahin unberührter Test bleibt eine ehrliche Schlussprüfung.'],
  ['kreuzvalidierung','Kreuzvalidierung und schwankende Scores','Jeder Fall dient einmal der Validierung. So zeigt sich, ob ein Verfahren nur in einer zufällig günstigen Aufteilung gut aussieht.',[
    ['Folds durchlaufen','Bei k = 5 nutzt du jedes Mal 4 Teile fürs Training und 1 Teil für die Validierung. Nach 5 Durchläufen war jeder Fold einmal dran.'],
    ['Einsetzen','Für 82, 85, 81, 77 und 85 Prozent ist die Summe 410. Das Mittel beträgt 82 %. Die Spannweite von 77 bis 85 beträgt 8 Prozentpunkte.'],
    ['Streuung begründen','Mögliche Gründe sind kleine Folds, ungleiche Klassenanteile oder unterschiedlich schwierige Fälle. Stratifizierung hält die Klassenanteile möglichst ähnlich. Vorverarbeitung wird in jedem Durchlauf neu im Trainingsanteil gelernt.']
  ],'Wie oft ist ein bestimmter Fold bei einer normalen 5-fachen Kreuzvalidierung Validierungsfold?',['Einmal','Viermal','Fünfmal'],0,'Jeder der fünf Teile wird genau einmal zur Validierung zurückgehalten.','folds'],
  ['modellvergleich','Underfitting, Overfitting und Modellvergleich','Ein Modell soll Regeln finden, die auch für Fälle gelten, die es noch nie gesehen hat.',[
    ['Muster aus Fehlern lesen','Wenn Training und Validierung schlecht sind, kann das Modell zu einfach sein. Wenn Training sehr gut und Validierung deutlich schlechter sind, passt das zu Overfitting.'],
    ['Gegenmaßnahmen testen','Begrenze etwa Baumtiefe oder Blattgröße. Mehr geeignete Daten können helfen. Bei anderen Modelltypen ändern Regularisierungen die Strafe für große Gewichte oder die wirksame Modellkomplexität.'],
    ['Entscheidung begründen','Vergleiche auf denselben Datenteilen und benenne die passende Metrik. Berücksichtige Erklärbarkeit, Laufzeit und Folgen von Fehlern. Ein geringer Unterschied allein kann innerhalb der Fold-Schwankung liegen.']
  ],'Welches Muster spricht am stärksten für Overfitting?',['Training 98 %, Validierung 70 %','Training 72 %, Validierung 71 %','Training 81 %, Validierung 82 %'],0,'Die große Lücke deutet auf ein zu stark an Trainingsfälle angepasstes Modell.'],
  ['entropie','Entropie und Information Gain von Hand','Entropie misst Unsicherheit in einem Knoten. Information Gain fragt, wie viel diese Unsicherheit durch einen Split abnimmt.',[
    ['Elternknoten','Bei 4 A und 4 B sind beide Anteile 1/2. log₂(1/2) = −1. Daher H = −(½ · −1 + ½ · −1) = 1 Bit.'],
    ['Kinderknoten','Angenommen links liegen nur 4 A und rechts nur 4 B. Beide Kinder sind rein. Für p = 1 ist log₂(p) = 0. Terme mit Anteil 0 werden als 0 gezählt.'],
    ['Gewichten','Beide Kinder haben je 4 von 8 Fällen. H nach dem Split = 0,5 · 0 + 0,5 · 0 = 0. Information Gain = 1 − 0 = 1 Bit.']
  ],'Wie viel Entropie hat ein vollständig reiner Knoten?',['0 Bit','0,5 Bit','1 Bit'],0,'Alle Beobachtungen gehören zu einer einzigen Klasse.','entropie'],
  ['nachbarwahl','Nachbarzahl und Gleichstände','Die Wahl von k bestimmt, wie lokal kNN entscheidet. Große und kleine k haben unterschiedliche Folgen.',[
    ['Klein anfangen','Bei k = 1 kann ein einzelner falscher Nachbar die Entscheidung kippen. Das Modell folgt lokalen Details sehr stark.'],
    ['k vergrößern','Mehr Nachbarn glätten die Grenze. Ein seltenes und lokales Muster kann dabei verschwinden. Vergleiche mehrere k mit denselben Folds.'],
    ['Gleichstände behandeln','Bei Mehrklassen-Problemen kann selbst ein ungerades k zu Gleichstand führen. Lege eine Regel vorab fest, etwa gewichtete Stimmen oder ein festes Kriterium für Gleichstand.']
  ],'Was kann bei einem sehr großen k passieren?',['Lokale Muster werden durch viele entfernte Nachbarn überstimmt.','Entfernungen müssen nicht mehr berechnet werden.','Es gibt nur noch Treffer.'],0,'Viele weiter entfernte Fälle können das lokale Signal überdecken.','knn'],
  ['skalierungswahl','Skalierung passend auswählen','Die Wahl des Skalierers hängt von Modell, Verteilung und gewünschtem Verhalten bei neuen Daten ab.',[
    ['Alter und Gehalt','A liegt 4 Jahre und 1.000 € entfernt, B 10 Jahre und 100 €. Unskaliert dominiert der Euro-Abstand. Dasselbe Gehalt in Tausend Euro kann die Rangfolge ändern.'],
    ['Modell berücksichtigen','kNN reagiert unmittelbar auf verschiedene Größenordnungen. Beim Split eines Baums bleibt die Reihenfolge der Werte bei einer streng monotonen Umrechnung erhalten.'],
    ['Sonderfälle','Standardisierung reagiert auf extreme Werte. Eine robuste Skalierung benutzt Median und IQR. Wenn alle Trainingswerte gleich sind, ist die Skalierung ohne vereinbarte Sonderregel undefiniert.']
  ],'Bei welchem Verfahren kann die Umrechnung von Euro auf Tausend Euro die Auswahl der Nachbarn ändern?',['kNN ohne Skalierung','Ein exakt gleicher Auswahlbaum mit bereits bekannten Regeln in passenden Einheiten','Keinem'],0,'Die Entfernung ändert sich, weil ein Merkmal anderes Gewicht in der Distanz erhält.','scaler'],
  ['wertkette','Wertschöpfung und Prozesslandkarte','Eine Prozesslandkarte zeigt, welche Abläufe zusammen das Ergebnis einer Organisation ermöglichen.',[
    ['Kern, Führung und Unterstützung','Auftragsbearbeitung kann zum Kern gehören. Personal und IT unterstützen ihn. Strategie und Zielvorgaben helfen, den Ablauf zu steuern. Die Einordnung hängt von der Organisation ab.'],
    ['Wertkette nach Porter','Primäre Aktivitäten tragen zur Erstellung, Vermarktung, Lieferung oder Betreuung des Angebots bei. Unterstützende Aktivitäten ermöglichen diese Arbeit. Beurteile Schnittstellen und Wartezeiten.'],
    ['Verantwortung','Lege fest, wer für den gesamten Prozess verantwortlich ist und wer einzelne Schritte ausführt. Eine sichtbare Übergabe hilft, Rückfragen und Doppelarbeit zu erkennen.']
  ],'Was macht die Prozesslandkarte sichtbar?',['Die wichtigsten Abläufe und ihre Beziehungen','Nur einzelne Preise','Die Reihenfolge der Lektionen'],0,'Sie ist der Überblick über zusammenhängende Prozessarten.'],
  ['rechnung','Rechnungsfreigabe mit KI verbessern','Bei der Rechnungsfreigabe kann ein standardisierter Ablauf helfen, Kosten, Rückfragen und Wartezeit zu senken.',[
    ['Ist-Ablauf','Rechnung geht ein, Pflichtangaben werden erfasst, Bestellung und Betrag geprüft. Bei einer Abweichung geht der Fall zurück, sonst zur Freigabe und Archivierung.'],
    ['KI gezielt einsetzen','OCR liest Text aus Scans. Eine automatische Zuordnung kann Standardfälle vorschlagen. Unklare Beträge und unbekannte Lieferanten brauchen eine kontrollierte Ausnahmebehandlung.'],
    ['SMART formulieren','Beispiel: In acht Wochen den Anteil korrekt automatisch erfasster Rechnungen von 40 % auf 65 % erhöhen und falsche Freigaben weiter separat prüfen. Benenne Verantwortliche und Messmethode.']
  ],'Was wäre eine passende Kontrollkennzahl neben der Geschwindigkeit?',['Anteil fälschlich freigegebener Fälle','Farbe der Rechnung','Zahl der verwendeten Schriftarten'],0,'Schnelligkeit allein sagt nichts darüber aus, ob die Freigaben korrekt sind.','quote'],
  ['testfaelle','Spezifikation mit Testfällen prüfen','Schreibe Anforderungen so, dass jemand anders dieselbe Prüfung durchführen kann.',[
    ['Normalfall','Wenn x = 2, w = 0 und b = 0 sind, soll das Regressionslabor 50 % anzeigen. Notiere diese erwartete Ausgabe vor der Umsetzung.'],
    ['Grenzfall und Fehlerfall','Prüfe einen Score genau auf dem Schwellenwert, eine leere CSV und ungültige Einträge. Das Programm soll eine verständliche Rückmeldung zeigen.'],
    ['Übergabe vorbereiten','Halte in einem kurzen Text fest, welche Entscheidung getroffen wurde, welche Probe bestanden ist und welcher Fehler offen ist. So kann jemand mit derselben Grundlage weiterarbeiten.']
  ],'Welcher Fall prüft eine Entscheidungsgrenze direkt?',['Eine beliebige große Eingabe','Ein Score genau auf der Schwelle','Ein Test der Schriftart'],1,'Am Grenzwert fällt auf, ob größer oder größer-gleich gemeint war.'],
  ['willen','Rechtsfähigkeit, Erklärungen und Stellvertretung','Im Zivilrecht musst du klären, wer Träger eines Rechts ist und für wen eine Erklärung wirkt.',[
    ['Begriffe trennen','Rechtsfähigkeit betrifft Rechte und Pflichten. Geschäftsfähigkeit betrifft die Möglichkeit, wirksam eigene Rechtsgeschäfte vorzunehmen. Sachen und Rechte können Gegenstand eines Geschäfts sein.'],
    ['Willenserklärung prüfen','Suche nach Angebot, Annahme und dem jeweils erklärten Inhalt. Kläre, ob eine Erklärung abgegeben wurde und gegebenenfalls zugegangen ist. Bei Irrtum oder fehlender Form kann eine weitere Prüfung nötig sein.'],
    ['Vertretung','Im Beispielfall bestellt eine Mitarbeiterin erkennbar im Namen des Betriebs. Prüfe, ob sie eine eigene Erklärung abgibt, für wen sie handelt und ob Vertretungsmacht vorliegt.']
  ],'Was prüfst du bei einer Bestellung im Namen eines Betriebs besonders?',['Die Mitarbeitendenzahl','Die Vertretungsmacht','Die Farbe der Bestellung'],1,'Davon hängt ab, ob die Erklärung für den Betrieb wirkt.'],
  ['agb','AGB, Rechte bei Mängeln und Prüfungsaufbau','Bei einem Vertragsfall hilft ein fester Aufbau. Kläre zuerst den Anspruch und prüfe danach einzelne Einwände.',[
    ['AGB erkennen','Allgemeine Geschäftsbedingungen sind für eine Vielzahl von Verträgen vorformulierte Bedingungen, die eine Vertragsseite der anderen stellt. Prüfe danach Einbeziehung und Wirksamkeit der konkreten Klausel.'],
    ['Mängel Schritt für Schritt','Wenn eine gekaufte Sache nicht die vereinbarte Beschaffenheit hat, prüfe zunächst die Anspruchsgrundlage und die Voraussetzungen der Mängelrechte. Nacherfüllung ist ein eigener Prüfungspunkt.'],
    ['Falltechnik','Schreib zuerst: Wer verlangt was von wem auf welcher Grundlage? Stelle dann die Voraussetzung, den Sachverhalt und dein Ergebnis nebeneinander.']
  ],'Was kommt in der AGB-Prüfung vor der Frage, ob eine Klausel wirksam ist?',['Ob AGB vorliegen und einbezogen wurden','Ob die Firma Gewinn macht','Wie viele Seiten der Vertrag hat'],0,'Prüfe zuerst, ob die betreffenden Bedingungen Bestandteil des Vertrags geworden sind.'],
  ['kivertrag','KI-Verträge und Leistung beschreiben','Bei einem KI-Vertrag sollte die Aufgabe so klar sein, dass beide Seiten später prüfen können, ob sie erfüllt ist.',[
    ['Leistung abgrenzen','Beschreibe die bereitgestellte Software, Trainingsleistung oder Schnittstelle. Prüfe, ob Tätigkeit, Nutzung oder konkreter Erfolg vereinbart ist.'],
    ['Daten und Abnahme','Definiere, wer welche Daten liefern und für welchen Zweck nutzen darf. Lege eine passende Fehlerkennzahl, Testdaten und ein Abnahmekriterium fest.'],
    ['Betrieb und Wechsel','Frage nach Datenexport, Dokumentation, Fehlermeldungen, Reaktionszeiten und Rückgabe von Daten. Dadurch wird sichtbar, wie abhängig der Auftraggeber vom Anbieter wäre.']
  ],'Welche Vereinbarung macht eine Modell-Abnahme überprüfbar?',['Das Modell muss durchgehend modern aussehen.','Für einen festgelegten Testdatensatz gelten definierte Kennzahlen und Mindestwerte.','Der Anbieter nutzt ein beliebtes Werkzeug.'],1,'Datensatz und Kennzahl machen die erwartete Leistung messbar.'],
  ['lizenz','Software, Trainingsdaten und Nutzungsrechte','Bei KI-Projekten können Daten, Software, Zeichen und technische Erfindungen unterschiedliche Rechte berühren.',[
    ['Gegenstand bestimmen','Kläre, worauf sich der Fall bezieht: Softwarecode, Bild, Name, Patent oder Vertrag. Eine Lizenz beschreibt erlaubte Nutzungen und mögliche Bedingungen.'],
    ['Text prüfen','Lies, ob Änderungen, Weitergabe und kommerzielle Nutzung erlaubt sind. Prüfe auch Hinweise, die bei Weitergabe mitgeliefert werden sollen.'],
    ['KI-Fall trennen','Prüfe Eingabedaten, Modell und Ausgabe getrennt. Wenn ein Mensch eine Ausgabe gestaltet, muss sein eigener Beitrag im Sachverhalt beschrieben werden. Ziehe keine pauschale Folgerung allein daraus, dass KI verwendet wurde.']
  ],'Darf man ein öffentlich sichtbares Bild allein deshalb in einer eigenen App weitergeben?',['Ja, immer','Ja, sobald die Datei heruntergeladen wurde','Die erlaubte Nutzung muss geprüft werden.'],2,'Öffentliche Sichtbarkeit und eine passende Nutzungserlaubnis sind zwei unterschiedliche Fragen.'],
  ['pruefweg','Rechenaufgaben und Fallaufgaben lösen','Eine klare Antwort zeigt Ansatz, Zwischenschritte und Bedeutung. So ist dein Lösungsweg auch bei einem kleinen Rechenfehler nachvollziehbar.',[
    ['Gegeben und gesucht','Markiere Einheiten, Bezugsgröße und den Operator. Bei „Recall berechnen und beurteilen“ sind Rechnung und fachliche Einordnung gefragt.'],
    ['Ansatz und Ergebnis','Beispiel: 9 erkannte von 12 tatsächlichen Defekten ergeben 9/12 = 0,75 = 75 %. Drei tatsächliche Defekte wurden übersehen.'],
    ['Entscheidung begründen','Wenn übersehene Defekte teuer sind, nenne den Zielkonflikt: Eine niedrigere Schwelle kann mehr Defekte erkennen und zugleich mehr Fehlalarme auslösen.']
  ],'Was fehlt nach „Recall = 75 %“, wenn die Aufgabe auch „beurteilen“ verlangt?',['Die passende Einordnung der Folgen im Fall','Ein zweites Prozentzeichen','Nur ein anderer Taschenrechner'],0,'Eine Beurteilung verbindet das Ergebnis mit dem Ziel der Aufgabe.']
];
