import os
import shutil

# Directories
source_dir = "public/assets/keuken-fronten/extracted"
target_dir = "public/assets/keuken-fronten"

# CORRECTE MAPPING volgens PDF volgorde en OCR analyse
# Pagina 2 heeft 19 afbeeldingen, codes in volgorde: 
# K127, K090, K094, K096, K033, K025, K050, K093, K095, K105, K092, K081, K117, K021, K023, K080, K054, K085, K097, K098

rename_map_correct = {
    # Prijsgroep 1 - Pagina 2 (19 afbeeldingen in de juiste volgorde)
    'page2_img1.png': 'K127.png',     # IJswit
    'page2_img2.png': 'K090.png',     # IJswit Hoogglans
    'page2_img3.png': 'K094.png',     # Angora
    'page2_img4.png': 'K096.png',     # Lava
    'page2_img5.jpeg': 'K033.jpeg',   # Basalt
    'page2_img6.png': 'K025.png',     # Wit
    'page2_img7.jpeg': 'K050.jpeg',   # Wit Hoogglans
    'page2_img8.png': 'K093.png',     # Cuba Libre
    'page2_img9.png': 'K095.png',     # Agave
    'page2_img10.png': 'K105.png',    # Grafiet
    'page2_img11.png': 'K092.png',    # Rose
    'page2_img12.png': 'K081.png',    # Magnolia Hoogglans
    'page2_img13.png': 'K117.png',    # Kashmir
    'page2_img14.png': 'K021.png',    # Lichtgrijs
    'page2_img15.png': 'K023.png',    # Zwart
    'page2_img16.jpeg': 'K080.jpeg',  # Magnolia
    'page2_img17.png': 'K054.png',    # Kashmir Hoogglans
    'page2_img18.png': 'K085.png',    # Steengrijs Hoogglans
    'page2_img19.png': 'K097.png',    # Fossiel
    # K098 (Kiezelgrijs) ontbreekt of is laatste niet geëxtraheerd
    
    # Prijsgroep 2 - Pagina 3 (14 afbeeldingen)
    # Volgorde: K160, K189, K020, K142, K187, K186, K175, K131, K034, K022, K035, K065, K140, K017
    'page3_img1.jpeg': 'K160.jpeg',   # Bardolino eiken
    'page3_img2.jpeg': 'K189.jpeg',   # Beton Wit
    'page3_img3.jpeg': 'K020.jpeg',   # Noord eiken
    'page3_img4.jpeg': 'K142.jpeg',   # Ast eiken
    'page3_img5.jpeg': 'K187.jpeg',   # Beton Zilver
    'page3_img6.jpeg': 'K186.jpeg',   # Beton Antraciet
    'page3_img7.jpeg': 'K175.jpeg',   # Beton Lava
    'page3_img8.jpeg': 'K131.jpeg',   # Sherman eiken
    'page3_img9.jpeg': 'K034.jpeg',   # Halifax eiken cottage
    'page3_img10.jpeg': 'K022.jpeg',  # Artisan eiken
    'page3_img11.jpeg': 'K035.jpeg',  # Halifax eiken
    'page3_img12.jpeg': 'K065.jpeg',  # Mammoet eiken
    'page3_img13.jpeg': 'K140.jpeg',  # Casella eiken
    'page3_img14.jpeg': 'K017.jpeg',  # Charcoal
    
    # Prijsgroep 3 - Pagina 4 (15 afbeeldingen)
    # Volgorde: K195, K241, K190, K250, K191, K253, K194, K256, K193, K254, K291, K273, K292, K248, K274
    'page4_img1.jpeg': 'K195.jpeg',   # Sherwood Wit
    'page4_img2.jpeg': 'K241.jpeg',   # Bushy Park
    'page4_img3.jpeg': 'K190.jpeg',   # Sherwood Magnolia
    'page4_img4.jpeg': 'K250.jpeg',   # Hackney Brook
    'page4_img5.jpeg': 'K191.jpeg',   # Sherwood Lava
    'page4_img6.jpeg': 'K253.jpeg',   # Adula
    'page4_img7.jpeg': 'K194.jpeg',   # Sherwood Antraciet
    'page4_img8.jpeg': 'K256.jpeg',   # Sherwood Park
    'page4_img9.png': 'K193.png',     # Sherwood Zwart
    'page4_img10.jpeg': 'K254.jpeg',  # Dartmoor
    'page4_img11.jpeg': 'K291.jpeg',  # Reflex Blue
    'page4_img12.jpeg': 'K273.jpeg',  # Reflex Zwart
    'page4_img13.jpeg': 'K292.jpeg',  # Reflex Executive
    'page4_img14.jpeg': 'K248.jpeg',  # Reflex Zilver
    'page4_img15.jpeg': 'K274.jpeg',  # Reflex Brons
}

# Backup oude bestanden
backup_dir = "public/assets/keuken-fronten/backup_old"
os.makedirs(backup_dir, exist_ok=True)

print("\n" + "="*70)
print("  CORRECTE HERNOEMER - Volgens PDF volgorde")
print("="*70 + "\n")

# Eerst backup maken van bestaande bestanden
print("📦 Backup maken van huidige bestanden...")
for old_name, new_name in rename_map_correct.items():
    target_path = os.path.join(target_dir, new_name)
    if os.path.exists(target_path):
        backup_path = os.path.join(backup_dir, new_name)
        shutil.copy2(target_path, backup_path)

print("✓ Backup gemaakt\n")

# Nu de juiste bestanden kopiëren
success_count = 0
for old_name, new_name in rename_map_correct.items():
    source_path = os.path.join(source_dir, old_name)
    target_path = os.path.join(target_dir, new_name)
    
    if os.path.exists(source_path):
        try:
            shutil.copy2(source_path, target_path)
            print(f"✓ {old_name:25s} → {new_name}")
            success_count += 1
        except Exception as e:
            print(f"✗ {old_name:25s} → Fout: {e}")
    else:
        print(f"⚠ {old_name:25s} → Niet gevonden")

print("\n" + "="*70)
print(f"✅ {success_count} afbeeldingen correct hernoemd")
print(f"📁 Backup van oude bestanden: {backup_dir}")
print("="*70 + "\n")
