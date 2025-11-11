import os
import shutil

# Directories
source_dir = "public/assets/keuken-fronten/extracted"
target_dir = "public/assets/keuken-fronten"

# Zorg dat target directory bestaat
os.makedirs(target_dir, exist_ok=True)

# PRIJSGROEP 6 - Lak kleuren
# Op basis van de afbeelding die je hebt gestuurd
# Pagina 5 bevat 4 afbeeldingen - dit zijn waarschijnlijk de eerste Lak kleuren
# De volgorde in de afbeelding: 145 Snow, 751 Wit, 280 Oudwit, 270 Stone, 752 Magnolia, 
# 950 Fresco, 602 Sand, 603 Truffel, 781 Kashmir, 815 Grigio, 165 Lava, 204 Umbra, 205 Arabic, 730 Carbon, 430 Zwart

rename_map_pg6 = {
    # Pagina 5 - eerste 4 lakken
    'page5_img1.png': '145.png',          # Snow
    'page5_img2.png': '751.png',          # Wit
    'page5_img3.png': '280.png',          # Oudwit
    'page5_img4.png': '270.png',          # Stone
}

# Tel successen
success_count = 0
missing_count = 0
missing_files = []

print("\n" + "="*70)
print("  KEUKEN FRONTEN HERNOEMER - PRIJSGROEP 6 (LAK)")
print("="*70 + "\n")

print("📁 Bron: extracted/")
print("📁 Doel: public/assets/keuken-fronten/\n")

for old_name, new_name in rename_map_pg6.items():
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

print("💡 OPMERKING: De overige lak kleuren (752, 950, 602, etc.) staan")
print("    waarschijnlijk in de PDF maar zijn niet duidelijk geïdentificeerd.")
print("    Check de extracted/ folder voor meer afbeeldingen.\n")
