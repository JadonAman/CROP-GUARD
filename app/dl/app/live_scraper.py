"""
Live Web Scraper for Disease Details
Fetches real-time information from Plantix.net when user clicks "Get More Details"
"""
import requests
from bs4 import BeautifulSoup
import re

# Disease name to Plantix URL mapping (from the web scraping we did earlier)
PLANTIX_URL_MAP = {
    'Apple___Apple_scab': 'https://plantix.net/en/library/plant-diseases/100006/apple-scab/',
    'Apple___Black_rot': 'https://plantix.net/en/library/plant-diseases/300006/black-rot',
    'Apple___Cedar_apple_rust': 'https://plantix.net/en/library/plant-diseases/100009/european-pear-rust',
    'Cherry_(including_sour)___Powdery_mildew': 'https://plantix.net/en/library/plant-diseases/100002/powdery-mildew/',
    'Corn_(maize)___Common_rust_': 'https://plantix.net/en/library/plant-diseases/100082/common-rust-of-maize/',
    'Corn_(maize)___Northern_Leaf_Blight': 'https://plantix.net/en/library/plant-diseases/100065/northern-leaf-blight/',
    'Grape___Black_rot': 'https://plantix.net/en/library/plant-diseases/100350/black-rot-of-grape/',
    'Peach___Bacterial_spot': 'https://plantix.net/en/library/plant-diseases/300050/bacterial-spot-and-speck-of-tomato/',
    'Pepper_bell___Bacterial_spot': 'https://plantix.net/en/library/plant-diseases/300003/bacterial-spot-of-pepper',
    'Potato___Early_blight': 'https://plantix.net/en/library/plant-diseases/100321/early-blight/',
    'Potato___Late_blight': 'https://plantix.net/en/library/plant-diseases/100040/potato-late-blight',
    'Squash___Powdery_mildew': 'https://plantix.net/en/library/plant-diseases/100002/powdery-mildew/',
    'Strawberry___Leaf_scorch': 'https://plantix.net/en/library/plant-diseases/100019/cherry-leaf-scorch/',
    'Tomato___Bacterial_spot': 'https://plantix.net/en/library/plant-diseases/300050/bacterial-spot-and-speck-of-tomato/',
    'Tomato___Early_blight': 'https://plantix.net/en/library/plant-diseases/100321/early-blight/',
    'Tomato___Late_blight': 'https://plantix.net/en/library/plant-diseases/100046/tomato-late-blight/',
    'Tomato___Leaf_Mold': 'https://plantix.net/en/library/plant-diseases/100257/leaf-mold-of-tomato/',
    'Tomato___Septoria_leaf_spot': 'https://plantix.net/en/library/plant-diseases/100152/septoria-leaf-spot/',
    'Tomato___Target_Spot': 'https://plantix.net/en/library/plant-diseases/100109/target-spot-of-soybean/',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'https://plantix.net/en/library/plant-diseases/200036/tomato-yellow-leaf-curl-virus/'
}


