import os
import shutil

# Directories
source_dir = "public/assets/keuken-fronten/extracted"
target_dir = "public/assets/keuken-fronten"

# Zorg dat target directory bestaat
os.makedirs(target_dir, exist_ok=True)

# PRIJSGROEP 4 - Perfect Sense (pagina 5/6 eerste 8) en Gerona (pagina 6 laatste 8)
# Pagina 6 bevat 15 afbeeldingen - eerste 8 zijn Perfect Sense, laatste 8 zijn Gerona (minus 1)
rename_map_pg4 = {
    # Perfect Sense - Matlak (pagina 6, items 1-8)
    'page6_img1.png': 'PS110.png',        # Perfect Sense Wit
    'page6_img2.png': 'PS100.png',        # Perfect Sense Licht Grijs
    'page6_img3.jpeg': 'PS120.jpeg',      # Perfect Sense Beige
    'page6_img4.jpeg': 'PS130.jpeg',      # Perfect Sense Zand
    'page6_img5.jpeg': 'PS170.jpeg',      # Perfect Sense Antraciet
    'page6_img6.jpeg': 'PS150.jpeg',      # Perfect Sense Grafiet
    'page6_img7.jpeg': 'PS140.jpeg',      # Perfect Sense Donker Grijs
    'page6_img8.jpeg': 'PS160.jpeg',      # Perfect Sense Zwart
    
    # Gerona - Hoogglans (pagina 6, items 9-15 + misschien meer op pagina 7)
    'page6_img9.png': 'HGL090.png',       # Gerona Wit
    'page6_img10.jpeg': 'HGL025.jpeg',    # Gerona Licht Grijs
    'page6_img11.jpeg': 'HGL070.jpeg',    # Gerona Magnolia
    'page6_img12.jpeg': 'HGL080.jpeg',    # Gerona Zwart
    'page6_img13.jpeg': 'HGL071.jpeg',    # Gerona Vanille
    'page6_img14.jpeg': 'HGL069.jpeg',    # Gerona Cashmere
    'page6_img15.jpeg': 'HGL105.jpeg',    # Gerona Taupe
    
    # Als er nog een HGL023 is, die staat waarschijnlijk op pagina 7
    'page7_img1.jpeg': 'HGL023.jpeg',     # Gerona Creme
}

# PRIJSGROEP 5 - MDF Folie (pagina 7, vanaf img2)
# 15 kleuren, elk in meerdere stijlen beschikbaar
rename_map_pg5 = {
    'page7_img2.jpeg': 'F341.jpeg',       # Wit
    'page7_img3.jpeg': 'F205.jpeg',       # Licht Grijs
    'page7_img4.jpeg': 'F222.jpeg',       # Stone Grey
    'page7_img5.jpeg': 'F208.jpeg',       # Graphite
    'page7_img6.jpeg': 'F210.jpeg',       # Antraciet
    'page7_img7.jpeg': 'F335.jpeg',       # Zwart
    'page7_img8.jpeg': 'F040.jpeg',       # Magnolia
    'page7_img9.jpeg': 'F325.jpeg',       # Beige
    'page7_img10.jpeg': 'F345.jpeg',      # Cashmere
    'page7_img11.jpeg': 'F365.jpeg',      # Sahara
    # Mogelijk meer op pagina 8 of andere pagina's
}

# PRIJSGROEP 6 - Lak (mogelijk pagina 8 en verder, of gemengd)
# 15 kleuren met nummers zoals 145, 751, etc.
# Deze moeten we mogelijk handmatig identificeren

# Combineer alle mappings
all_mappings = {**rename_map_pg4, **rename_map_pg5}

# Tel successen
success_count = 0
missing_count = 0
missing_files = []

print("\n" + "="*70)
print("  KEUKEN FRONTEN HERNOEMER - PRIJSGROEP 4, 5, 6")
print("="*70 + "\n")

print("📁 Bron: extracted/")
print("📁 Doel: public/assets/keuken-fronten/\n")

for old_name, new_name in all_mappings.items():
    source_path = os.path.join(source_dir, old_name)
    target_path = os.path.join(target_dir, new_name)
    
    if os.path.exists(source_path):
        try:
            shutil.copy2(source_path, target_path)
            print(f"✓ {old_name:20s} → {new_name}")
            success_count += 1
        except Exception as e:
            print(f"✗ {old_name:20s} → Fout: {e}")
    else:
        print(f"⚠ {old_name:20s} → Bestand niet gevonden")
        missing_count += 1
        missing_files.append(old_name)

print("\n" + "="*70)
print(f"✅ {success_count} afbeeldingen succesvol hernoemd en verplaatst")
if missing_count > 0:
    print(f"⚠️  {missing_count} bestanden niet gevonden")
print(f"📁 Afbeeldingen staan nu in: {target_dir}")
print("="*70 + "\n")

if missing_files:
    print("❌ Niet gevonden bestanden:")
    for f in missing_files:
        print(f"   - {f}")
    print()

print("💡 TIP: Controleer de extracted/ folder voor overige bestanden")
print("    en identificeer handmatig welke voor prijsgroep 5 en 6 zijn.\n")
