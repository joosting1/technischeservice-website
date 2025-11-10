# WordPress + Elementor Installatie Guide

## ⚠️ Belangrijke Notitie: Elementor

Elementor blokkeert vaak standaard WordPress hooks. Daarom hebben we een **speciale Elementor-compatible versie** gemaakt.

---

## 📋 Installatie Stappen

### Stap 1: Verwijder Oude Snippet (Als geïnstalleerd)

Als je de oude `wordpress-cross-linking-snippet.php` hebt geïnstalleerd:

1. WordPress Dashboard → **Snippets** → **All Snippets**
2. Zoek de oude snippet
3. Klik **Delete** of **Deactivate**

---

### Stap 2: Installeer Elementor-Compatible Versie

1. **Open het bestand:** `wordpress-elementor-cross-linking.php`
2. **Kopieer ALLE code** (Ctrl+A, Ctrl+C)
3. **WordPress Dashboard** → **Snippets** → **Add New**
4. **Plak de code** in het grote tekstveld
5. **Titel:** "TSA Info Site Links (Elementor)"
6. **Run snippet everywhere** (belangrijk!)
7. Klik **Save Changes and Activate** 🟢

---

### Stap 3: Clear Cache (CRUCIAAL!)

#### A. WordPress Cache Plugin
- **WP Rocket:** Dashboard → WP Rocket → Clear Cache
- **W3 Total Cache:** Performance → Purge All Caches
- **WP Super Cache:** Settings → WP Super Cache → Delete Cache
- **LiteSpeed:** LiteSpeed Cache → Purge All

#### B. Elementor Cache
1. **Elementor** → **Tools** → **Regenerate CSS & Data**
2. Klik **Regenerate Files** knop
3. Wacht tot "Successfully regenerated!" verschijnt

#### C. Browser Cache
- **Ctrl + Shift + N** (Incognito venster)
- Of: **Ctrl + F5** (hard refresh)

---

### Stap 4: Test Het Resultaat

Open in **Incognito venster** (Ctrl+Shift+N):

#### ✅ Homepage Test
```
https://technischeservice.nl
```
**Verwacht:** Blauwe banner onderaan met:
- 🎉 "Nieuwe Informatiewebsite!"
- Link naar technischeserviceassen.nl
- × sluitknop rechtsboven

#### ✅ Product Pagina Test
```
https://technischeservice.nl/product/[AIRCO-PRODUCT]
```
**Verwacht:** Blauwe info box onder product met:
- "❄️ Meer info over Airco Installatie"

#### ✅ Contact Pagina Test
```
https://technischeservice.nl/contact
```
**Verwacht:** Groene banner met:
- "💬 Liever Online?"
- Link naar offerte formulier

---

## 🔍 Verschillen met Normale Versie

### Wat is aangepast voor Elementor:

1. **Hogere z-index:** `999999` i.p.v. `9999` (Elementor gebruikt hoge z-indexes)
2. **!important CSS:** Voorkomt dat Elementor styles overschrijven
3. **JavaScript fallback:** Extra code voor als Elementor hooks blokkeert
4. **Andere hooks:** Gebruikt `woocommerce_after_single_product` i.p.v. `_summary`
5. **is_home() check:** Extra homepage detectie voor Elementor themes
6. **Clear: both:** Voorkomt Elementor float problemen

---

## 🎨 Bonus: Elementor Widget (Optioneel)

De snippet bevat ook een **Elementor widget** die je handmatig kan toevoegen:

### Hoe te gebruiken:

1. **Bewerk een pagina** met Elementor
2. **Zoek widget:** "TSA Info Banner" in de widget lijst (links)
3. **Sleep het** naar je pagina
4. Widget toont automatisch oranje blog banner

**Gebruik dit voor:**
- Sidebar in webshop
- Extra CTA op specifieke pagina's
- Footer widgets

---

## 🐛 Troubleshooting

### ❌ "Zie nog steeds niets"

1. **Check Elementor Regenerate:**
   - Elementor → Tools → Regenerate CSS
   - Dit is DE meest voorkomende oplossing

2. **Check Snippet Status:**
   ```
   Snippets → All Snippets
   → Zoek "TSA Info Site Links (Elementor)"
   → Moet 🟢 GROEN zijn (Active)
   ```

3. **Check Homepage Type:**
   - Settings → Reading
   - "Your homepage displays:"
   - Als het "Your latest posts" is → Gebruikt `is_home()`
   - Als het een "Static page" is → Gebruikt `is_front_page()`
   - Onze snippet ondersteunt BEIDE! ✅