def scrape_plantix_details(disease_name):
    """
    Scrape live details from Plantix.net for a given disease
    
    Args:
        disease_name (str): Disease name in format "Plant___Disease"
        
    Returns:
        dict: Contains trigger, organic_control, chemical_control, and other details
    """
    try:
        print(f"[LIVE_SCRAPER] Received disease_name: {disease_name}")
        print(f"[LIVE_SCRAPER] Available keys: {list(PLANTIX_URL_MAP.keys())}")
        
        # Get URL from mapping
        url = PLANTIX_URL_MAP.get(disease_name)
        
        print(f"[LIVE_SCRAPER] URL found: {url}")
        
        if not url:
            return {
                'success': False,
                'message': 'Disease information not available for live scraping',
                'data': None
            }
        
        # Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Plantix now embeds data in a JSON script tag
        script_tag = soup.find('script', {'id': 'quokka-state'})
        
        result = {
            'trigger': '',
            'organic_control': '',
            'chemical_control': '',
            'preventive_measures': '',
            'additional_info': []
        }
        
        if script_tag:
            import json
            # The JSON uses &q; as quotes, replace them
            json_text = script_tag.string.replace('&q;', '"').replace('&a;', '&')
            data = json.loads(json_text)
            
            # Extract pathogen details from the embedded JSON
            if 'pathogen-details' in data:
                details = data['pathogen-details']
                
                result['trigger'] = details.get('trigger', '')
                result['organic_control'] = details.get('alternative_treatment', '')
                result['chemical_control'] = details.get('chemical_treatment', '')
                
                # Preventive measures is an array
                preventive = details.get('preventive_measures', [])
                if isinstance(preventive, list):
                    result['preventive_measures'] = '\n'.join([f"• {measure}" for measure in preventive])
                else:
                    result['preventive_measures'] = preventive
                
                # Symptoms as additional info
                if details.get('symptoms'):
                    result['additional_info'].append({
                        'title': 'Symptoms',
                        'content': details['symptoms']
                    })
        
        # If we didn't get data from JSON, try parsing HTML directly (fallback)
        if not result['trigger'] and not result['organic_control']:
            # Try to find content in the rendered HTML
            trigger_card = soup.find('div', {'data-cy': 'trigger-card'})
            if trigger_card:
                trigger_p = trigger_card.find('p')
                if trigger_p:
                    result['trigger'] = trigger_p.get_text().strip()
            
            organic_card = soup.find('div', {'data-cy': 'biological-control-card'})
            if organic_card:
                organic_p = organic_card.find('p')
                if organic_p:
                    result['organic_control'] = organic_p.get_text().strip()
            
            chemical_card = soup.find('div', {'data-cy': 'chemical-control-card'})
            if chemical_card:
                # Get all p tags and combine them
                chemical_ps = chemical_card.find_all('p')
                if chemical_ps:
                    result['chemical_control'] = ' '.join([p.get_text().strip() for p in chemical_ps])
        
        return {
            'success': True,
            'message': 'Successfully fetched live data from Plantix.net',
            'data': result
        }
        
    except requests.exceptions.Timeout:
        return {
            'success': False,
            'message': 'Request timeout - Plantix.net took too long to respond',
            'data': None
        }
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'message': f'Failed to fetch data: {str(e)}',
            'data': None
        }
    except Exception as e:
        print(f"[LIVE_SCRAPER] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'success': False,
            'message': f'Error parsing data: {str(e)}',
            'data': None
        }


def search_products_online(disease_name, plant_name):
    """
    Search for recommended products for disease treatment
    This is a placeholder - you can integrate with agricultural product APIs
    """
    products = []
    
    # Extract disease name without plant prefix
    disease_only = disease_name.split('___')[1] if '___' in disease_name else disease_name
    disease_clean = disease_only.replace('_', ' ')
    
    # Common treatments based on disease type
    product_suggestions = {
        'blight': [
            {'name': 'Copper Fungicide', 'type': 'Organic', 'description': 'Copper-based fungicide for blight control'},
            {'name': 'Chlorothalonil', 'type': 'Chemical', 'description': 'Broad-spectrum fungicide'}
        ],
        'rust': [
            {'name': 'Sulfur Powder', 'type': 'Organic', 'description': 'Natural fungicide for rust diseases'},
            {'name': 'Myclobutanil', 'type': 'Chemical', 'description': 'Systemic fungicide for rust'}
        ],
        'mildew': [
            {'name': 'Neem Oil', 'type': 'Organic', 'description': 'Natural fungicide and insecticide'},
            {'name': 'Potassium Bicarbonate', 'type': 'Organic', 'description': 'Organic fungicide for mildew'}
        ],
        'spot': [
            {'name': 'Bacillus subtilis', 'type': 'Biological', 'description': 'Biological fungicide'},
            {'name': 'Mancozeb', 'type': 'Chemical', 'description': 'Protective fungicide'}
        ],
        'rot': [
            {'name': 'Copper Hydroxide', 'type': 'Organic', 'description': 'Copper-based bactericide'},
            {'name': 'Streptomycin', 'type': 'Chemical', 'description': 'Antibiotic for bacterial diseases'}
        ]
    }
    
    # Find matching products
    for keyword, prods in product_suggestions.items():
        if keyword in disease_clean.lower():
            products.extend(prods)
            break
    
    if not products:
        # Default products
        products = [
            {'name': 'Neem Oil', 'type': 'Organic', 'description': 'General purpose organic fungicide'},
            {'name': 'Copper Fungicide', 'type': 'Organic', 'description': 'Broad-spectrum disease control'}
        ]
    
    return products
