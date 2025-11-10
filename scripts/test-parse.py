# Quick test to check if we can read the files
import sys
from pathlib import Path

print("Python version:", sys.version)
print("Current directory:", Path.cwd())

base_path = Path("celsis/P200_DirectProfile_van_Celsis_SA_MF__20251027_083135_bzip2")
print("\nChecking paths:")
print(f"Base path exists: {base_path.exists()}")

artlev = base_path / "ArtLev.txt"
print(f"ArtLev.txt exists: {artlev.exists()}")

attachment = base_path / "AttachmentIndex2.txt"
print(f"AttachmentIndex2.txt exists: {attachment.exists()}")

if artlev.exists():
    print(f"\nArtLev.txt size: {artlev.stat().st_size} bytes")
    with open(artlev, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        print(f"Total lines: {len(lines)}")
        
        sinclair_lines = [l for l in lines if 'Spectrum' in l or 'Terrel' in l or 'Keyon' in l]
        print(f"Lines with Sinclair products: {len(sinclair_lines)}")
        
        if sinclair_lines:
            print("\nFirst Sinclair product:")
            print(sinclair_lines[0][:200])

if attachment.exists():
    print(f"\nAttachmentIndex2.txt size: {attachment.stat().st_size} bytes")
    with open(attachment, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        print(f"Total lines: {len(lines)}")
        
        image_lines = [l for l in lines if 'PPI' in l and 'https://' in l and '.jpg' in l]
        print(f"Lines with product images: {len(image_lines)}")
        
        if image_lines:
            print("\nFirst image entry:")
            print(image_lines[0][:200])
