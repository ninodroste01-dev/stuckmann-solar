# Stuckmann Solar - PV-Ertragsrechner

Ein interaktiver ROI-Rechner für Photovoltaikanlagen, entwickelt für Stuckmann Solar GmbH.

## Features

- **Interaktive SVG-Hausvisualisierung**: Das Haus reagiert in Echtzeit auf Eingaben (Dachneigung, Ausrichtung, etc.)
- **Multi-Step Calculator**: Benutzerfreundliche Schritt-für-Schritt-Eingabe
- **ROI-Berechnung**: Präzise Berechnung basierend auf deutschen Standards
- **Lead-Capture**: Sicheres Kontaktformular mit Validierung
- **Responsive Design**: Optimiert für Desktop und Mobile
- **iframe-ready**: Einfache Einbettung in WordPress

## Tech Stack

- **React 18** mit TypeScript
- **Vite** als Build-Tool
- **Tailwind CSS** für Styling
- **Framer Motion** für Animationen
- **Zod** für Validierung
- **Vercel** für Hosting

## Installation

```bash
# Repository klonen
cd stuckmann-solar-calculator

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## Bilder hinzufügen

Ersetzen Sie die Platzhalter in `/public/images/`:

1. **logo.png** - Stuckmann Solar Logo (empfohlen: 200x80px, transparent PNG)
2. **background.jpg** - Optional: Hintergrundbild

## Deployment auf Vercel

### Option 1: Über Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# Einloggen
vercel login

# Deployen
vercel
```

### Option 2: Über Vercel Dashboard

1. Repository auf GitHub pushen
2. In Vercel importieren
3. Framework-Preset: Vite
4. Deploy

## iframe Einbettung

Nach dem Deployment kann der Rechner per iframe eingebettet werden:

```html
<iframe 
  src="https://your-vercel-url.vercel.app" 
  width="100%" 
  height="800" 
  frameborder="0"
  style="border: none; border-radius: 16px; overflow: hidden;"
></iframe>
```

### WordPress Einbettung

1. HTML-Block hinzufügen
2. iframe-Code einfügen
3. Höhe ggf. anpassen (empfohlen: 800-1000px)

## Webhook-Integration

Das Kontaktformular sendet Daten an:
```
https://hook.eu1.make.com/qdlobbppbaiyjnv6ou1mdk8mzk85jgkh
```

### Payload-Format

```json
{
  "timestamp": "2026-02-03T14:30:00Z",
  "source": "stuckmann-solar-calculator",
  "contact": {
    "name": "Max Mustermann",
    "email": "max@example.de",
    "phone": "+49 5222 1234567",
    "plz": "32105"
  },
  "calculation": {
    "roofType": "Satteldach",
    "roofAngle": 35,
    "orientation": "Süd",
    "roofSize": 45,
    "consumption": 4500,
    "wantsStorage": true,
    "storageSize": 10
  },
  "results": {
    "systemSize": 9.0,
    "annualYield": 8550,
    "annualSavings": 2150,
    "roi": 6.5,
    "co2Savings": 5360
  }
}
```

## Sicherheitsfeatures

- **Rate Limiting**: Max. 3 Anfragen pro Stunde
- **E-Mail-Validierung**: Format + Disposable-E-Mail-Check
- **Telefon-Validierung**: Deutsche Nummern-Format
- **Honeypot**: Bot-Erkennung
- **Input Sanitization**: XSS-Schutz
- **Form Timing**: Mindestzeit zum Ausfüllen

## Design-System

### Farben

| Name | Hex | Verwendung |
|------|-----|------------|
| Primary | `#F5A623` | CTAs, Akzente |
| Secondary | `#1E3A5F` | Überschriften |
| Success | `#48BB78` | Positive Werte |
| Solar Yellow | `#FFD93D` | Sonnen-Animationen |

### Schriften

- **Headings**: Montserrat Bold
- **Body**: Inter

## Berechnungsparameter

- Sonneneinstrahlung: 1000 kWh/m²/Jahr
- Moduleffizienz: 20%
- Systemverluste: 15%
- Strompreis: 31,94 ct/kWh
- Einspeisevergütung: 8,11 ct/kWh
- Eigenverbrauch ohne Speicher: 30%
- Eigenverbrauch mit Speicher: 70%

## Lizenz

Proprietär - Entwickelt für Stuckmann Solar GmbH

## Support

Bei Fragen: [Ihre Kontaktdaten hier einfügen]
