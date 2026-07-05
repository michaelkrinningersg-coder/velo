# Velo · Broadcast-Redesign — Export-Paket

Dieses Paket enthält alles, um die Redesign-Screens **2A (Dashboard)**, **3A (Season-Kalender)**
und **4A (Fahrer-Statistik)** sowie die neue **`total_km`-DB-Spalte** in dein `velo`-Repo zu übernehmen.

## Inhalt

| Datei | Zweck | Status |
| :-- | :-- | :-- |
| `01-total_km-backend.md` | Neue DB-Spalte `total_km` pro Fahrer + Hochzählung nach jeder Etappe | **Commit-fertig** (konkrete Snippets je Datei) |
| `02-screens-2A-3A-4A.md` | Integrationsleitfaden: welche `velo`-Datei je Screen geändert wird, Struktur, CSS-Ansatz | Leitfaden + Referenz |
| `design/Velo Redesign.dc.html` | Die vollständige Design-Quelle (visuelle Spezifikation, alle Screens/Tabs) | Referenz |
| `design/support.js` | Runtime, damit `design/Velo Redesign.dc.html` offline im Browser läuft | Referenz |

> Die `design/*`-Dateien sind **Design-Artefakte** (kein `velo`-Code) — sie dienen als pixelgenaue
> Vorlage. Öffne `design/Velo Redesign.dc.html` im Browser, um jeden Screen/Tab live zu sehen.

## Empfohlene Reihenfolge

1. **`total_km` zuerst** — kleiner, in sich geschlossener Change (`01-total_km-backend.md`). Danach
   Backend neu starten, damit die Migration greift.
2. **Screens** — pro Screen die betreffende View-Datei anpassen (`02-screens-2A-3A-4A.md`).

## Git (lokal in `velo/`)

```bash
cd velo
git checkout -b feature/broadcast-redesign
# Änderungen aus 01-total_km-backend.md einpflegen ...
git add backend/ frontend/ shared/
git commit -m "feat: total_km-Zähler pro Fahrer + Anzeige in Karrierestatistik"
# Screens einpflegen ...
git commit -am "feat: Broadcast-Redesign Dashboard/Kalender/Fahrer-Statistik"
git push -u origin feature/broadcast-redesign
```

Danach auf GitHub einen Pull Request öffnen.
