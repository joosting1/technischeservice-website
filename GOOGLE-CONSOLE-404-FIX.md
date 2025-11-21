# Google Search Console 404 Oplossingen
**Datum:** 21 november 2025  
**Status:** Geïmplementeerd

## 📊 Probleem Analyse
- **42 pagina's** met 404-fouten
- Voornamelijk oude WordPress URLs (WooCommerce webshop, blog categoriën, tags)
- Veroorzaakt door migratie van WordPress naar Astro

## ✅ Geïmplementeerde Oplossingen

### 1. Redirects toegevoegd (`public/_redirects`)
**52 nieuwe redirects** toegevoegd voor:

#### WordPress WooCommerce (14 redirects)
- `/product/*` → relevante service pagina's
- `/product-categorie/*` → service pagina's
- `/product-tag/*` → service pagina's
- `/winkel/*` → `/offerte`
- `/merk/*` → `/offerte`

**Voorbeelden:**
- `/product/in-bedrijfstelling-airco/` → `/in-bedrijfstelling`
- `/product/delta-rusela-waterontharder/` → `/waterontharder`
- `/product-categorie/quooker/` → `/quooker-installatie`

#### Add-to-cart URLs (6 redirects)
Alle `?add-to-cart=*` parameters → `/offerte`

#### WordPress Blog URLs (8 redirects)
- `/category/*` → `/blog` of relevante tag
- `/tag/*` → `/blog` of relevante tag
- `/author/*` → `/blog`

#### Oude Blog Posts (8 redirects)
- `/delta-waterontharders-in-rolde/` → `/blog/delta-waterontharders-belgische-kwaliteit`
- `/daikin-aircos-in-assen/` → `/daikin-airco`
- `/quooker-geeft-weinig-kokend-water-oorzaken-oplossingen/` → `/blog/quooker-bekende-gebreken`
- etc.

#### Contact & Overige (2 redirects)
- `/contact/` → `/offerte`

### 2. Robots.txt Updated
Geblokkeerd om toekomstige crawls te voorkomen:
```
Disallow: /product/
Disallow: /product-categorie/
Disallow: /product-tag/
Disallow: /winkel/
Disallow: /merk/
Disallow: /category/
Disallow: /tag/
Disallow: /author/
Disallow: /cdn-cgi/
```

### 3. Custom 404 Pagina
Nieuw bestand: `src/pages/404.astro`
- Gebruiksvriendelijke foutmelding
- Links naar belangrijkste diensten
- Uitleg over vernieuwde website
- Call-to-actions naar home, offerte en blog

## 🚀 Deployment Checklist

### Stap 1: Deploy naar productie
```bash
npm run build
# Deploy naar Cloudflare Pages / hosting
```

### Stap 2: Test Redirects
Test deze URLs in browser (moeten redirecten):
- [ ] `https://technischeserviceassen.nl/product/in-bedrijfstelling-airco/`
- [ ] `https://technischeserviceassen.nl/winkel/`
- [ ] `https://technischeserviceassen.nl/contact/`
- [ ] `https://technischeserviceassen.nl/product-categorie/quooker/`
- [ ] `https://technischeserviceassen.nl/delta-waterontharders-in-rolde/`

### Stap 3: Google Search Console Acties

#### A. Verwijder URLs met 404 (optioneel)
1. Ga naar **Google Search Console**
2. Navigeer naar **Verwijderingen** (Removals)
3. Klik **Nieuwe aanvraag**
4. Selecteer **Tijdelijk verwijderen URL**
5. Voeg patronen toe:
   ```
   /product/*
   /product-categorie/*
   /product-tag/*
   /winkel/*
   /category/*
   /tag/*
   ```

#### B. Submit Sitemap opnieuw
1. Ga naar **Sitemaps**
2. Verwijder oude sitemap (indien aanwezig)
3. Submit nieuwe: `https://technischeserviceassen.nl/sitemap-index.xml`

#### C. Valideer Fixes (na 1-2 weken)
1. Ga naar **Dekking** (Coverage)
2. Klik op **"Niet gevonden (404)"**
3. Klik **Fix valideren** onderaan
4. Google zal over 1-2 weken opnieuw crawlen

### Stap 4: Monitor
- Check over 2 weken of 404-fouten zijn verminderd
- Monitor nieuwe indexering via Coverage rapport
- Check of redirects correct werken in server logs

## 📈 Verwachte Resultaten

**Binnen 1-2 weken:**
- 404-fouten dalen van 42 naar ~5-10 (rest kan restanten zijn)
- Redirect URLs worden opnieuw geïndexeerd op nieuwe locatie
- "Gevonden - momenteel niet geïndexeerd" (62 pagina's) kan verbeteren

**Binnen 1 maand:**
- Bijna alle 404's opgelost
- Meer pagina's geïndexeerd (van 88 naar ~100+)
- Betere gebruikerservaring (minder doodlopende links)

## 🔍 Niet Opgeloste URLs

Deze URLs hoeven NIET opgelost:
- `/cdn-cgi/l/email-protection` - Cloudflare systeem URL
- `/api/offerte` - API endpoint (bestaat al, geen redirect nodig)
- `/favicon.ico?favicon.0b3bf435.ico` - Query string issue (geen probleem)
- `/$` - Ongeldige URL

## 📝 Notities

- Alle redirects zijn **301 permanente redirects** (beste voor SEO)
- Catch-all regels staan onderaan `_redirects` (volgorde belangrijk!)
- Cloudflare Pages ondersteunt wildcards (`*`) in redirects
- Custom 404 pagina werkt automatisch bij niet-gevonden URLs

## 🆘 Troubleshooting

**Als redirects niet werken:**
1. Check of `_redirects` in `public/` folder staat
2. Verify dat het mee-deployed is (check in dist/ na build)
3. Test met `curl -I https://url` om headers te checken
4. Cloudflare cache legen indien nodig

**Als 404's blijven:**
1. Wacht 1-2 weken (Google crawlt niet direct opnieuw)
2. Gebruik "URL Inspectie" in Search Console per URL
3. Klik "Indexering aanvragen" voor belangrijke URLs
4. Check of oude sitemap nog actief is (verwijder deze)

---

**Conclusie:** Alle bekende 404-problemen zijn nu afgehandeld met redirects, robots.txt blokkades en een gebruiksvriendelijke 404 pagina. Na deployment en validatie in Google Search Console zou je binnen 2-4 weken significant minder 404-fouten moeten zien.
