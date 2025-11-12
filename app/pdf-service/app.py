from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from fpdf import FPDF
import os
import tempfile
from datetime import datetime

app = Flask(__name__)
CORS(app)

class PlantDiseasePDF(FPDF):
    def __init__(self):
        super().__init__()
        self.is_healthy = False
        
    def header(self):
        # Gradient-like header with logo placeholder
        self.set_fill_color(16, 185, 129)  # Emerald green
        self.rect(0, 0, 210, 35, 'F')
        
        # Title
        self.set_font('Arial', 'B', 24)
        self.set_text_color(255, 255, 255)
        self.set_xy(10, 12)
        self.cell(0, 10, 'Crop Guard', 0, 1, 'C')
        
        self.set_font('Arial', '', 12)
        self.set_xy(10, 23)
        self.cell(0, 8, 'Plant Disease Detection Report', 0, 1, 'C')
        self.ln(10)
        
    def footer(self):
        self.set_y(-20)
        # Footer bar
        self.set_fill_color(16, 185, 129)
        self.rect(0, self.get_y(), 210, 20, 'F')
        
        self.set_font('Arial', 'I', 9)
        self.set_text_color(255, 255, 255)
        self.set_y(-15)
        self.cell(0, 5, f'Generated: {datetime.now().strftime("%B %d, %Y at %H:%M")}', 0, 0, 'C')
        self.ln(5)
        self.cell(0, 5, f'Page {self.page_no()}/{{nb}} | Crop Guard - Protecting Your Harvest', 0, 0, 'C')
    
    def info_box(self, title, content, color_r=16, color_g=185, color_b=129):
        """Create a colored info box"""
        self.set_fill_color(color_r, color_g, color_b, 20)  # Light version
        self.set_draw_color(color_r, color_g, color_b)
        self.set_line_width(0.5)
        
        # Draw box
        start_y = self.get_y()
        self.rect(15, start_y, 180, 8, 'DF')
        
        # Title
        self.set_xy(20, start_y + 1)
        self.set_font('Arial', 'B', 11)
        self.set_text_color(color_r, color_g, color_b)
        self.cell(0, 6, title, 0, 1)
        
        # Content
        self.set_x(20)
        self.set_font('Arial', '', 10)
        self.set_text_color(60, 60, 60)
        self.multi_cell(160, 5, content)
        self.ln(2)
    
    def section_header(self, icon, title, color_r=16, color_g=185, color_b=129):
        """Create a section header with icon"""
        self.set_fill_color(color_r, color_g, color_b)
        self.rect(10, self.get_y(), 190, 10, 'F')
        
        self.set_font('Arial', 'B', 13)
        self.set_text_color(255, 255, 255)
        self.set_xy(15, self.get_y())
        self.cell(0, 10, f'{icon}  {title}', 0, 1, 'L')
        self.ln(3)
    
    def section_content(self, body):
        """Add section content with proper formatting"""
        self.set_font('Arial', '', 10)
        self.set_text_color(60, 60, 60)
        self.set_x(15)
        self.multi_cell(180, 6, body)
        self.ln(5)
    
    def bullet_list(self, items):
        """Create a bullet point list"""
        self.set_font('Arial', '', 10)
        self.set_text_color(60, 60, 60)
        for item in items:
            self.set_x(20)
            # Remove bullet if already present
            clean_item = item.strip()
            if clean_item.startswith('•') or clean_item.startswith('-'):
                clean_item = clean_item[1:].strip()
            # Use simple dash instead of Unicode bullet for Latin-1 compatibility
            self.multi_cell(175, 5, f'  - {clean_item}')
        self.ln(3)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "PDF Generator"}), 200