4. **Browser Console Check:**
   - **F12** op homepage
   - **Console** tab
   - Zoek: `"TSA Banner: Succesvol geladen"`
   - Zie je dit? → Banner werkt, maar is verstopt (CSS probleem)
   - Zie je dit NIET? → Snippet draait niet (activatie probleem)

5. **Check HTML Source:**
   - **Rechtsklik** op homepage → **View Page Source**
   - **Ctrl+F** zoek: `"TSA Banner Debug"`
   - Zie je: `<!-- TSA Banner Debug: Elementor ACTIEF -->`?
   - Ja? → Banner HTML is aanwezig, CSS probleem
   - Nee? → Snippet draait niet

---

## 🚨 Elementor Caching Probleem

Elementor cacht AGRESSIEF. Als je NIETS ziet na installatie:

### Nuclear Option (100% werkt):

1. **Deactiveer Elementor:**
   - Plugins → Elementor → Deactivate
   
2. **Clear All Caches:**
   - Alle cache plugins purgen
   - Browser cache clearen (Ctrl+Shift+Del)
   
3. **Reactiveer Elementor:**
   - Plugins → Elementor → Activate
   
4. **Regenerate:**
   - Elementor → Tools → Regenerate CSS
   
5. **Test in Incognito:**
   - Ctrl+Shift+N
   - Bezoek homepage

**Dit werkt in 99% van de gevallen!**

---

## 📞 Nog Steeds Problemen?

### Test Snippet (Ultra Simpel):

Maak een **nieuwe snippet** met deze code:

```php
add_action('wp_footer', 'test_banner', 999);
function test_banner() {
    echo '<div style="position:fixed;bottom:0;left:0;right:0;background:red;color:white;padding:20px;text-align:center;z-index:999999;font-size:24px;font-weight:bold;">TEST BANNER - Als je dit ziet werkt Code Snippets! ✅</div>';
}
```

**Zie je een RODE banner?**
- ✅ JA: Code Snippets werkt! → Elementor versie heeft bug, stuur screenshot
- ❌ NEE: Code Snippets werkt niet → Kijk naar plugin conflicten

---

## 📧 Support

Als het nog steeds niet werkt na:
- ✅ Elementor versie geïnstalleerd
- ✅ Cache gecleared (WordPress + Elementor + Browser)
- ✅ Incognito getest
- ✅ Rode test banner werkt WEL

Dan is er waarschijnlijk een **Elementor Pro** feature of **security plugin** die het blokkeert.

Stuur dan:
1. Screenshot van `Snippets → All Snippets` pagina
2. Screenshot van homepage source code (Ctrl+U, zoek "TSA Banner")
3. Lijst van actieve plugins
4. Elementor versie (free or Pro?)

---

## ✅ Verwachte Resultaat

### Homepage:
```
═══════════════════════════════════════════
            WEBSHOP CONTENT
───────────────────────────────────────────
         [Product afbeeldingen]
═══════════════════════════════════════════

┌─────────────────────────────────────────┐
│  ×                                      │
│  🎉 Nieuwe Informatiewebsite!          │
│  Bezoek onze nieuwe site voor          │
│  uitgebreide productinformatie          │
│                                         │
│  [📱 Naar Info Site] [📝 Blog & Tips]  │
└─────────────────────────────────────────┘
         (Blauwe gradient banner)
```

### Product Pagina:
```
═══════════════════════════════════════════
      [Product foto's & beschrijving]
───────────────────────────────────────────

┌─────────────────────────────────────────┐
│    ℹ️ Meer Informatie                  │
│    Lees uitgebreide informatie, tips   │
│    en ervaringen op onze info website  │
│                                         │
│  [❄️ Meer info over Airco Installatie]│
└─────────────────────────────────────────┘
      (Grijze gradient info box)
```

---

## 🎯 Checklist

Vink af als je het hebt gedaan:

- [ ] Oude snippet verwijderd/gedeactiveerd
- [ ] Elementor versie geïnstalleerd via Code Snippets
- [ ] Snippet status is 🟢 GROEN (Active)
- [ ] Elementor CSS geregenerated (Tools → Regenerate)
- [ ] WordPress cache gecleared
- [ ] Browser cache gecleared (Incognito test)
- [ ] Homepage banner zichtbaar? ✅
- [ ] Product link zichtbaar op airco product? ✅
- [ ] Contact banner zichtbaar? ✅

Als ALLES aangevinkt: **GEFELICITEERD! 🎉**

Je hebt nu een **werkende cross-linking** tussen je webshop en info site!
