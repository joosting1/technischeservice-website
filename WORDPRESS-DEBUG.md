# WordPress Cross-Linking Debug Checklist

## ❌ Snippet Werkt Niet? Volg Deze Stappen

### Stap 1: Is de Snippet Geactiveerd?
1. WordPress Dashboard → **Snippets** → **All Snippets**
2. Zoek je snippet (bijv. "Cross-linking Info Site")
3. Kijk naar de toggle switch (schakelaar):
   - **Groen/Blauw** = Actief ✅
   - **Grijs** = Inactief ❌
4. Zo niet actief → Klik op toggle om te activeren

### Stap 2: Cache Legen (BELANGRIJKSTE STAP)

**A. WordPress Cache Plugin**

Heb je een van deze plugins?
- WP Super Cache
- W3 Total Cache  
- WP Rocket
- LiteSpeed Cache
- Autoptimize
- Cache Enabler

**Doe dit:**
1. Zoek plugin in menu (meestal linkerkant)
2. Klik "Clear Cache" / "Purge Cache" / "Empty All Caches"
3. Check alle opties (HTML, CSS, JS)

**B. Browser Cache**
- **Chrome/Edge**: Ctrl+Shift+Delete → Cached images and files → Clear
- **Of**: Ctrl+F5 (hard refresh)
- **Of**: Open incognito venster (Ctrl+Shift+N)

**C. Cloudflare Cache** (als je dit gebruikt)
1. Login Cloudflare.com
2. Selecteer je domein
3. Caching → Purge Everything

### Stap 3: Check Homepage

Open: `https://technischeservice.nl`

**Test in Incognito Mode** (Ctrl+Shift+N)

Scroll naar beneden → Zie je dit?
```
╔════════════════════════════════════════╗
║ 🎉 Nieuwe Informatiewebsite!     [×] ║
║ Bezoek onze nieuwe site...            ║
║ [📱 Naar Info Site] [📝 Blog & Tips] ║
╚════════════════════════════════════════╝
```

**Als JA** ✅ → Het werkt! Cache was het probleem
**Als NEE** ❌ → Ga naar Stap 4

### Stap 4: Check of WooCommerce Actief Is

1. Plugins → Installed Plugins
2. Zoek "WooCommerce"
3. Staat er **Activate** of **Deactivate**?
4. Zo "Activate" → WooCommerce is UIT (probleem!)

**Waarom belangrijk?**
De product links gebruiken WooCommerce functies. Zonder WooCommerce = geen product links.

### Stap 5: Check JavaScript Errors

**Open Browser Console:**
- Chrome/Edge: F12 → tab "Console"
- Firefox: F12 → tab "Console"

**Zie je rode errors?**
Screenshot maken en doorsturen.

**Veel voorkomende errors:**
- `jQuery is not defined` → jQuery niet geladen
- `Uncaught ReferenceError` → Script conflict

### Stap 6: Test Per Feature

**Feature 1: Homepage Banner**
- URL: `https://technischeservice.nl`
- Verwacht: Banner onderaan
- Als niet zichtbaar → Check `is_front_page()` probleem

**Feature 2: Product Link**
- URL: `https://technischeservice.nl/product/[EEN-AIRCO]`
- Scroll naar beneden (onder product beschrijving)
- Verwacht: "ℹ️ Meer Informatie" box

**Feature 3: Contact Banner**
- URL: `https://technischeservice.nl/contact/`
- Verwacht: Groene banner bovenaan content
- Als niet zichtbaar → Check pagina slug

**Feature 4: Admin Bar Link**
- Ingelogd zijn als admin
- Kijk bovenaan scherm
- Verwacht: "📱 Info Site" in admin bar

### Stap 7: Check Code Snippets Settings

1. Snippets → Settings
2. Check deze instellingen:
   - ✅ "Run snippets on site front-end" = AAN
   - ✅ "Load snippets in <head>" = UIT (of AAN, maakt niet uit)

### Stap 8: Theme Compatibility

Sommige themes blokken `wp_footer()` of custom HTML.

**Test:**
1. Appearance → Themes
2. Activeer een standaard theme (bijv. Twenty Twenty-Four)
3. Refresh homepage
4. Banner zichtbaar nu? → Theme probleem

