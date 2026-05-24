# Afellah Haustechnik - Cloud Code Fortschritt

## 🎯 Nächste Schritte in Cloud Code

### 1. GitHub Remote + Push (5 min)
```bash
cd C:\Users\nikfr\Dev\03_Websites\afellah-haustechnik

# Remote hinzufügen (falls noch nicht geschehen)
git remote add origin https://github.com/nikcommits/afellah-haustechnik.git
git branch -M main
git push -u origin main

# Status prüfen
git status
```

### 2. GitHub Pages aktivieren (2 min)
- Gehe zu https://github.com/nikcommits/afellah-haustechnik
- Settings → Pages
- Deploy from: `main` / root
- Save

### 3. Testumgebung prüfen (1 min)
```bash
# URL öffnen:
https://nikcommits.github.io/afellah-haustechnik/

# Oder lokal testen:
cd C:\Users\nikfr\Dev\03_Websites\afellah-haustechnik
python -m http.server 4174
# http://localhost:4174
```

### 4. Placeholder-Bilder ersetzen (optional)
Die `.webp.txt` Dateien in `assets/` sind Platzhalter.
Echte Bilder können später hier eingefügt werden.

---

## 📊 Projekt-Status

| Aufgabe | Status |
|---------|--------|
| ASE-Struktur | ✅ Fertig |
| HTML + CSS | ✅ Fertig |
| content.json | ✅ Fertig (600+ Zeilen) |
| Git initialisiert | ✅ Fertig |
| GitHub Remote | ⏳ Ausstehend |
| GitHub Pages | ⏳ Ausstehend |
| Tests (lokal) | ⏳ Ausstehend |
| Live-Domain | 📅 Später |

---

## 📁 Pfade

- **Arbeitsordner (Kunde):** `C:\Users\nikfr\Dev\02_Kundenprojekte\afellah\final\`
- **Git-Repo (Dev):** `C:\Users\nikfr\Dev\03_Websites\afellah-haustechnik\`
- **GitHub:** `nikcommits/afellah-haustechnik`
- **GitHub Pages URL:** `https://nikcommits.github.io/afellah-haustechnik/`

---

## 🔧 Schnelle Kommandos

```bash
# Status & Log
git status
git log --oneline

# Änderungen nach lokaler Bearbeitung:
git add .
git commit -m "Update content in content.json"
git push

# Content-Datei öffnen
code content/content.json

# Lokal vorschauen
python -m http.server 4174
```

---

## ❓ Fragen für später

- Sollen echte Bilder (badplanung, notdienst, etc.) noch hochgeladen werden?
- Live-Domain afellah.de auf diese GitHub Pages zeigen lassen?
- Google Search Console Sitemap einreichen?
- Kontaktformular später hinzufügen (aktuell nur Telefon/E-Mail)?

---

**Letzter Commit:** `11dece7` - Initial commit (2026-05-24)
**Ersteller:** Claude Haiku 4.5
**Nächste Aktion:** GitHub Remote + Push
