from app.controllers import blueprint, mongo, jsonify, datetime, resnet, request
from bson.objectid import ObjectId
import flask
from flask_cors import CORS, cross_origin
from app.schemas import validate_detectionHistory

# Import live scraper
from app.live_scraper import scrape_plantix_details, search_products_online


@blueprint.route('/api/dl', methods=["GET"])
def hello():
    return 'Hello, World!'


@blueprint.route('/api/dl/prediction/test', methods=['GET'])
def test1():
    print(ObjectId("623a3d74960a9f8526395e08"))
    data = validate_detectionHistory(
        {"createdAt": str(datetime.now()),
         "plantId": ObjectId("623a3d74960a9f8526395e08")})
    if data['ok']:
        data = data['data']
        print(mongo.db.detectionHistory.find_one())
        print(type(mongo.db.detectionHistory.find_one()['_id']))
        mongo.db.detectionHistory.insert_one(data)
        return jsonify({'ok': True, 'message': 'User created successfully!', 'detectionHistory': data}), 200

    return jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(data['message'])}), 400


@blueprint.route('/api/dl/detection', methods=['POST'])
@cross_origin(supports_credentials=True)
def dl_detection():
    try:
        uid = '124352414'
        city = 'Mumbai'
        ip = '13143536'
        district = 'Mumbai City'
        state = 'MH'
        lat = 11.4652
        lon = 242.24

        # print(request.headers)

        image = request.files['image']
        detection = resnet.predict_image(image)
        print( detection)
        detection_split = detection.split('___')
        plant, disease = detection_split[0], detection_split[1]
        disease_info = mongo.db.disease.find_one({"name": detection})
        plant_info = mongo.db.plants.find_one({"commonName": plant})
        
        # Handle case when plant or disease not found in database
        if plant_info is None:
            plant_info = {
                "_id": ObjectId('507f191e810c19729de860ea'),
                "commonName": plant,
                "scientificName": "Unknown",
                "description": "Plant information not available in database"
            }
        
        if disease_info is None:
            disease_info = {
                "_id": ObjectId('507f191e810c19729de860eb'),
                "name": detection,
                "description": "Disease information not available in database" if disease != "healthy" else "Plant appears healthy"
            }
        
        detectionHistory = {
            "createdAt": str(datetime.now()),
            "ip": ip,
            "city": city,
            "district": district,
            "state": state,
            "location": {
                "lat": lat,
                "lon": lon
            },
            "detected_class": detection,
            "plantId": plant_info['_id'],
            "diseaseId": disease_info['_id'],
            "rating": 5
        }

        validated_detectionHistory = validate_detectionHistory(detectionHistory)
        done = mongo.db.detectionHistory.insert_one(validated_detectionHistory['data'])
        response = flask.jsonify({'ok': True, 'detection': detection,
                                'validated_detectionHistory ': validated_detectionHistory, "plant": plant_info,
                                "disease": disease_info})
        # response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        return response
    #     return jsonify({'ok': True, 'detection': detection,'validated_detectionHistory ':validated_detectionHistory,"plant":plant_info,"disease":"No disease found" if disease_info==None else disease_info}), 200
    except Exception as ex:
        import traceback
        traceback.print_exc()
        return flask.jsonify({'ok': False, 'message': 'Bad request parameters: {}'.format(ex)}), 500

    # print(ObjectId("623a3d74960a9f8526395e08"))
    # data = validate_detectionHistory({"createdAt":str(datetime.now()),"plantId":ObjectId("623a3d74960a9f8526395e08")})
    # if data['ok']:
    #     data = data['data']
    #     print(mongo.db.detectionHistory.find_one())
    #     print(type(mongo.db.detectionHistory.find_one()['_id']))
    #     mongo.db.detectionHistory.insert_one(data)
    #     return jsonify({'ok': True, 'message': 'User created successfully!','detectionHistory':data}), 200


@blueprint.route('/api/dl/live-details', methods=['POST'])
@cross_origin(supports_credentials=True)
def get_live_details():
    """
    Fetch live details from Plantix.net for a given disease
    Includes: trigger, organic control, chemical control, recommended products
    """
    try:
        data = request.get_json()
        disease_name = data.get('diseaseName')  # e.g., "Tomato Yellow Leaf Curl Virus"
        disease_label = data.get('diseaseLabel')  # e.g., "Tomato___Tomato_Yellow_Leaf_Curl_Virus"
        plant_name = data.get('plantName')
        
        if not disease_name:
            return flask.jsonify({
                'ok': False,
                'message': 'Disease name is required'
            }), 400
        
        # Use disease_label if provided, otherwise try to find it in database
        if not disease_label:
            disease_doc = mongo.db.disease.find_one({'name': {'$regex': disease_name.replace(' ', '_'), '$options': 'i'}})
            if disease_doc and 'name' in disease_doc:
                disease_label = disease_doc['name']
            else:
                # Fallback: construct a possible label
                disease_label = f"{plant_name}___{disease_name}".replace(' ', '_') if plant_name else disease_name.replace(' ', '_')
        
        # Scrape live details from Plantix.net
        scrape_result = scrape_plantix_details(disease_label)
        
        # Get product recommendations
        products = search_products_online(disease_name, plant_name)
        
        if scrape_result['success']:
            live_data = scrape_result['data']
            
            # Combine database data with live scraped data
            response_data = {
                'trigger': live_data.get('trigger', 'Information not available'),
                'organic_control': live_data.get('organic_control', 'Use neem oil or copper-based fungicides'),
                'chemical_control': live_data.get('chemical_control', 'Consult with local agricultural extension service'),
                'preventive_measures': live_data.get('preventive_measures', 'Practice crop rotation and maintain plant hygiene'),
                'recommended_products': products,
                'additional_info': live_data.get('additional_info', []),
                'source': 'Plantix.net (Live)',
                'fetched_at': str(datetime.now())
            }
            
            return flask.jsonify({
                'ok': True,
                'message': 'Live details fetched successfully',
                'data': response_data
            }), 200
        else:
            # Fallback to product recommendations only
            return flask.jsonify({
                'ok': True,
                'message': scrape_result['message'],
                'data': {
                    'trigger': 'Live data unavailable - check database',
                    'organic_control': 'General organic treatments available',
                    'chemical_control': 'Consult agricultural expert',
                    'recommended_products': products,
                    'source': 'Cached/Generated',
                    'fetched_at': str(datetime.now())
                }
            }), 200
            
    except Exception as ex:
        import traceback
        traceback.print_exc()
        return flask.jsonify({
            'ok': False,
            'message': f'Error fetching live details: {str(ex)}'
        }), 500
