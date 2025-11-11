# PDF Image Extractor voor Keuken Fronten

Deze scripts extracten afbeeldingen uit de keuken brochure PDF.

## 🚀 Snelle Start

### Stap 1: Installeer PyMuPDF
```bash
pip install PyMuPDF
```

### Stap 2: Plaats de PDF
Zet je brochure PDF in de root van het project en noem het `brochure.pdf`

Of pas het pad aan in het script:
```python
pdf_path = "pad/naar/jouw/brochure.pdf"
```

### Stap 3: Run het script

**Basis versie** (extract alle afbeeldingen):
```bash
python extract-fronten.py
```

**Geavanceerde versie** (met automatische kleurcode detectie):
```bash
python extract-fronten-advanced.py
```

## 📁 Output

Afbeeldingen worden opgeslagen in:
```
public/assets/keuken-fronten/
```

De geavanceerde versie maakt ook een `rename_mapping.txt` bestand met suggesties voor het hernoemen.

## ✏️ Na Extractie

1. **Controleer de afbeeldingen** in `public/assets/keuken-fronten/`
2. **Hernoem ze** naar de kleurcodes uit de brochure:
   - K195.jpg (Sherwood wit)
   - K190.jpg (Sherwood magnolia)
   - K191.jpg (Sherwood lava)
   - etc.
3. **Verwijder** afbeeldingen die geen keuken fronten zijn (logo's, tekst, etc.)

## 📋 Verwachte Kleurcodes

Gebaseerd op de calculator data:

### Prijsgroep 1 (Trend Melamine)
K127, K025, K092, K080, K094, K093, K117, K097, K096, K095, K021, K098, K033, K105, K023, K090, K050, K081, K054, K085

### Prijsgroep 2 (Decorative)
K160, K142, K034, K035, K140, K020, K131, K022, K065, K017, K189, K187, K186, K175

### Prijsgroep 3 (Sherwood/Fleetwood/Reflex)
K195, K190, K191, K194, K193, K241, K250, K253, K256, K254, K291, K292, K248, K274, K273

### Prijsgroep 4 (Perfect Sense/Gerona)
PS110, PS100, PS120, PS130, PS170, PS150, PS140, PS160, HGL090, HGL025, HGL070, HGL080, HGL071, HGL069, HGL105, HGL023

### Prijsgroep 5 (MDF Folie)
F341, F205, F222, F208, F210, F335, F040, F325, F345, F365, F375, F385, F305, F2.0, F427

### Prijsgroep 6 (Lak)
145, 751, 280, 270, 752, 950, 602, 603, 781, 815, 165, 204, 205, 730, 430

## 🔧 Handmatige Extractie (Alternatief)

Als het script niet werkt, kun je ook handmatig:

1. Open de PDF in Adobe Reader / Preview / etc.
2. Screenshot elke front afbeelding
3. Crop de afbeelding zodat alleen het front zichtbaar is
4. Sla op als `K195.jpg`, `K190.jpg`, etc.
5. Plaats in `public/assets/keuken-fronten/`

Aanbevolen afmetingen: 200x300px (portret formaat)

## ❓ Problemen?

### PyMuPDF installeert niet
Probeer:
```bash
pip install --upgrade pip
pip install PyMuPDF
```

### PDF is beschermd
Som PDF's hebben beveiliging. In dat geval moet je handmatig screenshots maken.

### Geen Python?
Download Python van: https://www.python.org/downloads/

## 📞 Contact

Als je hulp nodig hebt, stuur dan een bericht!
