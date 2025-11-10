#!/usr/bin/env python3
"""
Parse Celsis 2BA data to extract Sinclair airco products with images
"""

import re
import json
from pathlib import Path

# Paths
BASE_PATH = Path(__file__).parent.parent / "celsis" / "P200_DirectProfile_van_Celsis_SA_MF__20251027_083135_bzip2"
ARTLEV_FILE = BASE_PATH / "ArtLev.txt"
ATTACHMENT_FILE = BASE_PATH / "AttachmentIndex2.txt"
OUTPUT_FILE = Path(__file__).parent.parent / "src" / "data" / "sinclair-products.json"

def parse_artlev():
    """Parse ArtLev.txt to extract Sinclair products"""
    products = []
    
    with open(ARTLEV_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            # Check if line contains Sinclair products
            if 'Spectrum Plus' in line or 'Terrel' in line or 'Keyon' in line or 'Marvin' in line:
                parts = line.split()
                
                # Extract product info
                try:
                    article_nr = parts[0]
                    ean = parts[1] if len(parts) > 1 else ""
                    
                    # Find price (usually near the end, format like 2405.0000)
                    price_match = re.search(r'(\d{3,4}\.\d{4})', line)
                    price = float(price_match.group(1)) if price_match else 0
                    
                    # Find product description
                    if 'Spectrum Plus' in line:
                        series = "Spectrum Plus"
                        desc_match = re.search(r'Spectrum Plus[^0-9]*([A-Z0-9\-/]+\s+[\d\.]+/[\d\.]+kW)', line)
                    elif 'Terrel' in line:
                        series = "Terrel"
                        desc_match = re.search(r'Terrel[^0-9]*([A-Z0-9\-/]+\s+[\d\.]+/[\d\.]+kW)', line)
                    elif 'Keyon' in line:
                        series = "Keyon"
                        desc_match = re.search(r'Keyon[^0-9]*([A-Z0-9\-/]+\s+[\d\.]+/[\d\.]+kW)', line)
                    else:
                        series = "Marvin"
                        desc_match = re.search(r'Marvin[^0-9]*([A-Z0-9\-/]+\s+[\d\.]+/[\d\.]+kW)', line)
                    
                    description = desc_match.group(0).strip() if desc_match else line[100:200].strip()
                    
                    # Extract model number
                    model_match = re.search(r'(ASH|SIH|SOH)-\d+[A-Z0-9]+', line)
                    model = model_match.group(0) if model_match else ""
                    
                    # Extract cooling/heating capacity
                    capacity_match = re.search(r'([\d\.]+)/([\d\.]+)kW', line)
                    cooling = float(capacity_match.group(1)) if capacity_match else 0
                    heating = float(capacity_match.group(2)) if capacity_match else 0
                    
                    # Determine unit type
                    if 'Set' in line or 'set' in line:
                        unit_type = "Complete Set"
                    elif 'buitenunit' in line or 'Outdoor' in line:
                        unit_type = "Buitenunit"
                    elif 'binnenunit' in line or 'wandunit' in line or 'Indoor' in line or 'Wandunit' in line:
                        unit_type = "Binnenunit"
                    else:
                        unit_type = "Unknown"
                    
                    # Extract color if present
                    color = "Wit"
                    if 'Antraciet' in line or 'BITB' in line:
                        color = "Antraciet"
                    elif 'Zilver' in line or 'BITS' in line:
                        color = "Zilver"
                    elif 'Champagne' in line or 'BITC' in line:
                        color = "Champagne"
                    elif 'Wit' in line or 'BITW' in line:
                        color = "Wit"
                    
                    products.append({
                        'article_nr': article_nr,
                        'ean': ean,
                        'series': series,
                        'model': model,
                        'description': description,
                        'unit_type': unit_type,
                        'color': color,
                        'cooling_kw': cooling,
                        'heating_kw': heating,
                        'price': price,
                        'has_image': False,
                        'image_url': None
                    })
                except Exception as e:
                    print(f"Error parsing line: {e}")
                    continue
    
    return products

def parse_attachments():
    """Parse AttachmentIndex2.txt to get image URLs"""
    images = {}
    
    with open(ATTACHMENT_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            # Look for PPI (Product Picture) entries
            if '\tPPI\t' in line and 'https://' in line:
                parts = line.split('\t')
                if len(parts) >= 7:
                    # Field 3 is usually article number (GLN)
                    gln = parts[2]
                    # Field 4 is article number
                    article = parts[3]
                    # Field 6 is URL
                    url = parts[6]
                    
                    if url.startswith('https://') and url.endswith('.jpg'):
                        # Store by both GLN and article number
                        images[gln] = url
                        images[article] = url
    
    return images

def match_images_to_products(products, images):
    """Match product images"""
    matched = 0
    
    for product in products:
        # Try to find image by article number or EAN
        if product['article_nr'] in images:
            product['has_image'] = True
            product['image_url'] = images[product['article_nr']]
            matched += 1
        elif product['ean'] in images:
            product['has_image'] = True
            product['image_url'] = images[product['ean']]
            matched += 1
        elif product['model'] in images:
            product['has_image'] = True
            product['image_url'] = images[product['model']]
            matched += 1
    
    return matched

def main():
    print("🔍 Parsing Celsis 2BA data...")
    
    # Parse products
    print("📦 Extracting Sinclair products from ArtLev.txt...")
    products = parse_artlev()
    print(f"   Found {len(products)} Sinclair products")
    
    # Parse images
    print("🖼️  Extracting product images from AttachmentIndex2.txt...")
    images = parse_attachments()
    print(f"   Found {len(images)} product images")
    
    # Match images to products
    print("🔗 Matching images to products...")
    matched = match_images_to_products(products, images)
    print(f"   Matched {matched} products with images")
    
    # Group by series
    by_series = {
        'Spectrum Plus': [p for p in products if p['series'] == 'Spectrum Plus'],
        'Terrel': [p for p in products if p['series'] == 'Terrel'],
        'Keyon': [p for p in products if p['series'] == 'Keyon'],
        'Marvin': [p for p in products if p['series'] == 'Marvin']
    }
    
    # Print summary
    print("\n📊 Summary by series:")
    for series, items in by_series.items():
        with_images = len([p for p in items if p['has_image']])
        print(f"   {series}: {len(items)} products ({with_images} with images)")
    
    # Save to JSON
    OUTPUT_FILE.parent.mkdir(exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump({
            'products': products,
            'by_series': {k: v for k, v in by_series.items() if v},
            'stats': {
                'total_products': len(products),
                'products_with_images': matched,
                'products_without_images': len(products) - matched
            }
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Data saved to: {OUTPUT_FILE}")
    
    # Print products without images
    no_images = [p for p in products if not p['has_image']]
    if no_images:
        print(f"\n⚠️  Products without images ({len(no_images)}):")
        for p in no_images[:10]:  # Show first 10
            print(f"   - {p['series']} {p['model']}: {p['description'][:60]}")
        if len(no_images) > 10:
            print(f"   ... and {len(no_images) - 10} more")

if __name__ == '__main__':
    main()
