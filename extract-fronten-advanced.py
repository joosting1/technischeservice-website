"""
Geavanceerde PDF Image Extractor met OCR voor automatische kleurcode detectie
"""

import fitz  # PyMuPDF
import os
from pathlib import Path
import re

def extract_images_with_context(pdf_path, output_dir):
    """
    Extract afbeeldingen en probeer de kleurcodes te detecteren uit de tekst eromheen
    """
    
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    pdf_document = fitz.open(pdf_path)
    
    print(f"PDF geopend: {pdf_path}")
    print(f"Aantal pagina's: {len(pdf_document)}\n")
    
    # Mapping voor herbenoeming
    rename_mapping = []
    
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        print(f"Pagina {page_num + 1} verwerken...")
        
        # Haal alle tekst op van de pagina
        text = page.get_text()
        
        # Zoek naar kleurcodes (K gevolgd door cijfers)
        color_codes = re.findall(r'K\d{3,4}', text)
        print(f"  Gevonden kleurcodes: {color_codes}")
        
        # Haal afbeeldingen op
        image_list = page.get_images(full=True)
        print(f"  Gevonden afbeeldingen: {len(image_list)}")
        
        # Extract afbeeldingen
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Eerste bestandsnaam (tijdelijk)
            temp_filename = f"page{page_num + 1}_img{img_index + 1}.{image_ext}"
            image_path = os.path.join(output_dir, temp_filename)
            
            # Sla op
            with open(image_path, "wb") as image_file:
                image_file.write(image_bytes)
            
            # Probeer kleurcode toe te wijzen
            suggested_code = None
            if img_index < len(color_codes):
                suggested_code = color_codes[img_index]
            
            rename_mapping.append({
                'current': temp_filename,
                'suggested': f"{suggested_code}.{image_ext}" if suggested_code else None,
                'codes_on_page': color_codes
            })
            
            print(f"    ✓ {temp_filename}" + (f" → Suggestie: {suggested_code}.{image_ext}" if suggested_code else ""))
        
        print()
    
    # Schrijf mapping naar bestand
    mapping_file = os.path.join(output_dir, "rename_mapping.txt")
    with open(mapping_file, "w", encoding="utf-8") as f:
        f.write("RENAME MAPPING - Controleer deze suggesties!\n")
        f.write("=" * 60 + "\n\n")
        
        for item in rename_mapping:
            f.write(f"Huidig: {item['current']}\n")
            if item['suggested']:
                f.write(f"Suggestie: {item['suggested']}\n")
            f.write(f"Codes op pagina: {', '.join(item['codes_on_page'])}\n")
            f.write("-" * 60 + "\n")
    
    print(f"✅ {len(rename_mapping)} afbeeldingen geëxtraheerd")
    print(f"📝 Rename suggesties opgeslagen in: {mapping_file}")
    print("\n💡 Volgende stappen:")
    print("   1. Controleer de afbeeldingen in de output folder")
    print("   2. Bekijk rename_mapping.txt voor suggesties")
    print("   3. Hernoem de bestanden handmatig naar de juiste kleurcodes")
    print("   4. Verwijder bestanden die geen keuken fronten zijn")

def main():
    pdf_path = "brochure.pdf"
    output_dir = "public/assets/keuken-fronten/extracted"
    
    if not os.path.exists(pdf_path):
        print(f"❌ PDF niet gevonden: {pdf_path}")
        print("\n💡 Opties:")
        print("   1. Zet brochure.pdf in de root van het project")
        print("   2. Of pas de pdf_path variabel aan in het script")
        return
    
    try:
        extract_images_with_context(pdf_path, output_dir)
    except Exception as e:
        print(f"\n❌ FOUT: {e}")
        print("\n📦 Installeer eerst PyMuPDF:")
        print("   pip install PyMuPDF")

if __name__ == "__main__":
    print("=" * 70)
    print("  GEAVANCEERDE PDF IMAGE EXTRACTOR")
    print("  Met automatische kleurcode detectie")
    print("=" * 70)
    print()
    main()
