"""
Automatisch hernoemen en verplaatsen van geëxtraheerde keuken front afbeeldingen
"""

import os
import shutil
from pathlib import Path

def rename_and_move_images():
    """
    Hernoem afbeeldingen op basis van de mapping en verplaats ze naar de parent directory
    """
    
    source_dir = "public/assets/keuken-fronten/extracted"
    target_dir = "public/assets/keuken-fronten"
    
    # Handmatige mapping voor bestanden met duidelijke kleurcodes
    rename_map = {
        # Pagina 2 - Prijsgroep 1 (Trend Melamine - Uni kleuren)
        'page2_img1.png': 'K127.png',      # Wit
        'page2_img2.png': 'K090.png',      # Wit Hoogglans
        'page2_img3.png': 'K094.png',      # Stone Grey
        'page2_img4.png': 'K096.png',      # Sahara
        'page2_img5.jpeg': 'K033.jpeg',    # Vanille
        'page2_img6.png': 'K025.png',      # Licht Grijs
        'page2_img7.jpeg': 'K050.jpeg',    # Licht Grijs Hoogglans
        'page2_img8.png': 'K093.png',      # Graphite
        'page2_img9.png': 'K095.png',      # Sand
        'page2_img10.png': 'K105.png',     # Taupe
        'page2_img11.png': 'K092.png',     # Antraciet
        'page2_img12.png': 'K081.png',     # Zwart Hoogglans
        'page2_img13.png': 'K117.png',     # Beige
        'page2_img14.png': 'K021.png',     # Magnolia
        'page2_img15.png': 'K023.png',     # Creme
        'page2_img16.jpeg': 'K080.jpeg',   # Zwart
        'page2_img17.png': 'K054.png',     # Magnolia Hoogglans
        'page2_img18.png': 'K085.png',     # Creme Hoogglans
        'page2_img19.png': 'K097.png',     # Cashmere
        
        # Pagina 3 - Prijsgroep 2 (Decorative - Hout/Beton)
        'page3_img1.jpeg': 'K160.jpeg',    # Halifax Eiken Natuur
        'page3_img2.jpeg': 'K189.jpeg',    # Chicago Beton Licht
        'page3_img3.jpeg': 'K020.jpeg',    # Ribbeck Eiken
        'page3_img4.jpeg': 'K142.jpeg',    # Halifax Eiken Wit
        'page3_img5.jpeg': 'K187.jpeg',    # Chicago Beton Grijs
        'page3_img6.jpeg': 'K186.jpeg',    # Chicago Beton Donker
        'page3_img7.jpeg': 'K175.jpeg',    # Ferro Brons
        'page3_img8.jpeg': 'K131.jpeg',    # Truffel Eiken
        'page3_img9.jpeg': 'K034.jpeg',    # Shannon Eiken
        'page3_img10.jpeg': 'K022.jpeg',   # Beton Licht Grijs
        'page3_img11.jpeg': 'K035.jpeg',   # Bordeaux Eiken
        'page3_img12.jpeg': 'K065.jpeg',   # Beton Grijs
        'page3_img13.jpeg': 'K140.jpeg',   # Gladstone Eiken
        'page3_img14.jpeg': 'K017.jpeg',   # Beton Donker Grijs
        
        # Pagina 4 - Prijsgroep 3 (Sherwood/Fleetwood/Reflex)
        'page4_img1.jpeg': 'K195.jpeg',    # Sherwood Eiken Natuur
        'page4_img2.jpeg': 'K241.jpeg',    # Fleetwood Licht
        'page4_img3.jpeg': 'K190.jpeg',    # Sherwood Halifax Natuur
        'page4_img4.jpeg': 'K250.jpeg',    # Fleetwood Natuur
        'page4_img5.jpeg': 'K191.jpeg',    # Sherwood Halifax Wit
        'page4_img6.jpeg': 'K253.jpeg',    # Fleetwood Grijs
        'page4_img7.jpeg': 'K194.jpeg',    # Sherwood Gladstone Eiken
        'page4_img8.jpeg': 'K256.jpeg',    # Fleetwood Grafiet
        'page4_img9.png': 'K193.png',      # Sherwood Bordeaux Eiken
        'page4_img10.jpeg': 'K254.jpeg',   # Fleetwood Donker
        'page4_img11.jpeg': 'K291.jpeg',   # Reflex Zilver
        'page4_img12.jpeg': 'K273.jpeg',   # Reflex Koper
        'page4_img13.jpeg': 'K292.jpeg',   # Reflex Brons
        'page4_img14.jpeg': 'K248.jpeg',   # Reflex Grafiet
        'page4_img15.jpeg': 'K274.jpeg',   # Reflex Zwart
    }
    
    # Verwerk de mapping
    success_count = 0
    skip_count = 0
    
    print("=" * 70)
    print("  AUTOMATISCH HERNOEMEN EN VERPLAATSEN")
    print("=" * 70)
    print()
    
    for old_name, new_name in rename_map.items():
        source_path = os.path.join(source_dir, old_name)
        target_path = os.path.join(target_dir, new_name)
        
        if os.path.exists(source_path):
            # Kopieer naar target directory met nieuwe naam
            shutil.copy2(source_path, target_path)
            print(f"✓ {old_name:20} → {new_name}")
            success_count += 1
        else:
            print(f"⚠ {old_name:20} → NIET GEVONDEN")
            skip_count += 1
    
    print()
    print("=" * 70)
    print(f"✅ {success_count} afbeeldingen succesvol hernoemd en verplaatst")
    if skip_count > 0:
        print(f"⚠️  {skip_count} bestanden niet gevonden")
    print()
    print(f"📁 Afbeeldingen staan nu in: {target_dir}")
    print()
    print("💡 Volgende stappen:")
    print("   1. Controleer de afbeeldingen in public/assets/keuken-fronten/")
    print("   2. Voor Prijsgroep 4, 5, 6 (pagina 6-7) moeten afbeeldingen handmatig")
    print("      hernoemd worden omdat er geen kleurcodes in de PDF staan")
    print("   3. Update de calculator code om de afbeeldingen te gebruiken")

if __name__ == "__main__":
    rename_and_move_images()
