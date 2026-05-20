from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

def seed_crops():
    """Seed the database with sample crop data"""
    client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/complete_ui_prompts'))
    db = client.get_database()
    
    # Sample crops data
    sample_crops = [
        {
            'name': 'Tomato',
            'scientific_name': 'Solanum lycopersicum',
            'category': 'vegetable',
            'variety': 'Cherry',
            'planting_season': ['spring', 'summer'],
            'harvest_season': ['summer', 'fall'],
            'growth_days': 70,
            'water_requirements': 'medium',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'loamy',
            'ph_range': {'min': 6.0, 'max': 6.8},
            'nutritional_info': {
                'calories': 18,
                'vitamin_c': '21% DV',
                'vitamin_a': '20% DV',
                'potassium': '8% DV'
            },
            'pests': ['aphids', 'tomato hornworm', 'whiteflies'],
            'diseases': ['blight', 'powdery mildew', 'blossom end rot'],
            'description': 'Tomatoes are juicy, sweet fruits that are typically red when ripe. They are rich in vitamins and antioxidants.',
            'growing_tips': [
                'Plant in well-draining soil',
                'Provide support for vines',
                'Water consistently but avoid wetting leaves'
            ],
            'harvesting_tips': [
                'Harvest when fully colored but still firm',
                'Twist gently to remove from vine'
            ],
            'storage_conditions': {
                'temperature': '10-15°C',
                'humidity': '90-95%',
                'shelf_life': '1-2 weeks'
            },
            'yield_per_hectare': {'min': 20, 'max': 50, 'unit': 'tons'},
            'climate_zones': ['temperate', 'subtropical'],
            'companion_plants': ['basil', 'marigold', 'carrot'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Rice',
            'scientific_name': 'Oryza sativa',
            'category': 'grain',
            'variety': 'Basmati',
            'planting_season': ['monsoon'],
            'harvest_season': ['winter'],
            'growth_days': 120,
            'water_requirements': 'high',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'clay_loam',
            'ph_range': {'min': 5.5, 'max': 6.5},
            'nutritional_info': {
                'calories': 130,
                'carbohydrates': '28g',
                'protein': '2.7g',
                'fiber': '0.4g'
            },
            'pests': ['rice stem borer', 'brown plant hopper'],
            'diseases': ['rice blast', 'bacterial leaf blight'],
            'description': 'Rice is a staple food grain that is cultivated in flooded fields called paddies.',
            'growing_tips': [
                'Requires standing water during growth',
                'Transplant seedlings after 25-30 days',
                'Maintain water level at 2-3 inches'
            ],
            'harvesting_tips': [
                'Harvest when grains are hard and yellow',
                'Cut stalks and dry before threshing'
            ],
            'storage_conditions': {
                'temperature': '10-15°C',
                'humidity': '12-14% moisture',
                'shelf_life': '1-2 years'
            },
            'yield_per_hectare': {'min': 4, 'max': 8, 'unit': 'tons'},
            'climate_zones': ['tropical', 'subtropical'],
            'companion_plants': ['azolla', 'duckweed'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Apple',
            'scientific_name': 'Malus domestica',
            'category': 'fruit',
            'variety': 'Fuji',
            'planting_season': ['spring'],
            'harvest_season': ['fall'],
            'growth_days': 180,
            'water_requirements': 'medium',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'well_drained',
            'ph_range': {'min': 6.0, 'max': 7.0},
            'nutritional_info': {
                'calories': 52,
                'vitamin_c': '7% DV',
                'fiber': '2.4g',
                'antioxidants': 'high'
            },
            'pests': ['codling moth', 'aphids', 'apple maggot'],
            'diseases': ['apple scab', 'fire blight', 'powdery mildew'],
            'description': 'Apples are crisp, sweet fruits that grow on trees. They come in many varieties with different flavors and textures.',
            'growing_tips': [
                'Plant in well-draining soil',
                'Prune annually for better yield',
                'Thin fruits for larger size'
            ],
            'harvesting_tips': [
                'Harvest when background color changes from green to yellow',
                'Twist apple upward with a quick pull'
            ],
            'storage_conditions': {
                'temperature': '0-4°C',
                'humidity': '90-95%',
                'shelf_life': '3-12 months'
            },
            'yield_per_hectare': {'min': 15, 'max': 30, 'unit': 'tons'},
            'climate_zones': ['temperate'],
            'companion_plants': ['chives', 'nasturtium', 'garlic'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Wheat',
            'scientific_name': 'Triticum aestivum',
            'category': 'grain',
            'variety': 'Hard Red',
            'planting_season': ['fall', 'spring'],
            'harvest_season': ['summer'],
            'growth_days': 110,
            'water_requirements': 'low',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'clay_loam',
            'ph_range': {'min': 6.0, 'max': 7.5},
            'nutritional_info': {
                'calories': 327,
                'protein': '13g',
                'fiber': '11g',
                'iron': '20% DV'
            },
            'pests': ['wheat stem sawfly', 'aphids'],
            'diseases': ['rust', 'powdery mildew', 'fusarium head blight'],
            'description': 'Wheat is a cereal grain that is ground into flour for bread, pasta, and other food products.',
            'growing_tips': [
                'Plant in well-prepared seedbed',
                'Use certified disease-free seeds',
                'Rotate crops to prevent disease buildup'
            ],
            'harvesting_tips': [
                'Harvest when kernels are hard and dry',
                'Combine when moisture content is 13-15%'
            ],
            'storage_conditions': {
                'temperature': '15°C or lower',
                'humidity': '12-14% moisture',
                'shelf_life': '1-3 years'
            },
            'yield_per_hectare': {'min': 2, 'max': 5, 'unit': 'tons'},
            'climate_zones': ['temperate'],
            'companion_plants': ['clover', 'vetch'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Carrot',
            'scientific_name': 'Daucus carota',
            'category': 'vegetable',
            'variety': 'Nantes',
            'planting_season': ['spring', 'fall'],
            'harvest_season': ['summer', 'winter'],
            'growth_days': 75,
            'water_requirements': 'medium',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'sandy_loam',
            'ph_range': {'min': 6.0, 'max': 6.8},
            'nutritional_info': {
                'calories': 41,
                'vitamin_a': '334% DV',
                'vitamin_k': '16% DV',
                'fiber': '2.8g'
            },
            'pests': ['carrot rust fly', 'aphids'],
            'diseases': ['leaf blight', 'root knot'],
            'description': 'Carrots are root vegetables known for their bright orange color and high vitamin A content.',
            'growing_tips': [
                'Plant in loose, stone-free soil',
                'Thin seedlings to prevent crowding',
                'Keep soil consistently moist'
            ],
            'harvesting_tips': [
                'Harvest when roots reach desired size',
                'Loosen soil before pulling'
            ],
            'storage_conditions': {
                'temperature': '0-4°C',
                'humidity': '95-98%',
                'shelf_life': '4-6 months'
            },
            'yield_per_hectare': {'min': 25, 'max': 40, 'unit': 'tons'},
            'climate_zones': ['temperate', 'subtropical'],
            'companion_plants': ['tomato', 'rosemary', 'sage'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Corn',
            'scientific_name': 'Zea mays',
            'category': 'grain',
            'variety': 'Sweet Corn',
            'planting_season': ['spring'],
            'harvest_season': ['summer'],
            'growth_days': 80,
            'water_requirements': 'medium',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'well_drained',
            'ph_range': {'min': 5.8, 'max': 7.0},
            'nutritional_info': {
                'calories': 86,
                'carbohydrates': '19g',
                'fiber': '2g',
                'vitamin_c': '11% DV'
            },
            'pests': ['corn earworm', 'armyworm'],
            'diseases': ['smut', 'rust', 'leaf blight'],
            'description': 'Corn is a cereal grain that produces ears of kernels on tall grass-like plants.',
            'growing_tips': [
                'Plant in blocks for better pollination',
                'Provide consistent moisture during tasseling',
                'Side-dress with nitrogen when plants are knee-high'
            ],
            'harvesting_tips': [
                'Harvest when silks turn brown and kernels release milky sap',
                'Harvest in morning for best flavor'
            ],
            'storage_conditions': {
                'temperature': '0°C',
                'humidity': '95-98%',
                'shelf_life': '1-2 weeks fresh'
            },
            'yield_per_hectare': {'min': 8, 'max': 12, 'unit': 'tons'},
            'climate_zones': ['temperate', 'tropical'],
            'companion_plants': ['beans', 'squash', 'cucumber'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Potato',
            'scientific_name': 'Solanum tuberosum',
            'category': 'vegetable',
            'variety': 'Russet',
            'planting_season': ['spring'],
            'harvest_season': ['summer', 'fall'],
            'growth_days': 90,
            'water_requirements': 'medium',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'loamy',
            'ph_range': {'min': 5.0, 'max': 6.0},
            'nutritional_info': {
                'calories': 77,
                'potassium': '15% DV',
                'vitamin_c': '24% DV',
                'vitamin_b6': '15% DV'
            },
            'pests': ['colorado potato beetle', 'aphids'],
            'diseases': ['late blight', 'early blight', 'scab'],
            'description': 'Potatoes are tuber vegetables that are a staple food in many cultures worldwide.',
            'growing_tips': [
                'Plant certified seed potatoes',
                'Hill soil around plants as they grow',
                'Keep soil consistently moist but not waterlogged'
            ],
            'harvesting_tips': [
                'Harvest when vines die back',
                'Cure potatoes before storage'
            ],
            'storage_conditions': {
                'temperature': '4-10°C',
                'humidity': '90-95%',
                'shelf_life': '2-12 months'
            },
            'yield_per_hectare': {'min': 20, 'max': 35, 'unit': 'tons'},
            'climate_zones': ['temperate'],
            'companion_plants': ['horseradish', 'beans', 'corn'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Strawberry',
            'scientific_name': 'Fragaria × ananassa',
            'category': 'fruit',
            'variety': 'Albion',
            'planting_season': ['spring'],
            'harvest_season': ['spring', 'summer'],
            'growth_days': 60,
            'water_requirements': 'medium',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'sandy_loam',
            'ph_range': {'min': 5.5, 'max': 6.5},
            'nutritional_info': {
                'calories': 32,
                'vitamin_c': '97% DV',
                'manganese': '24% DV',
                'fiber': '2g'
            },
            'pests': ['spider mites', 'slugs', 'birds'],
            'diseases': ['powdery mildew', 'gray mold'],
            'description': 'Strawberries are sweet, red berries that grow on low-lying plants and are rich in vitamin C.',
            'growing_tips': [
                'Plant in raised beds for better drainage',
                'Use mulch to keep fruits clean',
                'Renovate beds after harvest'
            ],
            'harvesting_tips': [
                'Harvest when fully red',
                'Pick with caps attached',
                'Harvest every 2-3 days during peak season'
            ],
            'storage_conditions': {
                'temperature': '0°C',
                'humidity': '90-95%',
                'shelf_life': '3-7 days'
            },
            'yield_per_hectare': {'min': 15, 'max': 30, 'unit': 'tons'},
            'climate_zones': ['temperate', 'subtropical'],
            'companion_plants': ['borage', 'lettuce', 'spinach'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Cabbage',
            'scientific_name': 'Brassica oleracea',
            'category': 'vegetable',
            'variety': 'Green',
            'planting_season': ['spring', 'fall'],
            'harvest_season': ['summer', 'winter'],
            'growth_days': 85,
            'water_requirements': 'medium',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'fertile',
            'ph_range': {'min': 6.0, 'max': 7.5},
            'nutritional_info': {
                'calories': 25,
                'vitamin_c': '60% DV',
                'vitamin_k': '85% DV',
                'fiber': '2.5g'
            },
            'pests': ['cabbage worm', 'aphids', 'flea beetles'],
            'diseases': ['black rot', 'clubroot'],
            'description': 'Cabbage is a leafy green vegetable that forms a dense head and is rich in vitamins C and K.',
            'growing_tips': [
                'Plant in fertile, well-draining soil',
                'Provide consistent moisture',
                'Use row covers to prevent pest damage'
            ],
            'harvesting_tips': [
                'Harvest when heads feel firm and solid',
                'Cut at base with sharp knife'
            ],
            'storage_conditions': {
                'temperature': '0°C',
                'humidity': '95-98%',
                'shelf_life': '3-4 months'
            },
            'yield_per_hectare': {'min': 25, 'max': 40, 'unit': 'tons'},
            'climate_zones': ['temperate'],
            'companion_plants': ['dill', 'celery', 'onions'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        },
        {
            'name': 'Grapes',
            'scientific_name': 'Vitis vinifera',
            'category': 'fruit',
            'variety': 'Thompson Seedless',
            'planting_season': ['spring'],
            'harvest_season': ['late summer', 'fall'],
            'growth_days': 150,
            'water_requirements': 'low',
            'sunlight_requirements': 'full_sun',
            'soil_type': 'well_drained',
            'ph_range': {'min': 5.5, 'max': 6.5},
            'nutritional_info': {
                'calories': 69,
                'vitamin_c': '18% DV',
                'vitamin_k': '18% DV',
                'antioxidants': 'high'
            },
            'pests': ['grape phylloxera', 'leafhoppers'],
            'diseases': ['powdery mildew', 'downy mildew', 'black rot'],
            'description': 'Grapes are juicy berries that grow in clusters on woody vines, used for eating fresh, making wine, or drying as raisins.',
            'growing_tips': [
                'Provide strong trellis system',
                'Prune heavily in winter',
                'Thin clusters for better quality'
            ],
            'harvesting_tips': [
                'Harvest when sugar content is optimal',
                'Taste test for ripeness',
                'Harvest in cool morning hours'
            ],
            'storage_conditions': {
                'temperature': '-1 to 0°C',
                'humidity': '90-95%',
                'shelf_life': '1-6 months'
            },
            'yield_per_hectare': {'min': 10, 'max': 20, 'unit': 'tons'},
            'climate_zones': ['temperate', 'mediterranean'],
            'companion_plants': ['hyssop', 'basil', 'oregano'],
            'user_id': 'system',
            'is_public': True,
            'verified': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    ]
    
    # Clear existing crops and insert new ones
    db.crops.delete_many({})
    result = db.crops.insert_many(sample_crops)
    
    print(f"Successfully seeded {len(result.inserted_ids)} crops into the database")
    return result.inserted_ids

if __name__ == '__main__':
    seed_crops()