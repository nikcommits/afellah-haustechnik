# Afellah Haustechnik - Statische Website

Statische Website für Afellah Haustechnik (Meisterbetrieb für Sanitär & Heizung in Krefeld).

## Architektur

- **Format:** ASE (Attribute Semantic Engine)
- **HTML:** Statisch mit `data-ase` Attributen
- **Inhalte:** Separiert in `content/content.json`
- **Hydratisierung:** `scripts/ase-bridge.js` lädt die Inhalte zur Laufzeit
- **Fallback:** `content/content.js` für `file://` Protokoll (lokal)

## Struktur

```
final/
├── index.html              # Hauptseite mit data-ase Bindungen
├── impressum.html          # Impressum
├── datenschutz.html        # Datenschutzerklärung
├── content/
│   ├── content.json        # Alle Inhalte (Texte, Links, Kontakt)
│   └── content.js          # Fallback für lokale Vorschau
├── scripts/
│   └── ase-bridge.js       # ASE Hydratisierungs-Engine
├── assets/                 # Bilder (hero.webp, etc.)
├── afellah-tokens.css      # Design Tokens & Responsive Layout
├── robots.txt
├── llms.txt
└── README.md
```

## Lokale Vorschau

```bash
cd C:\Users\nikfr\Dev\02_Kundenprojekte\afellah\final
python -m http.server 4174
# Öffne http://localhost:4174
```

## Hosting

- **Testumgebung:** GitHub Pages (nikcommits/afellah-haustechnik)
- **Live:** (später auf afellah.de oder eigenem Server)

## Content-Updates

Alle Texte, Links und Kontaktdaten sind in `content/content.json` gespeichert.
Änderungen dort werden automatisch im HTML sichtbar (keine HTML-Bearbeitung nötig).

## SEO & Meta

- JSON-LD LocalBusiness (in content.json)
- Meta-Description, OG-Tags
- robots.txt und llms.txt
