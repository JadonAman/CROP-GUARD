#!/usr/bin/env python3
"""
Database seeding script for Fasal-Mitra
Populates MongoDB with plant and disease data from CSV files
"""

import csv
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27018/fasal')
db = client['fasal']

# Clear existing data
print("Clearing existing data...")
db.plants.delete_many({})
db.disease.delete_many({})

# Seed plant data
print("\nSeeding plant data...")
plant_data = [
    {
        "commonName": "Tomato",
        "scientificName": "Solanum lycopersicum",
        "description": "The tomato is the edible berry of the plant Solanum lycopersicum commonly known as a tomato plant. Numerous varieties of the tomato plant are widely grown in temperate climates across the world with greenhouses allowing for the production of tomatoes throughout all seasons of the year.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/220px-Tomato_je.jpg"
    },
    {
        "commonName": "Potato",
        "scientificName": "Solanum tuberosum",
        "description": "The potato is a starchy tuber of the plant Solanum tuberosum and is a root vegetable native to the Americas. The plant is a perennial in the nightshade family Solanaceae.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/220px-Patates.jpg"
    },
    {
        "commonName": "Grape",
        "scientificName": "Vitis vinifera",
        "description": "A grape is a fruit botanically a berry of the deciduous woody vines of the flowering plant genus Vitis. Grapes can be eaten fresh as table grapes used for making wine jam grape juice jelly grape seed extract vinegar and grape seed oil or dried as raisins currants and sultanas.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Abhar-iran.JPG/170px-Abhar-iran.JPG"
    },
    {
        "commonName": "Corn_(maize)",
        "scientificName": "Zea mays convar. saccharata var. rugosa",
        "description": "Sweet corn is a variety of maize grown for human consumption with a high sugar content. Sweet corn is the result of a naturally occurring recessive mutation in the genes which control conversion of sugar to starch inside the endosperm of the corn kernel.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/VegCorn.jpg/220px-VegCorn.jpg"
    },
    {
        "commonName": "Pepper__bell",
        "scientificName": "Capsicum annuum",
        "description": "The bell pepper is the fruit of plants in the Grossum cultivar group of the species Capsicum annuum. Cultivars of the plant produce fruits in different colors including red yellow orange green white and purple.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Green-Yellow-Red-Pepper-2009.jpg/220px-Green-Yellow-Red-Pepper-2009.jpg"
    },
    {
        "commonName": "Apple",
        "scientificName": "Malus domestica",
        "description": "An apple is an edible fruit produced by an apple tree. Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/220px-Red_Apple.jpg"
    },
    {
        "commonName": "Cherry_(including_sour)",
        "scientificName": "Prunus avium",
        "description": "A cherry is the fruit of many plants of the genus Prunus and is a fleshy drupe. Commercial cherries are obtained from cultivars of several species such as the sweet Prunus avium and the sour Prunus cerasus.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Cherry_Stella444.jpg/220px-Cherry_Stella444.jpg"
    },
    {
        "commonName": "Peach",
        "scientificName": "Prunus persica",
        "description": "The peach is a deciduous tree native to the region of Northwest China between the Tarim Basin and the north slopes of the Kunlun Mountains where it was first domesticated and cultivated.",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Autumn_Red_peaches.jpg/220px-Autumn_Red_peaches.jpg"
    }
]

result = db.plants.insert_many(plant_data)
print(f"Inserted {len(result.inserted_ids)} plants")

