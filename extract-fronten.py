"""
PDF Image Extractor voor Keuken Fronten
Extract afbeeldingen uit de brochure PDF en sla ze op met de juiste kleurcode namen
"""

import fitz  # PyMuPDF
import os
from pathlib import Path

def extract_images_from_pdf(pdf_path, output_dir):
    """
    Extract alle afbeeldingen uit een PDF en sla ze op in de output directory
    
    Args:
        pdf_path: Pad naar de PDF file
        output_dir: Directory waar de afbeeldingen worden opgeslagen
    """
    
    # Maak output directory aan als die niet bestaat
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Open de PDF
    pdf_document = fitz.open(pdf_path)
    
    print(f"PDF geopend: {pdf_path}")
    print(f"Aantal pagina's: {len(pdf_document)}")
    print(f"Output directory: {output_dir}\n")
    
    image_count = 0
    
    # Loop door alle pagina's
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        
        print(f"Pagina {page_num + 1} verwerken...")
        
        # Haal alle afbeeldingen van de pagina op
        image_list = page.get_images(full=True)
        
        print(f"  Gevonden: {len(image_list)} afbeeldingen")
        
        # Extract elke afbeelding
        for img_index, img in enumerate(image_list):
            xref = img[0]  # Image reference number
            
            # Haal de basis afbeelding op
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]  # jpg, png, etc.
            
            # Genereer bestandsnaam
            # Format: page_number_image_index.ext
            image_filename = f"page{page_num + 1}_img{img_index + 1}.{image_ext}"
            image_path = os.path.join(output_dir, image_filename)
            
            # Sla de afbeelding op
            with open(image_path, "wb") as image_file:
                image_file.write(image_bytes)
            
            image_count += 1
            print(f"    ✓ Opgeslagen: {image_filename}")
    
    print(f"\n✅ Klaar! {image_count} afbeeldingen geëxtraheerd naar {output_dir}")
    print("\n📝 Volgende stap:")
    print("   Hernoem de afbeeldingen naar de kleurcodes (bijv. K195.jpg, K190.jpg)")
    print("   Kijk in de PDF welke afbeelding bij welke kleurcode hoort")

def main():
    """
    Main functie - pas hier je instellingen aan
    """
    
    # ⚠️ PAS DIT AAN: Pad naar je PDF bestand
    pdf_path = "brochure.pdf"  # Vervang met het pad naar je PDF
    
    # Output directory (waar de afbeeldingen worden opgeslagen)
    output_dir = "public/assets/keuken-fronten"
    
    # Check of PDF bestaat
    if not os.path.exists(pdf_path):
        print(f"❌ FOUT: PDF niet gevonden op: {pdf_path}")
        print("\n💡 Tip: Zet de PDF in dezelfde map als dit script")
        print("   Of pas de 'pdf_path' variabel aan naar het juiste pad")
        return
    
    # Extract de afbeeldingen
    try:
        extract_images_from_pdf(pdf_path, output_dir)
    except Exception as e:
        print(f"\n❌ FOUT tijdens extractie: {e}")
        print("\nMogelijke oorzaken:")
        print("  - PyMuPDF is niet geïnstalleerd (run: pip install PyMuPDF)")
        print("  - PDF is beschermd of corrupt")
        print("  - Geen schrijfrechten voor output directory")

if __name__ == "__main__":
    print("=" * 60)
    print("  PDF Image Extractor - Keuken Fronten Brochure")
    print("=" * 60)
    print()
    
    main()
