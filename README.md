# 🤖 KingBot - WhatsApp Bot

Ein Feature-reicher WhatsApp Bot mit Leveling-System, RPG-Gameplay, Economy und vielem mehr!

## ✨ Features

### 📊 Leveling & Liga System
- **Normale Nachrichten:** +5 XP
- **Commands:** +7 XP
- **Liga-Aufstieg:** Abhängig vom Level (25 Level = 1 Liga Stufe)
- **Ligasystem:** 13 verschiedene Ligagruppen mit jeweils 3 Stufen (I, II, III)

### 👤 Nutzerverwaltung
- DSGVO-konforme Registrierung
- Benutzerprofile mit Profildaten
- Sicherheitsfunktionen (Passwort, Login/Logout)

### 🎮 Minispiele
- Münzwurf, Würfel, Magic 8 Ball
- Schere-Stein-Papier, Zahlenratespiel
- Slotmaschine, Lotto, Blackjack, Roulette, Memory

### 💰 Economy System
- Tägliche, wöchentliche, monatliche und jährliche Belohnungen
- Shop & Inventar-System
- Raub-Mechaniken
- Ranglistensystem

### ⚔️ RPG System
- Charaktererstellung & -verwaltung
- Kämpfe & Duelle
- Monster-Jagd
- Gilden-System
- Crafting & Ausrüstung

### 🛡️ Gruppenverwaltung
- Anti-Link & Anti-Spam
- Verwarnungssystem
- Benutzerdefinierte Willkommens-/Abschiedsnachrichten
- Feature-Toggle pro Gruppe

## 📋 Anforderungen

- Node.js >= 14.0.0
- MongoDB
- WhatsApp Konto

## 🚀 Installation

```bash
# Repository klonen
git clone https://github.com/thebestmikeboy-ai/KingBot.git
cd KingBot

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# Bearbeite .env mit deinen Einstellungen

# Bot starten
npm start
```

## 📂 Projektstruktur

```
KingBot/
├── src/
│   ├── index.js                 # Bot Einstiegspunkt
│   ├── config/                  # Konfigurationsdateien
│   ├── commands/                # Command-Handler
│   │   ├── profile/
│   │   ├── fun/
│   │   ├── economy/
│   │   ├── rpg/
│   │   ├── community/
│   │   └── ...
│   ├── models/                  # Mongoose Schema
│   ├── utils/                   # Hilfsfunktionen
│   ├── handlers/                # Event-Handler
│   └── db/                      # Datenbankverbindung
├── .env.example
├── package.json
└── README.md
```

## 📝 Lizenz

MIT

## 🤝 Support

Bei Fragen oder Problemen nutze bitte den `Xsupport`-Command im Bot!
