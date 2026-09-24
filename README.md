# Moran Family Board Card

**Deutsch** · [English](README.en.md)

[Agent-Handoff](HANDOFF.md) · [Entwicklung](docs/DEVELOPMENT.md) ·
[Backlog](docs/BACKLOG.md) · [Recherche](docs/research/README.md)

Aktueller Entwicklungsbranch: `feature/moran-foundation`. Der aktive Pilot ist schreibgeschützt.
Die Bilder unten zeigen Upstream bzw. historische Konzepte, nicht die aktuelle Kalenderoberfläche.

[Projektdokumentation](docs/README.md) · [Entscheidungen und Gespräche](docs/DECISIONS.md) ·
[Aktueller Stand](docs/STATUS.md) · [Architekturentscheidung](docs/adr/0001-implementation-base.md)

Dies ist der Moran-gepflegte Fork von
[`renespeaker/ha-family-board-card`](https://github.com/renespeaker/ha-family-board-card). Die
englische README beschreibt zusätzlich die neue Zuordnung von Terminen aus gemeinsamen Kalendern
zu Personenspalten.

![Family Board Card – Tagesansicht](docs/preview-day.png)

Ein Familienkalender bzw. „Wer ist wann wo"-Board für [Home Assistant](https://www.home-assistant.io/). Personen stehen als Spalten oben (mit Avatar aus der `person.*`-Entität), links läuft die Zeitleiste. Die Karte zeigt auf einen Blick, welche Aktivitäten gleichzeitig an unterschiedlichen Orten stattfinden — für bis zu 10 Personen.

- **Tagesansicht** – Personen als Spalten, geteilte Zeitachse, Jetzt-Linie; **überlappende Termine** werden nebeneinander dargestellt.
- **Wochenansicht** – Wochentage als Zeilen, Personen als Spalten, kompakte Termin-Chips.
- **Monatsansicht** – klassisches Monats-Grid mit farbigen Terminen pro Person; Klick auf einen Tag springt in die Tagesansicht.
- **Agenda-/Listenansicht** – chronologische Terminliste, nach Tagen gruppiert; ideal fürs Handy.
  Im Wall-Modus wird beim Öffnen das gewählte Datum sichtbar. „Heute“ und der Wochenwechsel
  positionieren die Liste erneut; Aktualisierungen und Größenänderungen unterbrechen das
  manuelle Scrollen nicht. Leere Tage führen zur nächsten vorhandenen Datumsgruppe der Woche,
  sonst zur letzten vorherigen Gruppe – immer mit deren tatsächlichem Datum.
- **Status-Kacheln** (`show_focus`) – im Wall-Layout aktueller Frei-/Belegt-Status und nächster Termin mit eigenem Datum/Uhrzeit. Unvollständige Daten gelten nicht als frei; Ganztagstermine zählen nicht als belegt. Das Legacy-Layout behält die bisherige „Jetzt / als Nächstes“-Darstellung.
- **Auto-Symbole** – optional bekommt jeder Termin per Stichwort ein passendes Emoji (Arzt → 🩺, Sport → 🏃, Geburtstag → 🎂, Schule → 🎒 …); eigene Regeln möglich. Titel, die schon ein Emoji haben, bleiben unberührt.
- **Zeitstrahl-Ansicht** – Personen als Zeilen links, die Zeit läuft horizontal: Termine als Balken auf einem Zeitstrahl (Gantt-Stil); überlappende Termine stapeln sich in Unterzeilen.
- **Ansichten wählbar** – im Editor festlegen, welche Umschalter (Tag/Zeitstrahl/Woche/Monat/Agenda) erscheinen.
- **Wochen-Navigation** – vor/zurück blättern, ein Klick auf den Datumsbereich springt zurück zu „heute".
- **Theme-aware** – übernimmt Farben und Schrift des aktiven Dashboard-Themes (nutzt durchgehend HA-CSS-Variablen).
- **Konfigurierbar** – Zeitraster 15/30/60 min, Tagesfenster, Wochenende ein/aus, Einfärben nach Person oder Ort, Auto-Aktualisierung.
- **Drag & Drop** – in der Tagesansicht Termine per Ziehen verschieben (Uhrzeit) und am unteren Rand die Dauer ändern; rastet aufs Zeitraster und schreibt direkt in den Kalender zurück – **nur** bei schreibbaren Kalendern, Einzeltermine (keine Serien).
- **Termine verwalten** – anlegen/bearbeiten/löschen direkt in der Karte, **aber nur** bei Kalendern, die das unterstützen (Local Calendar, CalDAV …). Schreibgeschützte Kalender (z. B. ICS-Abos) werden automatisch erkannt und nur angezeigt. Wiederkehrende Termine: Wahl **„nur dieser / dieser und folgende"**.
- **Mehrere Kalender pro Person** – z. B. Arbeit + privat in einer Spalte (im Editor auswählbar).
- **Robuste Termin-Logik** – Ganztags-Events (Ende exklusiv), über Mitternacht laufende und mehrtägige Termine werden korrekt auf die Tage aufgeteilt; Zeitzonen werden berücksichtigt.
- **Mehrsprachig & lokalisiert** – Texte in Deutsch/Englisch, Wochentage und Uhrzeiten (12/24 h) aus der HA-Locale; relative Tage („Heute/Morgen").
- **Alltags-Politur** – vergangene Termine ausgegraut, Einfärben auch nach Kalender, Ort direkt in der Karten-App öffnen, störende Termine per Muster ausblenden.
- **Live-Fortschritt & Countdown** – laufende Termine zeigen einen Fortschrittsbalken (abschaltbar), kommende in der Agenda ein „in 20 Min."; aktualisiert minütlich.
- **Wetter** – Symbol + Temperatur pro Tag aus einer `weather.*`-Entität im Tages-/Agenda-Header (HA-Standort, nicht die Termin-Adresse).
- **Dichte Tage bleiben lesbar** – überlappen mehr Termine als `max_columns` erlaubt, werden die zusätzlichen Spalten zu einem „+N"-Chip zusammengefasst statt zu unlesbar schmalen Streifen zu schrumpfen. Der Chip öffnet die Agenda, wenn sie aktiviert ist. Im Wall-Tagesmodus ohne Agenda öffnet er eine aktuelle Terminliste für diese Person und dieses Datum; Details und Rückkehr zur Tagesansicht bleiben erreichbar.
- **Lange Termine als Hintergrund-Band** – Dauertermine (z. B. OGS/Betreuung, „Freispiel") ab einer einstellbaren Länge laufen als dezentes Vollbreiten-Band hinter der Spalte, statt die kurzen Stunden nebeneinander zu quetschen. So bekommen die eigentlichen Termine die volle Breite.
- **Auto-Fit-Höhe** – optional passt sich die Tagesansicht automatisch an die verfügbare Kartenhöhe an, sodass Start–Endstunde ohne Scrollen komplett sichtbar sind (ideal für Wandtablets/Kiosk).
- **Füllt den Bildschirm** – Personenspalten wachsen mit der Kartenbreite mit (Panel-Ansicht/breite Karten); mit `full_height` reicht das Board bis zum unteren Bildschirmrand. Spaltenbreite, Achsenbreite und Abstände sind einstellbar.
- **Vorläufige Termine** – Termine, deren Titel ein `tentative_patterns`-Muster enthält, werden gestrichelt und leicht transparent dargestellt (opt-in; der Kalender-Status wird bewusst nicht ausgewertet).
- **Entitäts-Badges pro Person** – beliebige Entitäten (Handy-Akku, Sensoren …) als kleine Chips unter dem Personenkopf; Klick öffnet den More-Info-Dialog.
- **Kiosk-Modus** – optional nach X Minuten Inaktivität automatisch zurück zur Startansicht und zu „heute"; größere Touch-Ziele auf Touch-Geräten.
- **Visueller Editor 2.0** – komplett ohne YAML: Erststart-Assistent, Ein-Klick-Profile (🖥️ Wandtablet / 📱 Handy / 🧩 Standard), aufklappbare Themen-Gruppen mit Hilfetexten, Farbpaletten-Wähler pro Person **und pro Kalender** (inkl. Label), Feintuning-Regler (Schriftgröße, Ecken-Radius, Deckkraft) – Felder erscheinen nur, wenn die zugehörige Ansicht aktiv ist.
- **⚡ Zero-Config-Start** – beim Hinzufügen erkennt die Karte automatisch alle `person.*`-Entitäten und verknüpft passende Kalender per Namensabgleich; im Editor jederzeit per „✨ Automatisch erkennen" nachholbar.
- **Personen-Toggle** – Klick auf einen Personenkopf blendet die Person temporär aus (Spalte kollabiert zum Avatar); zweiter Klick holt sie zurück. Wirkt in allen Ansichten.
- **Termin-Aufräumer** – Allow-Liste (`show_patterns`), Titel-Ersetzung (`replace_patterns`, „Suchtext => Ersatz") und Duplikat-Filter (`filter_duplicates`, gleicher Termin in mehreren Kalendern nur 1×).
- **Mehrtägige Termine** – Segmente zeigen „(2/5)", damit klar ist, der wievielte Tag es ist.
- **Kalender-Mapping** – über `calendars:` bekommt jeder Kalender eine feste Farbe, ein eigenes Label, ein **mdi-Symbol** vor dem Titel und optional ein anderes **Titel-Feld**.
- **Titel aus einem anderen Feld** – Schul-/Stundenplan-Feeds schreiben das Fach oft in `description`, während `summary` nur „Klassenverbund" sagt: `title_field: description` zeigt endlich „Mathematik" statt dreimal dasselbe.
- **Karten-Link frei wählbar** – `map_url` mit Platzhalter `{location}` (Google Maps, Apple Maps, OpenStreetMap …), Default bleibt Google Maps.
- **Kompakt-Modus** – ein Schalter (`compact`) für kleinere Schriften und engere Abstände, statt drei Regler einzeln zu justieren.
- **Personen beim Start ausgeblendet** – `hidden: true` pro Person; die Spalte startet eingeklappt und ein Klick auf den Kopf holt sie zurück.

> Fork-Status: **Kalender-Entwicklungsstand auf Basis von Upstream v0.25.**
> Das Wall-Layout ist in einem privaten Home-Assistant-Pilotbetrieb installiert,
> Kalenderänderungen sind dort deaktiviert. Dies ist ein Entwicklungsstand, keine
> veröffentlichte HACS-Version. Haushaltsmodule und ein direkter Bridge-Adapter bleiben
> zurückgestellt. Aktuelle Entscheidungen und offene Arbeiten stehen in den verlinkten Projektdokumenten.
> [Aktueller Stand](docs/STATUS.md) nennt den neuesten Entwicklungsbuild und die getrennt
> installierte HA-Version. Ein neuer GitHub-Commit aktualisiert den Pilotbetrieb nicht automatisch.

Der Wall-Pilot trennt jetzt den aktuellen Frei-/Belegt-Status vom nächsten Termin und zeigt
dessen Datum und Uhrzeit separat. „Heute“ scrollt zur aktuellen Zeit; Ansicht und ausgeblendete
Personen bleiben lokal im Browser gespeichert. Getrennte Datumszellen und der neutrale
Ansichtsumschalter sind ebenfalls installiert. Nachweise und verbleibende Geräteprüfungen:
[Aktueller Stand](docs/STATUS.md).

In der Wall-Timeline bleiben Avatar, Name und Anwesenheitsstatus beim vertikalen Scrollen
langer Personenzeilen unter der Zeitachse sichtbar, begrenzt auf die jeweilige Zeile.
Die links fixierte Anzeige blendet weiterhin die Termine dieser Person ein oder aus;
es entsteht keine zusätzliche Kopfzeile. Das Legacy-Layout bleibt unverändert.
Die aktuelle Uhrzeit bleibt beim vertikalen Scrollen an der Zeitachse sichtbar und folgt
beim horizontalen Scrollen der roten Linie. Am Anfang und Ende des Zeitbereichs bleibt
die Beschriftung innerhalb der Zeitfläche; fixierte Namen werden nicht übermalt.
Titel langer und ganztägiger Termine bleiben beim horizontalen Scrollen innerhalb ihres
Balkens sichtbar. Lange Titel werden gekürzt; die vollständigen Angaben bleiben in der
schreibgeschützten Detailansicht erreichbar.

Der aktuelle Entwicklungsbuild bietet in Wall-Tag und -Timeline **Kalenderzoom** über die
Lupe im Kopfbereich: links mehr Stunden, rechts mehr Details. Tag verändert die Stundenhöhe
(40–96px; 100% = 64px), Timeline die Stundenbreite (48–240px; 100% = 96px), nicht die Personenzeilenhöhe.
Datum, Uhrzeitposition und Personenspalten bleiben erhalten, soweit der Scrollbereich es
zulässt. „Zurücksetzen“ stellt `hour_height`/`fit_height` in Tag oder `hour_width` in Timeline
wieder her und löscht nur den gespeicherten Zoom der aktiven Ansicht. Bei aktiviertem
`remember_preferences` (Wall-Standard) bleiben beide Zoomwerte unabhängig nach dem Neuladen
erhalten: lokal in diesem Browser, je HA-Benutzer, Dashboard und Karte. Geänderte Dichte-
Standardwerte verwerfen nur den Zoom der betroffenen Ansicht. Ohne diese Option bleibt
Zoom auf die Sitzung beschränkt. Keine Termine, Datums-/Scrollpositionen oder geräteübergreifende
Synchronisierung; Monat, Agenda und Legacy haben keinen Zoomregler.
Kurze Termine zeigen vorrangig den Titel; Details und Agenda bieten mehr Platz.
Im Wall-Monat führt ein Klick auf den Monatsnamen zu „Heute“ und macht Datum und Spalte
sichtbar. Bereits sichtbare Daten bleiben an ihrer Position; neue Eingaben im Raster
brechen verzögertes Scrollen ab. Normale Aktualisierungen setzen die Ansicht nicht zurück.
Wall-Woche zeigt beim Öffnen, Wochenwechsel und Klick auf „Heute“ das gewählte Datum im
verfügbaren Scrollbereich. Das Datum steht oben in seiner Zeile. Die horizontale Position
bleibt erhalten; Aktualisierungen und Größenänderungen setzen manuelles Scrollen nicht zurück.
Neue Eingaben brechen verzögerte Navigation ab. Datums-/Scrollpositionen werden nicht gespeichert.
Wall-Woche nutzt dieselbe Lupe für die Listendichte, 75–150% (Standard 100%): links mehr
Termine, rechts größere Schrift/Abstände. Titel bleiben vollständig umbrochen, Text mindestens
12px und Terminkarten mindestens 48px hoch. Fixierte Überschriften und Personenspaltenbreiten
bleiben gleich. Die sichtbare Datumszeile bleibt beim Zoomen im Rahmen der Scrollgrenzen
erhalten. Woche speichert ihren Zoom unabhängig; „Zurücksetzen“ löscht nur diesen Wert.
Der [aktuelle Stand](docs/STATUS.md) trennt Entwicklungsbuild und installierten Pilotbetrieb.

Wall-Monat zeigt mit **+N weitere Termine** die übrigen Terminkarten eines Datums direkt
in der Monatsansicht; **Weniger anzeigen** klappt sie wieder ein. Lange Titel werden vollständig
umbrochen. Nur ein Datum ist gleichzeitig aufgeklappt; dieser Zustand wird nicht gespeichert.
Ohne gültigen Sprung zur Tagesansicht lässt sich das breitere Monatsraster auf schmalen Karten
horizontal verschieben. Ausgeblendete Wochenendtage führen nicht mehr zu einem anderen Wochentag.
Die Datumssumme zählt eindeutige Termine; der Überlauf zählt die angezeigten Personenkopien.

Wall-Ansichts- und Datumstabs lassen sich mit Links/Rechts sowie Pos1/Ende fokussieren;
Enter/Leertaste wählt aus. Tab verlässt die Gruppe; beim Zurückkehren ist die gewählte
Option erreichbar. Der Fokus allein wechselt weder Ansicht noch Datum. Verdeckte Tabs
werden im eigenen Streifen sichtbar, ohne den Kalender zu verschieben. Datumstabs bleiben
beim Umlauf in der angezeigten Woche; die bisherigen Navigationstasten blättern weiter.

## Installation (HACS Custom Repository)

1. HACS öffnen → Drei-Punkte-Menü → **Benutzerdefinierte Repositories**.
2. `https://github.com/emilianomoran/moran-family-board-card` als Kategorie **Dashboard** hinzufügen.
3. **Moran Family Board Card** installieren.
4. Karte mit `type: custom:moran-family-board-card` hinzufügen.

### Manuell (schneller Test ohne HACS)

`dist/moran-family-board-card.js` nach `config/www/` kopieren und als Resource hinzufügen:

```yaml
url: /local/moran-family-board-card.js
type: module
```

## Konfiguration

```yaml
type: custom:moran-family-board-card
title: Familienplan  # optional, eigener Kartentitel
view: day            # day | week
time_grid: 30        # 15 | 30 | 60
start_hour: 6
end_hour: 22
show_weekends: true
show_now_line: true
color_by: person     # person | location
hour_height: 64      # Pixel pro Stunde (40–96), Tagesansicht
refresh_interval: 300 # Sekunden; 0 = aus
persons:
  - name: Anna
    person: person.anna       # Avatar (entity_picture) + Live-Status
    calendar: calendar.anna   # Quelle der Termine
    color: '#8B7CF6'          # optional, sonst Default-Palette
  - name: Ben
    person: person.ben
    calendar:                   # mehrere Kalender pro Person möglich
      - calendar.ben_arbeit
      - calendar.ben_privat
```

| Option          | Typ     | Default | Beschreibung |
|-----------------|---------|---------|--------------|
| `persons`       | Liste   | –       | 1–10 Personen mit `name`, `person`, `calendar` (String **oder Liste**), optional `color`, `badges` (Entitäten als Chips) und `hidden` (startet eingeklappt) |
| `hide_empty_persons` | boolean | `false` | Wochenansicht: Personen ohne Termine in der Woche ausblenden |
| `show_focus`    | boolean | `false` | „Jetzt / als Nächstes"-Leiste pro Person über den Ansichten |
| `drag_drop`     | boolean | `true`  | Termine in der Tagesansicht per Ziehen verschieben / in der Dauer ändern (nur schreibbare Einzeltermine) |
| `auto_icons`    | boolean | `false` | Emoji je Termin nach Stichwort automatisch voranstellen |
| `icon_patterns` | Liste   | –       | Eigene Symbol-Regeln, z. B. `["Oma => 👵"]` |
| `auto_return`   | number  | `0`     | Kiosk: nach X Minuten ohne Berührung zurück zur Startansicht/heute (0 = aus) |
| `title`          | string  | –       | Eigener Kartentitel (Default: lokalisiert „Familienplan") |
| `view`          | string  | `day`   | Startansicht: `day`, `timeline`, `week`, `month` oder `agenda` |
| `views`         | Liste   | alle    | Welche Ansichten im Umschalter erscheinen, z. B. `[day, agenda]` |
| `time_grid`     | number  | `30`    | Raster der Zeitleiste in Minuten |
| `start_hour`    | number  | `6`     | Erste sichtbare Stunde |
| `end_hour`      | number  | `22`    | Letzte sichtbare Stunde |
| `show_weekends` | boolean | `true`  | Sa/So anzeigen |
| `show_now_line` | boolean | `true`  | Aktuelle Uhrzeit als Linie |
| `color_by`      | string  | `person`| Einfärben nach `person`, `location` oder `calendar` |
| `dim_past`      | boolean | `true`  | Bereits vergangene Termine ausgrauen |
| `hide_patterns` | Liste   | –       | Termine ausblenden, deren Titel eines der Textmuster enthält (z. B. `["Frei", "Privat"]`) |
| `show_patterns` | Liste   | –       | Allow-Liste: nur Termine zeigen, deren Titel eines der Muster enthält |
| `replace_patterns` | Liste | –      | Titel aufräumen: `"Suchtext => Ersatz"` (ohne `=>` wird der Text entfernt) |
| `filter_duplicates` | boolean | `false` | Identische Termine (Titel+Zeit) pro Person und in der Agenda nur einmal zeigen |
| `calendars`     | Map     | –       | Pro Kalender `color`, `label`, `icon` (mdi) und `title_field` (im Editor pflegbar) |
| `compact`       | boolean | `false` | Kompakte Darstellung: kleinere Schriften und engere Abstände |
| `map_url`       | string  | Google  | Vorlage für den Orts-Link, `{location}` wird eingesetzt, z. B. `https://maps.apple.com/?q={location}` |
| `event_size`    | number  | –       | Schriftgröße der Termin-Titel in px (Editor-Slider, setzt `--fb-event-size`) |
| `radius`        | number  | –       | Ecken-Radius der Termin-Blöcke in px (setzt `--fb-radius`) |
| `past_opacity`  | number  | –       | Deckkraft vergangener Termine in % (setzt `--fb-past-opacity`) |
| `show_progress` | boolean | `true`  | Fortschrittsbalken am laufenden Termin |
| `weather_entity`| string  | –       | `weather.*`-Entität für die Tages-Vorhersage (HA-Standort) |
| `show_weather`  | boolean | `true`* | Wetter im Header anzeigen (*wirkt nur, wenn `weather_entity` gesetzt) |
| `hour_height`   | number  | `64`    | Höhe einer Stunde in px (40–96) – Tagesansicht skalieren (Wandtablet); bei `fit_height` die Obergrenze |
| `hour_width`    | number  | `96`    | Zeitstrahl-Ansicht: Breite einer Stunde in px (48–240) |
| `fit_height`    | boolean | `false` | Tagesansicht automatisch so verkleinern, dass Start–Endstunde ohne Scrollen komplett sichtbar sind (Wandtablet/Kiosk) |
| `full_height`   | boolean | `false` | Im Wall-Modus den gesamten Kalender bis zum unteren Bildschirmrand strecken, begrenzt durch einen kleineren Container; alle fünf Ansichten scrollen intern, auch in inhaltsgroßen HA-Panel-Ansichten. Ohne diese Option gilt die vorgegebene Containerhöhe. Legacy behält die Tagesansicht mit standardmäßiger 58-%-Begrenzung. |
| `trim_hours`    | boolean | `true`  | Tagesansicht: leere Randstunden automatisch abschneiden, damit der belegte Teil des Tages die volle Höhe bekommt (min. 6-h-Fenster; `start_hour`/`end_hour` bleiben die Außengrenzen) |
| `col_min_width` | number  | `120`   | Mindestbreite (px) pro Personenspalte, darunter wird horizontal gescrollt; Spalten wachsen darüber hinaus mit der Kartenbreite |
| `background_hours` | number | `3`  | Timed-Termine ab dieser Länge (Std.) als dezentes Hintergrund-Band statt als Spalte; `0` = aus |
| `max_columns`   | number  | `3`     | Max. nebeneinander liegende Spalten pro Person/Tag; bei mehr Überlappungen erscheint ein „+N"-Chip (1–8) |
| `tentative_patterns` | Liste | –    | Termine mit passendem Titel-Muster als vorläufig (gestrichelt/transparent) markieren |
| `first_day`     | string  | `monday`| Wochenstart: `monday` oder `sunday` |
| `scroll_to_now` | boolean | `true`  | Tagesansicht und Wall-Zeitstrahl für heute nach dem Laden zur aktuellen Uhrzeit scrollen. „Heute“ zentriert im Wall-Layout auch bei `false` oder ausgeblendeter Jetzt-Linie. Aktualisierungen und Größenänderungen im Zeitstrahl erhalten die manuelle Scrollposition. Der Legacy-Zeitstrahl bleibt unverändert. |
| `refresh_interval` | number | `300` | Auto-Aktualisierung der Termine in Sekunden (0 = aus); zusätzlich bei Tablet-Aufwachen |

Jede `calendar.*`-Entität funktioniert – egal ob `local_calendar` (lokal, ohne Cloud), Google oder CalDAV. Home Assistant liefert alle einheitlich.

## Aussehen anpassen (Theme / card-mod)

Die Karte übernimmt automatisch Farben & Schrift des Themes. Für Feintuning gibt es zusätzlich eigene CSS-Variablen, die du im **Theme** oder per **card-mod** überschreiben kannst:

| Token | Default | Wirkung |
|-------|---------|---------|
| `--fb-accent` | `--primary-color` | „Heute"-/Akzentfarbe |
| `--fb-now-color` | `--error-color` | Jetzt-Linie & Fortschritt |
| `--fb-radius` | `7px` | Ecken der Termin-Blöcke |
| `--fb-radius-sm` | `5px` | Ecken der Chips |
| `--fb-avatar-size` | `34px` | Avatar-Größe |
| `--fb-past-opacity` | `0.5` | Deckkraft vergangener Termine |
| `--fb-title-size` | `16px` | Kartentitel |
| `--fb-name-size` | `13px` | Personennamen |
| `--fb-event-size` | `11.5px` | Termin-Titel |
| `--fb-time-size` | `9.5px` | Uhrzeiten im Block |
| `--fb-chip-size` | `10.5px` | Chip-Schriftgröße |
| `--fb-hourline` / `--fb-halfhour` / `--fb-row-shade` | – | Rasterlinien / Zeilenschattierung |
| `--fb-col-min` | `120px` | Mindestbreite einer Personenspalte |
| `--fb-axis-width` | `56px` | Breite der Zeitachse links |
| `--fb-board-max-height` | `58vh` | Höhen-Deckel des Tages-Boards (ohne `full_height`) |
| `--fb-event-pad` | `4px 7px` | Innenabstand der Termin-Blöcke |
| `--fb-head-pad` | `10px 6px` | Innenabstand der Personen-Köpfe |

Beispiel (card-mod):

```yaml
type: custom:moran-family-board-card
card_mod:
  style: |
    :host {
      --fb-accent: #e91e63;
      --fb-event-size: 13px;
      --fb-radius: 12px;
      --fb-avatar-size: 40px;
    }
persons: …
```

## Sprachen

Karte **und** visueller Editor sprechen **Deutsch und Englisch**. Die Sprache folgt deinem Home-Assistant-Benutzerprofil; alles, was eine Übersetzung nicht abdeckt, fällt auf Englisch zurück. Datum, Wochentage und das Zeitformat (12/24 h) kommen über `Intl` aus der HA-Locale.

Noch eine Sprache? Ein Dictionary in [`src/localize.ts`](src/localize.ts) (Karte) und [`src/editor-i18n.ts`](src/editor-i18n.ts) (Editor) ergänzen – beides sind einfache Key/Value-Objekte, Pull Requests willkommen.

## Entwicklung

```bash
npm install
npm run build        # baut dist/moran-family-board-card.js
npm run watch        # Rebuild bei Änderungen
npm run lint         # tsc --noEmit (Typecheck)
npm test             # Vitest (Event-Logik)
npm run format       # Prettier
```

Schneller Loop gegen die laufende HA-Instanz: `dist/moran-family-board-card.js` nach `config/www/` kopieren und die Seite hart neu laden.

Die fehleranfällige Event-Logik (Splitting über Mitternacht, Ganztags-Exklusivität, Zeitzonen, Überlappungs-Layout) liegt isoliert in [`src/events.ts`](src/events.ts) und ist über [`src/events.test.ts`](src/events.test.ts) abgedeckt.

## Termine anlegen / bearbeiten / löschen

In der Tagesansicht eine freie Stelle in der Personenspalte anklicken öffnet den Dialog zum Anlegen (die Uhrzeit wird aus der Klick-Position übernommen); ein Klick auf einen Termin öffnet ihn zum Bearbeiten/Löschen. Ob das möglich ist, hängt vom Kalender ab: Die Karte liest `supported_features` der jeweiligen `calendar.*`-Entität und blendet Schreibaktionen aus, wenn der Kalender sie nicht unterstützt. Intern werden die WebSocket-Kommandos `calendar/event/create|update|delete` genutzt (dieselben wie die native HA-Kalenderoberfläche).

## Roadmap

- [x] Termine anlegen/bearbeiten/löschen, nur bei schreibbaren Kalendern
- [x] Personen-Editor im visuellen Config-Editor
- [x] Wochen-Navigation & Nebeneinander-Layout überlappender Termine
- [x] Mehrsprachigkeit (i18n, DE/EN) + Locale-Zeitformat
- [x] Kiosk-/Wandtablet-Modus (`full_height`, `fit_height`, `auto_return`, Touch-Ziele)
- [x] Mobile-Layout (kompakte Spalten, wischbar)
- [x] Drag & Drop zum Verschieben von Terminen
- [x] Aufnahme in den offiziellen HACS-Store
- [x] Lokalisierter visueller Editor (DE/EN)
- [ ] Orts-/Konflikterkennung (z. B. „niemand zuhause", Abhol-Lücken)

## Lizenz

MIT