# Seed disease data with treatment recommendations
print("\nSeeding disease data...")
disease_data = [
    {
        "name": "Tomato___Early_blight",
        "description": "Early blight is a common fungal disease affecting tomato plants. It's characterized by dark brown spots with concentric rings on older leaves.",
        "symptoms": "Dark brown spots with target-like concentric rings on lower older leaves. Lesions may also appear on stems and fruits.",
        "causes": "Caused by the fungus Alternaria solani. Spreads through water splash and wind.",
        "treatment": "Remove infected leaves. Apply fungicides containing chlorothalonil or copper. Ensure proper spacing for air circulation. Rotate crops annually.",
        "prevention": "Use disease-resistant varieties. Mulch around plants. Water at soil level to keep foliage dry. Practice crop rotation.",
        "imageUrl": "https://plantix.net/en/library/plant-diseases/100321/early-blight/"
    },
    {
        "name": "Tomato___Late_blight",
        "description": "Late blight is a devastating disease that can destroy entire tomato crops quickly. It's the same disease that caused the Irish potato famine.",
        "symptoms": "Gray-green water-soaked spots on leaves that quickly turn brown. White fuzzy growth on undersides. Can spread to stems and fruits.",
        "causes": "Caused by Phytophthora infestans. Thrives in cool wet conditions.",
        "treatment": "Remove and destroy infected plants immediately. Apply copper-based fungicides or chlorothalonil preventatively.",
        "prevention": "Plant resistant varieties. Ensure good air circulation. Avoid overhead watering. Monitor weather for favorable disease conditions.",
        "imageUrl": "https://plantix.net/en/library/plant-diseases/100046/tomato-late-blight/"
    },
    {
        "name": "Tomato___Leaf_Mold",
        "description": "Leaf mold is a fungal disease that primarily affects tomatoes grown in greenhouses or high humidity environments.",
        "symptoms": "Pale green or yellowish spots on upper leaf surfaces. Olive-green to brown velvety mold on lower leaf surfaces.",
        "causes": "Caused by the fungus Passalora fulva (formerly Cladosporium fulvum). Favored by high humidity and poor air circulation.",
        "treatment": "Remove infected leaves. Improve ventilation. Apply fungicides containing chlorothalonil or copper.",
        "prevention": "Maintain humidity below 85%. Ensure adequate spacing between plants. Use drip irrigation instead of overhead watering.",
        "imageUrl": "https://plantix.net/en/library/plant-diseases/100257/leaf-mold-of-tomato/"
    },
    {
        "name": "Tomato___Septoria_leaf_spot",
        "description": "Septoria leaf spot is a common fungal disease that can cause significant defoliation of tomato plants.",
        "symptoms": "Small circular spots with dark borders and gray centers. Tiny black dots (fungal fruiting bodies) visible in spot centers.",
        "causes": "Caused by Septoria lycopersici fungus. Spreads through water splash from rain or irrigation.",
        "treatment": "Remove infected leaves. Apply fungicides with chlorothalonil or copper compounds. Mulch to prevent soil splash.",
        "prevention": "Space plants properly for air circulation. Water at base of plants. Remove plant debris at season end. Rotate crops.",
        "imageUrl": "https://plantix.net/en/library/plant-diseases/100152/septoria-leaf-spot/"
    },
    {
        "name": "Tomato___Bacterial_spot",
        "description": "Bacterial spot is a serious disease that affects both leaves and fruits of tomato plants.",
        "symptoms": "Small dark brown spots with yellow halos on leaves. Spots may merge causing leaves to turn yellow and drop. Raised spots on fruits.",
        "causes": "Caused by Xanthomonas bacteria. Spreads through water, infected seeds, and contaminated tools.",
        "treatment": "Remove infected plants. Apply copper-based bactericides. Avoid working with plants when wet.",
        "prevention": "Use disease-free seeds and transplants. Avoid overhead irrigation. Disinfect tools. Practice 3-year crop rotation.",
        "imageUrl": "https://plantix.net/en/library/plant-diseases/300050/bacterial-spot-and-speck-of-tomato/"
    },
    {
        "name": "Tomato___healthy",
        "description": "Healthy tomato plant showing no signs of disease.",
        "symptoms": "Green vibrant leaves. Strong stem growth. No spots or lesions.",
        "causes": "No disease present.",
        "treatment": "No treatment needed. Continue regular care and monitoring.",
        "prevention": "Maintain good cultural practices: proper watering, fertilization, and plant spacing.",
        "imageUrl": ""
    },
    {
        "name": "Potato___Early_blight",
        "description": "Early blight of potato causes significant yield loss and tuber quality reduction.",
        "symptoms": "Dark brown spots with concentric rings on lower leaves. Leaves turn yellow and drop prematurely.",
        "causes": "Caused by Alternaria solani fungus. Warm humid weather favors disease development.",
        "treatment": "Apply fungicides containing chlorothalonil. Remove infected foliage. Hill soil around plants.",
        "prevention": "Plant certified disease-free seed potatoes. Ensure adequate nutrition especially nitrogen. Rotate crops.",
        "imageUrl": "https://plantix.net/en/library/plant-diseases/100321/early-blight/"
    },
    {
        "name": "Potato___Late_blight",
        "description": "Late blight is the most destructive disease of potato. Can cause total crop loss within days.",
        "symptoms": "Water-soaked lesions on leaves that turn brown. White mold on undersides. Stems turn black. Tubers develop brown rot.",
        "causes": "Phytophthora infestans. Cool wet weather is highly favorable.",
        "treatment": "Destroy infected plants. Apply protective fungicides before symptoms appear. Harvest tubers when mature.",
        "prevention": "Plant resistant varieties. Monitor disease forecasting systems. Destroy volunteer potatoes and cull piles.",
        "imageUrl": "https://plantix.net/en/library/plant-diseases/100040/potato-late-blight"
    },
    {
        "name": "Potato___healthy",
        "description": "Healthy potato plant with no disease symptoms.",
        "symptoms": "Dark green healthy foliage. Strong plant vigor. No lesions or spots.",
        "causes": "No disease present.",
        "treatment": "No treatment needed. Maintain good growing conditions.",
        "prevention": "Continue proper cultural practices and monitoring.",
        "imageUrl": ""
    }
]

result = db.disease.insert_many(disease_data)
print(f"Inserted {len(result.inserted_ids)} diseases")

# Verify data
print("\n=== Database Summary ===")
print(f"Total plants: {db.plants.count_documents({})}")
print(f"Total diseases: {db.disease.count_documents({})}")

print("\n✅ Database seeding completed successfully!")
print("\nSample plant:")
print(db.plants.find_one({"commonName": "Tomato"}))
print("\nSample disease:")
print(db.disease.find_one({"name": "Tomato___Early_blight"}))

client.close()
