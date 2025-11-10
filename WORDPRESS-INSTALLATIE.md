# WordPress Cross-Linking Installatie Handleiding

## 📋 Overzicht

Dit snippet voegt automatisch links toe tussen je webshop (technischeservice.nl) en je nieuwe informatiewebsite (technischeserviceassen.nl).

---

## 🎯 Wat Doet Het?

### 1. **Homepage Banner** 🎉
- Vaste banner onderaan de pagina
- "Bezoek onze nieuwe informatiewebsite"
- Met sluit-knop (× rechts boven)
- Links naar info site en blog

### 2. **Product Pagina Links** 🛍️
- Automatische detectie van product type (airco/quooker/waterontharder)
- Toont relevante info link onder product
- Mooie gekleurde buttons:
  - Airco = Blauw
  - Quooker = Oranje
  - Waterontharder = Cyaan

### 3. **Contact Pagina Banner** 💬
- "Liever online?"
- Link naar offerte formulier op nieuwe site
- Groene gradient design

### 4. **Sidebar Widget** 📚
- Oranje widget in shop sidebar
- "Advies & Informatie"
- Link naar blog

### 5. **Admin Bar Link** 👨‍💼 (voor jou)
- Snelle link bovenaan (alleen als je ingelogd bent)
- "📱 Info Site" → direct naar nieuwe site

### 6. **Dashboard Melding** 🎉
- Eenmalige melding in WordPress dashboard
- Links naar nieuwe site features

---

## 🚀 Installatie Methode A: Code Snippets Plugin (AANBEVOLEN)

### Stap 1: Install Plugin
1. Log in op WordPress (technischeservice.nl/wp-admin)
2. Ga naar **Plugins** → **Add New**
3. Zoek naar **"Code Snippets"**
4. Klik **Install Now** → **Activate**

### Stap 2: Add Snippet
1. Ga naar **Snippets** → **Add New**
2. Geef een naam: `"Cross-linking naar Info Site"`
3. Plak de code uit `wordpress-cross-linking-snippet.php`
4. Scroll naar beneden
5. Klik **Save Changes and Activate**

### Stap 3: Test
- Bezoek je homepage → zie banner onderaan
- Bezoek een airco product → zie info link
- Bezoek contact pagina → zie offerte banner

---

## 🚀 Installatie Methode B: functions.php (Alternatief)

### Stap 1: Backup Maken
⚠️ **BELANGRIJK**: Maak eerst een backup!

1. Ga naar **Appearance** → **Theme File Editor**
2. Rechts: klik op **functions.php**
3. Kopieer ALLES en bewaar ergens veilig

### Stap 2: Code Toevoegen
1. Scroll naar de **onderkant** van functions.php
2. Plak de code uit `wordpress-cross-linking-snippet.php`
3. Klik **Update File**

### Stap 3: Check Errors
- Als er een error is → herstel de backup
- Alles wit scherm? → FTP in en herstel oude functions.php

---

## ⚙️ Configuratie Opties

### Banner Uitschakelen
Wil je de homepage banner niet? Voeg toe aan je snippet:

```php
// Zet deze regel BOVEN de code:
remove_action('wp_footer', 'tsa_add_homepage_banner');
```

### Andere Contact Pagina Slug
Als je contact pagina niet "contact" heet:

Zoek regel 129:
```php
if (is_page('contact')) {
```

Vervang door jouw slug, bijv:
```php
if (is_page('contacteer-ons')) {
```

### Kleuren Aanpassen
Zoek de regels met `background:` en verander de hex codes:

```php
// Airco: Blauw
'color' => '#3b82f6'  // Verander naar jouw kleur

// Quooker: Oranje  
'color' => '#f97316'  // Verander naar jouw kleur

// Waterontharder: Cyaan
'color' => '#06b6d4'  // Verander naar jouw kleur
```

---

## 🧪 Testen

### Checklist
- [ ] Homepage: Banner onderaan zichtbaar?
- [ ] Airco product: "Meer info over Airco" link?
- [ ] Quooker product: "Meer info over Quooker" link?
- [ ] Waterontharder product: "Meer info over Waterontharder" link?
- [ ] Contact pagina: Offerte banner bovenaan?
- [ ] Shop sidebar: Info widget rechts?
- [ ] Admin bar (ingelogd): "📱 Info Site" link bovenaan?

### Troubleshooting

**Banner niet zichtbaar?**
- Check of je een caching plugin hebt → cache legen
- Check browser console voor JavaScript errors

**Links niet op product pagina's?**
- Check of het WooCommerce product pagina's zijn
- Check of producten in juiste categorie staan (airco/quooker/waterontharder)

**Witte pagina na installatie?**
- Er zit een syntax error in de code
- Herstel functions.php via FTP
- Of: deactiveer snippet in database:
  ```sql
  UPDATE wp_options SET option_value = 'a:0:{}' WHERE option_name = 'active_plugins';
  ```

---

## 🎨 Voorbeeld Posities

```
┌─────────────────────────────────────┐
│  WordPress Header                    │
│  [Admin Bar: 📱 Info Site]          │ ← Alleen voor jou zichtbaar
├─────────────────────────────────────┤
│                                      │
│  Homepage Content                    │
│                                      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 🎉 Nieuwe Informatiewebsite!   [×]  │ ← Banner (homepage)
│ Bezoek onze nieuwe site voor...     │
│ [Naar Info Site] [Blog & Tips]      │
└─────────────────────────────────────┘


Product Pagina:
┌─────────────────────────────────────┐
│  Product afbeelding                  │
│  Titel, prijs, bestellen            │
├─────────────────────────────────────┤
│ ℹ️ Meer Informatie                  │ ← Info link sectie
│ Lees uitgebreide informatie...      │
│ [❄️ Meer info over Airco →]        │
└─────────────────────────────────────┘


Contact Pagina:
┌─────────────────────────────────────┐
│ 💬 Liever Online?                   │ ← Offerte banner
│ Vraag online een offerte aan...     │
│ [📝 Online Offerte Formulier →]    │
├─────────────────────────────────────┤
│  Contact formulier                   │
│  Adresgegevens                       │
└─────────────────────────────────────┘
```

---

## 📊 Analytics

Wil je klikken meten? Voeg Google Analytics events toe:

```php
// In de banner link, voeg toe:
onclick="gtag('event', 'click', {'event_category': 'Cross-Link', 'event_label': 'Homepage Banner'});"

// Voorbeeld:
echo '<a href="https://technischeserviceassen.nl" onclick="gtag(\'event\', \'click\', {\'event_category\': \'Cross-Link\', \'event_label\': \'Homepage Banner\'});">Naar Info Site</a>';
```

---

## 🔄 Updates

### Versie 1.0 (Huidige)
- Homepage banner
- Product pagina links
- Contact pagina banner
- Sidebar widget
- Admin bar link
- Dashboard notificatie

### Toekomstige Ideeën
- [ ] Exit-intent popup
- [ ] Blog feed in WordPress dashboard
- [ ] Recent portfolio items widget
- [ ] WhatsApp widget met link naar nieuwe site

---

## 🆘 Support

Problemen? Vragen?

1. **Check eerst**: Cache geleegd? Browser refresh gedaan?
2. **Errors**: Check WordPress Debug Log
3. **Hulp nodig**: Stuur screenshot van probleem

---

## 📝 Licentie

Vrij te gebruiken en aan te passen voor technischeservice.nl

---

**Gemaakt voor**: Technische Service Assen  
**Datum**: November 2025  
**Versie**: 1.0
