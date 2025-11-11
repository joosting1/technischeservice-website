import fitz  # PyMuPDF
import re

def extract_color_names_from_pdf(pdf_path):
    """Extract all color codes and their names from the PDF"""
    
    pdf_document = fitz.open(pdf_path)
    
    print("\n" + "="*80)
    print("  KLEURNAMEN EXTRACTIE UIT PDF")
    print("="*80 + "\n")
    
    all_colors = {}
    
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        text = page.get_text()
        
        print(f"\n📄 PAGINA {page_num + 1}")
        print("-" * 80)
        
        # Find all lines with K-codes
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            # Look for K codes followed by names
            if re.search(r'K\d{3,4}', line):
                # Get this line and the next few lines for context
                context = '\n'.join(lines[i:min(i+3, len(lines))])
                
                # Try to extract code and name patterns
                matches = re.findall(r'(K\d{3,4})\s+([A-Za-z\s]+)', context)
                
                for code, name in matches:
                    name = name.strip()
                    if len(name) > 2 and len(name) < 50:  # Filter out noise
                        all_colors[code] = name
                        print(f"  {code}: {name}")
        
        # Also print raw relevant text for manual inspection
        if 'Prijsgroep' in text or 'PRIJSGROEP' in text.upper():
            print("\n📝 Ruwe tekst sectie:")
            relevant_lines = [l for l in lines if any(x in l for x in ['K0', 'K1', 'K2', 'K3'])]
            for line in relevant_lines[:20]:  # First 20 relevant lines
                print(f"  {line}")
    
    pdf_document.close()
    
    print("\n" + "="*80)
    print(f"✅ Totaal {len(all_colors)} kleuren gevonden")
    print("="*80 + "\n")
    
    # Print sorted by code
    print("\n📋 VOLLEDIGE LIJST (gesorteerd):\n")
    for code in sorted(all_colors.keys()):
        print(f"  {{ code: '{code}', name: '{all_colors[code]}' }},")
    
    return all_colors

if __name__ == "__main__":
    colors = extract_color_names_from_pdf("brochure.pdf")