### Stap 9: Plugin Conflict Test

**Deactiveer tijdelijk alle plugins BEHALVE:**
- Code Snippets
- WooCommerce

**Stappen:**
1. Plugins → Installed Plugins
2. Bulk select → Deactivate (behalve Code Snippets & WooCommerce)
3. Refresh homepage → Banner zichtbaar?
4. **JA** → Een plugin blokkeert het. Activeer 1-voor-1 om boosdoener te vinden
5. **NEE** → Probleem zit in code of setup

### Stap 10: Check Homepage Type

Banner werkt alleen op echte homepage.

**Test welke pagina je homepage is:**
1. Settings → Reading
2. "Your homepage displays":
   - **Your latest posts** → Gebruik `is_home()` ipv `is_front_page()`
   - **A static page** → `is_front_page()` is correct

**Fix als "latest posts":**

In je snippet, verander regel 26:
```php
// WAS:
if (!is_front_page()) return;

// WORDT:
if (!is_home() && !is_front_page()) return;
```

### Stap 11: Check Error Log

**Zie PHP errors:**
1. Hosting control panel (cPanel/Plesk)
2. Error Log of Error Logs
3. Zoek naar recent errors met "tsa_" in de naam

**Of via WordPress:**

Voeg toe aan `wp-config.php` (bovenaan):
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Errors staan dan in: `/wp-content/debug.log`

### Stap 12: Test met Direct PHP

**Snelle test of PHP überhaupt werkt:**

1. Code Snippets → Add New
2. Plak dit:
```php
add_action('wp_footer', function() {
    echo '<div style="position:fixed;bottom:0;left:0;right:0;background:red;color:white;padding:20px;z-index:99999;text-align:center;">TEST BANNER - Als je dit ziet werkt Code Snippets!</div>';
});
```
3. Save & Activate
4. Refresh homepage
5. Zie je rode banner? 
   - **JA** → Code Snippets werkt, originele code heeft een bug
   - **NEE** → Code Snippets runt niet, probleem in setup

---

## 🆘 Meest Voorkomende Oplossingen

### Oplossing 1: Cache (95% van problemen)
```
WP Super Cache → Delete Cache
Browser → Ctrl+Shift+Delete
Test in Incognito Mode (Ctrl+Shift+N)
```

### Oplossing 2: Snippet Niet Geactiveerd
```
Snippets → All Snippets → Toggle AAN (groen/blauw)
```

### Oplossing 3: Homepage Type
```
Settings → Reading → Check welke homepage type
Pas code aan (zie Stap 10)
```

### Oplossing 4: Theme Blokkeert
```
Switch naar Twenty Twenty-Four theme tijdelijk
Test → Als het werkt = theme probleem
```

### Oplossing 5: Plugin Conflict
```
Deactiveer alle plugins behalve Code Snippets
Test → Activeer 1-voor-1 om conflict te vinden
```

---

## 📸 Screenshot Requests

Stuur screenshots van:
1. **Snippets pagina** → Zie ik of snippet actief is
2. **Homepage** → Zie ik HTML source (rechtsklik → View Source)
3. **Browser Console** (F12) → Zie ik JavaScript errors
4. **Settings → Reading** → Zie ik homepage setup

---

## 🔧 Advanced Debug Code

Voeg deze debug snippet toe (tijdelijk):

```php
add_action('wp_footer', function() {
    echo '<!-- TSA DEBUG: wp_footer triggered -->';
    echo '<!-- Is Front Page: ' . (is_front_page() ? 'YES' : 'NO') . ' -->';
    echo '<!-- Is Home: ' . (is_home() ? 'YES' : 'NO') . ' -->';
});
```

Bekijk HTML source (rechtsklik → View Source) → Zoek naar "TSA DEBUG"

Dit vertelt:
- Of `wp_footer` überhaupt werkt
- Of homepage detectie klopt

---

## ✅ Werkt Het Nu?

**Als JA** → Super! Wat was de oplossing?
**Als NEE** → Stuur screenshots van bovenstaande checks

---

**Meest waarschijnlijke oorzaak**: Cache niet geleegd
**Tweede meest waarschijnlijk**: Snippet staat uit
**Derde**: Homepage type verkeerd gedetecteerd
