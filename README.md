# KI-Lernstudio

Eine interaktive Lernapp zur Weiterbildung in KI und maschinellem Lernen. Sie führt von der Erklärung über eine Beispielrechnung zur eigenen Übung.

**[Lernstudio öffnen](https://ki-lernstudio.pages.dev)** · **[Mitmachen](CONTRIBUTING.md)**

## Inhalt

- Lernpfad für Woche 1 bis 5, Recht, Prozesse und Prüfungsvorbereitung
- Rechenlabor, Formelsammlung und Glossar
- Hell- und Dunkelmodus, Bedienung per Touch und Tastatur
- Lernfortschritt im Browser des jeweiligen Geräts

Die App ist eine kursbegleitende Lernhilfe. Lerntexte und Visualisierungen sind für die App erstellt. Private Kursdateien, personenbezogene Daten und Originalprüfungen gehören nicht in dieses Repository.

## Lokal starten

Benötigt werden ein Browser und Python 3. Es ist keine Paketinstallation für die App nötig.

```sh
python3 -m http.server 8000 --directory public
```

Öffne [localhost:8000](http://localhost:8000). Für die Rechentests mit Node.js ab Version 22:

```sh
node --test
```

## Projektaufbau

- `public/lessons.mjs` enthält Module, Erklärungen und Selbstchecks.
- `public/labs.mjs` verknüpft Eingaben mit Rechenwegen und Diagrammen.
- `public/reference.mjs` enthält Formeln und Begriffe.
- `public/math.mjs` enthält gemeinsame Rechenfunktionen.
- `public/app.mjs` und `style.css` steuern Darstellung und Bedienung.

## Automatische Veröffentlichung

GitHub Actions prüft Pull Requests mit Node.js und Chromium. Cloudflare Pages ist mit diesem Repository verbunden. Bei Änderungen an `main` prüft Cloudflare die Rechenfunktionen erneut und veröffentlicht dann die statischen Dateien aus `public/`. Pull Requests und andere Branches ändern die Live-App nicht.

Die App verwendet den Free Plan von Cloudflare Pages und Standard-Runner von GitHub Actions für das öffentliche Repository. Es gibt keine kostenpflichtige Datenbank und kein KI-API-Konto. Preview-Deployments sind deaktiviert, um das kostenlose Build-Kontingent für Produktionsupdates zu nutzen.
