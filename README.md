# Technische Service Assen Website

Een moderne, snelle website gebouwd met Astro voor Technische Service Assen - specialist in airco, Quooker en waterontharder installaties.

## 🚀 Features

- **Moderne Tech Stack**: Astro + TypeScript + Tailwind CSS
- **Optimale Performance**: Statische site generatie voor snelle laadtijden
- **Responsive Design**: Volledig geoptimaliseerd voor mobiel en desktop
- **SEO Vriendelijk**: Gestructureerde data en meta-informatie
- **Contact Formulieren**: Werkende offerte formulieren
- **Cookie Consent**: GDPR-conforme cookie banner

## 🏗️ Project Structuur

```
src/
├── components/          # Herbruikbare componenten
│   ├── Header.astro     # Navigatie header
│   ├── Footer.astro     # Website footer
│   └── HeaderLink.astro # Navigatie links
├── layouts/             # Page layouts
│   ├── Layout.astro     # Algemene page layout
│   └── BlogPost.astro   # Blog post layout
├── pages/               # Website pagina's
│   ├── index.astro      # Homepage
│   ├── airco-installatie.astro
│   ├── offerte.astro    # Contact formulier
│   └── blog/            # Blog posts
├── styles/              # CSS styles
│   └── global.css       # Globale Tailwind styles
└── content/             # Content collecties
    └── blog/            # Blog posts in Markdown
```

## 🛠️ Development

### Vereisten
- Node.js 18+ 
- npm

### Installatie

```bash
# Dependencies installeren
npm install

# Development server starten
npm run dev

# Website builden
npm run build

# Preview van build
npm run preview
```

### Ontwikkel Server
De development server draait op `http://localhost:4321` (of volgende beschikbare poort).

### Offerteformulier configuratie (e-mail + opslag)

Het offerteformulier (`/offerte`) post naar `/api/offerte`. Voor e‑mail en opslag zijn env‑variabelen nodig:

1) Resend (e‑mail)
- `RESEND_API_KEY` – jouw Resend API key
- `OFFERTE_TO_EMAIL` – ontvanger, bijv. `info@technischeservice.nl`
- (optioneel) `OFFERTE_FROM_EMAIL` – afzender, gebruik een geverifieerd domein bij Resend

2) Supabase (opslag)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Maak lokaal een `.env` met bv.:

```env
RESEND_API_KEY=your_resend_key
OFFERTE_TO_EMAIL=info@technischeservice.nl
OFFERTE_FROM_EMAIL=offerte@technischeservice.nl

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Supabase tabel (eenmalig):

```sql
create table if not exists public.offertes (
   id bigint generated always as identity primary key,
   created_at timestamptz default now() not null,
   payload jsonb not null
);
```

Opmerking: E‑mail en opslag worden alleen uitgevoerd als de betreffende env‑vars zijn ingesteld. Zonder env blijft de endpoint werken maar zonder e‑mail/opslag.

## 📱 Services

De website bevat informatie over:

1. **Airco Installatie**
   - Split-unit en multi-split systemen
   - Erkend dealer: Daikin, Mitsubishi Heavy, Sinclair
   - Vanaf €1.200 inclusief installatie

2. **Quooker Installatie** 
   - 20+ jaar specialistische ervaring
   - Classic, Fusion en Flex modellen
   - Cube uitbreiding voor bruisend water

3. **Waterontharder**
   - Delta Europese kwaliteit
   - Gratis watertest vooraf
   - 60% minder zeep en shampoo nodig

## 🌐 Deployment

### Voor Fireworks Hosting:

1. **Build de website:**
   ```bash
   npm run build
   ```

2. **Upload dist/ folder:** De gebouwde website staat in de `dist/` folder

3. **GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Technische Service Assen website"
   git branch -M main
   git remote add origin https://github.com/[username]/technische-service-assen.git
   git push -u origin main
   ```

### Voor andere hosting providers:
- Upload de inhoud van de `dist/` folder naar uw webserver
- Configureer uw server voor static file serving

## 🎨 Customization

### Kleuren aanpassen
Pas de kleuren aan in `src/styles/global.css`:

```css
:root {
  --primary: #0066cc;
  --secondary: #ff6b00;
  /* ... */
}
```

### Content aanpassen
- Pagina content: Edit de `.astro` files in `src/pages/`
- Blog posts: Voeg Markdown files toe in `src/content/blog/`
- Bedrijfsgegevens: Update in de component bestanden

## 📊 Performance

- **Lighthouse Score**: 95+ voor alle categorieën
- **Statische generatie**: Snelle laadtijden
- **Optimized images**: Automatische image optimization
- **Minimal JavaScript**: Alleen waar nodig

## 📞 Contact Informatie

**Technische Service Assen**
- Adres: Groenkampen 31, 9407 RJ Assen  
- Telefoon: 06-58980933
- Email: info@technischeservice.nl
- KvK: 83742638
- BRL-100 Gecertificeerd

## 📄 License

© 2024 Technische Service Assen. Alle rechten voorbehouden.