@app.route('/api/pdf/generate', methods=['POST'])
def generate_pdf():
    try:
        data = request.get_json()
        
        # Extract basic data
        plant_name = data.get('plantName', 'Unknown Plant')
        scientific_name = data.get('scientificName', 'Unknown')
        disease_name = data.get('diseaseName', 'Unknown Disease')
        is_healthy = data.get('isHealthy', False)
        symptoms = data.get('symptoms', 'No symptoms information available.')
        causes = data.get('causes', 'No causes information available.')
        treatment = data.get('treatment', 'No treatment information available.')
        prevention = data.get('prevention', 'No prevention information available.')
        
        # Extract live details if present
        live_details = data.get('liveDetails', None)
        
        # Create PDF
        pdf = PlantDiseasePDF()
        pdf.is_healthy = is_healthy
        pdf.alias_nb_pages()
        pdf.add_page()
        
        # === DETECTION SUMMARY BOX ===
        pdf.set_fill_color(240, 253, 244)  # Very light green
        pdf.set_draw_color(16, 185, 129)
        pdf.set_line_width(1)
        pdf.rect(10, pdf.get_y(), 190, 40, 'D')
        
        # Plant info
        y_start = pdf.get_y() + 8
        pdf.set_xy(20, y_start)
        pdf.set_font('Arial', 'B', 11)
        pdf.set_text_color(16, 185, 129)
        pdf.cell(50, 7, 'Plant Species:', 0, 0)
        pdf.set_font('Arial', 'B', 11)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 7, plant_name, 0, 1)
        
        pdf.set_xy(20, y_start + 8)
        pdf.set_font('Arial', 'I', 9)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(50, 7, 'Scientific Name:', 0, 0)
        pdf.set_font('Arial', 'I', 9)
        pdf.cell(0, 7, scientific_name, 0, 1)
        
        # Disease status
        pdf.set_xy(20, y_start + 16)
        pdf.set_font('Arial', 'B', 11)
        if is_healthy:
            pdf.set_text_color(16, 185, 129)
            pdf.cell(50, 7, 'Status:', 0, 0)
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(0, 7, 'HEALTHY - No Disease Detected', 0, 1)
        else:
            pdf.set_text_color(220, 38, 38)
            pdf.cell(50, 7, 'Disease Detected:', 0, 0)
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(0, 7, disease_name, 0, 1)
        
        pdf.ln(15)
        
        # If healthy, show positive message and skip disease sections
        if is_healthy:
            pdf.section_header('', 'Health Assessment', 16, 185, 129)
            pdf.section_content(
                'Great news! Your plant appears to be healthy with no visible signs of disease. '
                'Continue maintaining good agricultural practices including proper watering, fertilization, '
                'and pest management to keep your plants thriving.'
            )
            
            pdf.section_header('', 'Maintenance Recommendations', 16, 185, 129)
            pdf.section_content(prevention if prevention else 
                'Practice crop rotation, maintain proper spacing, ensure adequate nutrition, '
                'monitor regularly for early signs of stress, and maintain clean field conditions.')
        else:
            # === SYMPTOMS SECTION ===
            pdf.section_header('', 'Symptoms & Identification', 220, 38, 38)
            pdf.section_content(symptoms)
            
            # === CAUSES/TRIGGER SECTION ===
            pdf.section_header('', 'Causes & Triggers', 245, 158, 11)
            if live_details and live_details.get('trigger'):
                pdf.section_content(live_details['trigger'])
            else:
                pdf.section_content(causes)
            
            # === TREATMENT SECTION ===
            pdf.section_header('', 'Treatment Recommendations', 16, 185, 129)
            
            # Organic Control
            if live_details and live_details.get('organicControl'):
                pdf.set_font('Arial', 'B', 11)
                pdf.set_text_color(34, 197, 94)
                pdf.set_x(15)
                pdf.cell(0, 7, 'Organic Control Methods:', 0, 1)
                pdf.ln(1)
                pdf.section_content(live_details['organicControl'])
            else:
                pdf.section_content(treatment)
            
            # Chemical Control
            if live_details and live_details.get('chemicalControl'):
                pdf.set_font('Arial', 'B', 11)
                pdf.set_text_color(147, 51, 234)
                pdf.set_x(15)
                pdf.cell(0, 7, 'Chemical Control Methods:', 0, 1)
                pdf.ln(1)
                pdf.section_content(live_details['chemicalControl'])
            
            # === PREVENTION SECTION ===
            pdf.section_header('', 'Prevention & Management', 59, 130, 246)
            if live_details and live_details.get('preventiveMeasures'):
                measures = live_details['preventiveMeasures'].split('\n')
                pdf.bullet_list([m for m in measures if m.strip()])
            else:
                pdf.section_content(prevention)
            
            # === RECOMMENDED PRODUCTS ===
            if live_details and live_details.get('recommendedProducts'):
                products = live_details['recommendedProducts']
                if products and len(products) > 0:
                    pdf.section_header('', 'Recommended Products', 249, 115, 22)
                    for product in products:
                        if isinstance(product, dict):
                            product_name = product.get('name', 'Unknown')
                            product_type = product.get('type', '')
                            product_desc = product.get('description', '')
                            
                            pdf.set_font('Arial', 'B', 10)
                            pdf.set_text_color(16, 185, 129)
                            pdf.set_x(20)
                            pdf.cell(0, 6, f'• {product_name}', 0, 1)
                            
                            if product_type:
                                pdf.set_font('Arial', 'I', 9)
                                pdf.set_text_color(100, 100, 100)
                                pdf.set_x(25)
                                pdf.cell(0, 5, f'Type: {product_type}', 0, 1)
                            
                            if product_desc:
                                pdf.set_font('Arial', '', 9)
                                pdf.set_text_color(60, 60, 60)
                                pdf.set_x(25)
                                pdf.multi_cell(170, 5, product_desc)
                            pdf.ln(2)
                    pdf.ln(3)
            
            # === ADDITIONAL INFORMATION ===
            if live_details and live_details.get('additionalInfo'):
                additional_info = live_details['additionalInfo']
                if additional_info and len(additional_info) > 0:
                    pdf.section_header('', 'Additional Information', 245, 158, 11)
                    for info in additional_info:
                        if isinstance(info, dict):
                            title = info.get('title', '')
                            content = info.get('content', '')
                            
                            if title:
                                pdf.set_font('Arial', 'B', 10)
                                pdf.set_text_color(16, 185, 129)
                                pdf.set_x(20)
                                pdf.cell(0, 6, title, 0, 1)
                                pdf.ln(1)
                            
                            if content:
                                pdf.set_font('Arial', '', 10)
                                pdf.set_text_color(60, 60, 60)
                                pdf.set_x(20)
                                pdf.multi_cell(170, 5, content)
                            pdf.ln(3)
        
        # === DATA SOURCE INFO ===
        if live_details:
            pdf.ln(5)
            pdf.set_font('Arial', 'I', 8)
            pdf.set_text_color(100, 100, 100)
            pdf.set_x(15)
            source = live_details.get('source', 'Live Data')
            fetched_at = live_details.get('fetchedAt', '')
            if fetched_at:
                pdf.multi_cell(180, 4, f'Live data source: {source} | Fetched: {fetched_at}')
            else:
                pdf.multi_cell(180, 4, f'Data source: {source}')
        
        # === DISCLAIMER ===
        pdf.ln(10)
        pdf.set_fill_color(254, 243, 199)  # Light yellow
        pdf.set_draw_color(251, 191, 36)
        pdf.rect(10, pdf.get_y(), 190, 20, 'DF')
        pdf.set_xy(15, pdf.get_y() + 2)
        pdf.set_font('Arial', 'B', 9)
        pdf.set_text_color(180, 83, 9)
        pdf.cell(0, 5, 'Important Disclaimer', 0, 1)
        pdf.set_x(15)
        pdf.set_font('Arial', '', 8)
        pdf.set_text_color(120, 53, 15)
        pdf.multi_cell(180, 4, 
            'This report is generated by an AI-based detection system and should be used as a '
            'preliminary assessment tool. For critical agricultural decisions, pest management, '
            'or before applying treatments, please consult with certified agricultural experts, '
            'agronomists, or local extension services.')
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        pdf_path = temp_file.name
        temp_file.close()
        
        pdf.output(pdf_path)
        
        # Return the PDF file
        response = send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'CropGuard_Report_{plant_name.replace(" ", "_")}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        )
        
        # Clean up temp file after sending
        @response.call_on_close
        def cleanup():
            try:
                os.unlink(pdf_path)
            except:
                pass
        
        return response
        
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8083, debug=False)
