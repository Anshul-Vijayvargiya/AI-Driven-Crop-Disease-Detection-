const fs = require('fs');
const path = require('path');
const axios = require('axios');

const LOCALES_DIR = path.join(__dirname, 'src', 'locales');
const LANGUAGES = ['hi', 'mr', 'gu', 'pa', 'ta']; // English is 'en'

// The new English dictionary that has all the strings we want to make sure are present.
const newEnDict = {
  "landing": {
    "hero_title": "AI-Powered Crop Care for Every Farmer",
    "hero_subtitle": "Upload a photo of your crop to instantly detect diseases, get treatment recommendations, and check local market prices.",
    "get_started": "Get Started",
    "learn_more": "Learn More",
    "features_title": "Everything You Need in One Platform",
    "features_subtitle": "Comprehensive agricultural intelligence powered by artificial intelligence",
    "features": {
       "feature_1_title": "AI Disease Detection",
       "feature_1_desc": "Upload crop images and get instant disease diagnosis with 95%+ accuracy using advanced deep learning",
       "feature_2_title": "Smart Treatment Plans",
       "feature_2_desc": "Receive personalized treatment recommendations including organic, chemical, and preventive solutions",
       "feature_3_title": "Weather Intelligence",
       "feature_3_desc": "Real-time weather forecasts with crop-specific farming advice and severe weather alerts",
       "feature_4_title": "Live Market Rates",
       "feature_4_desc": "Access real-time Mandi prices across India with price trends to maximize your profits"
    },
    "benefits_title": "Why Choose AgriCare AI?",
    "benefits_subtitle": "Built by farmers, for farmers. Our AI technology brings enterprise-grade crop disease detection to your fingertips.",
    "benefits": {
       "benefit_1_title": "Lightning Fast",
       "benefit_1_desc": "Results in under 5 seconds",
       "benefit_2_title": "Expert Validated",
       "benefit_2_desc": "Verified by agricultural experts",
       "benefit_3_title": "24/7 Available",
       "benefit_3_desc": "Access anytime, anywhere",
       "benefit_4_title": "Always Learning",
       "benefit_4_desc": "AI improves continuously"
    },
    "testimonials_title": "Trusted by Farmers Across India",
    "testimonials_subtitle": "See what farmers are saying about AgriCare AI",
    "testimonials": {
      "t1_text": "AgriCare AI helped me detect late blight early and save my entire tomato crop. The treatment suggestions were spot on!",
      "t2_text": "Easy to use and very accurate. The weather alerts help me plan my farming activities better.",
      "t3_text": "The market price feature is amazing! I can now sell my produce at the right time for better prices."
    },
    "stats": {
      "stat_1_label": "Diseases Detected",
      "stat_2_label": "Accuracy Rate",
      "stat_3_label": "Farmers Helped",
      "stat_4_label": "Crops Saved"
    },
    "how_it_works_title": "Get Started in 3 Simple Steps",
    "how_it_works_subtitle": "It's as easy as 1-2-3",
    "steps": {
      "step_1_title": "Upload Photo",
      "step_1_desc": "Take a clear photo of the affected crop leaves",
      "step_2_title": "AI Analysis",
      "step_2_desc": "Our AI analyzes the image in under 5 seconds",
      "step_3_title": "Get Treatment",
      "step_3_desc": "Receive detailed treatment recommendations"
    },
    "cta_title": "Ready to Protect Your Crops?",
    "cta_subtitle": "Join 50,000+ farmers using AI to detect diseases early and save their harvests",
    "footer": "© 2026 AgriCare AI. All rights reserved.",
    "start_detection_now": "Start Detection Now",
    "sign_in": "Sign In",
    "learn_more_tech": "Learn more about our technology"
  },
  "disease_detection": {
    "title": "Detect Crop Diseases",
    "subtitle": "Upload a clear photo of your crop leaves for instant AI-powered disease detection",
    "no_image": "No image uploaded yet",
    "upload_success": "Image uploaded successfully",
    "take_photo": "Take Photo",
    "cancel": "Cancel",
    "drag_drop": "Drag and drop your image here",
    "or": "or",
    "upload_image": "Upload Image",
    "capture_image": "Capture Image",
    "supports": "Supports: JPG, PNG, JPEG (Max 10MB)",
    "enter_crop_name": "Enter crop name (optional)",
    "analyze_image": "Analyze Image",
    "best_results": "For Best Results",
    "tips": {
       "tip_1": "Take photos in natural daylight",
       "tip_2": "Focus on affected leaf areas",
       "tip_3": "Ensure image is clear and not blurry",
       "tip_4": "Include full leaf in frame",
       "tip_5": "Avoid shadows and reflections",
       "tip_6": "Take multiple angles if needed"
    }
  },
  "how_it_works": {
    "hero_title": "How Our AI Works",
    "hero_subtitle": "Understanding the technology behind intelligent crop disease detection",
    "try_it_now": "Try It Now",
    "process_title": "Simple 4-Step Process",
    "process_subtitle": "From image upload to actionable insights in seconds",
    "steps": {
      "step_1_title": "Upload Image",
      "step_1_desc": "Take a clear photo of the affected crop leaves using your camera or upload an existing image from your device.",
      "step_1_detail_1": "Supports JPG, PNG formats",
      "step_1_detail_2": "Maximum file size: 10MB",
      "step_1_detail_3": "Best results with high-quality images",
      "step_1_detail_4": "Multiple angles recommended",
      "step_2_title": "AI Analysis",
      "step_2_desc": "Our advanced deep learning model analyzes the image using computer vision to identify patterns and symptoms.",
      "step_2_detail_1": "Processes image in 2-5 seconds",
      "step_2_detail_2": "Compares with 10,000+ disease samples",
      "step_2_detail_3": "Uses convolutional neural networks",
      "step_2_detail_4": "Multi-layer pattern recognition",
      "step_3_title": "Disease Identification",
      "step_3_desc": "The AI identifies potential diseases with confidence scores and provides detailed information about the condition.",
      "step_3_detail_1": "Detects 150+ crop diseases",
      "step_3_detail_2": "95%+ accuracy rate",
      "step_3_detail_3": "Confidence score provided",
      "step_3_detail_4": "Severity level assessment",
      "step_4_title": "Get Recommendations",
      "step_4_desc": "Receive comprehensive treatment plans including immediate actions, organic solutions, and preventive measures.",
      "step_4_detail_1": "Immediate action steps",
      "step_4_detail_2": "Organic treatment options",
      "step_4_detail_3": "Chemical solutions (when needed)",
      "step_4_detail_4": "Prevention guidelines"
    },
    "tech_title": "Our Technology",
    "tech_subtitle": "Powered by cutting-edge AI and machine learning algorithms",
    "tech": {
      "tech_1_title": "Training Dataset",
      "tech_1_desc": "Trained on 50,000+ images of healthy and diseased crops from various regions and conditions.",
      "tech_2_title": "Deep Learning Models",
      "tech_2_desc": "Uses state-of-the-art CNN (Convolutional Neural Networks) architecture optimized for plant pathology.",
      "tech_3_title": "Accuracy Metrics",
      "tech_3_desc": "95%+ precision in disease detection, validated by agricultural experts and field testing.",
      "tech_4_title": "Continuous Learning",
      "tech_4_desc": "Model improves over time with new data, ensuring up-to-date disease identification."
    },
    "stats": {
      "stat_1_val": "50K+",
      "stat_1_label": "Training Images",
      "stat_2_val": "150+",
      "stat_2_label": "Diseases Detected",
      "stat_3_val": "95%",
      "stat_3_label": "Accuracy Rate",
      "stat_4_val": "<5s",
      "stat_4_label": "Analysis Time"
    },
    "faq_title": "Frequently Asked Questions",
    "faq_subtitle": "Everything you need to know about our AI system",
    "faqs": {
      "q1": "How accurate is the AI detection?",
      "a1": "Our AI model achieves 95%+ accuracy in detecting crop diseases. The model has been trained on over 50,000 images and validated by agricultural experts. However, for critical decisions, we always recommend consulting with local agricultural extension officers.",
      "q2": "What types of crops are supported?",
      "a2": "Currently, we support major crops including tomatoes, potatoes, rice, wheat, cotton, sugarcane, and various vegetables. We are continuously expanding our database to include more crop varieties.",
      "q3": "How quickly do I get results?",
      "a3": "Image analysis typically takes 2-5 seconds. The complete process from upload to receiving treatment recommendations usually takes less than 30 seconds.",
      "q4": "Can I use the app offline?",
      "a4": "Currently, an internet connection is required for image analysis as the AI processing happens on our servers. We are working on an offline mode for future releases.",
      "q5": "Is the treatment advice safe to follow?",
      "a5": "Yes, all treatment recommendations are based on established agricultural practices and reviewed by experts. However, always follow local regulations for pesticide use and consult with agricultural experts for severe infestations.",
      "q6": "How do I take the best photo for analysis?",
      "a6": "For best results: 1) Take photos in good natural light, 2) Focus on affected areas, 3) Avoid blurry images, 4) Include the full leaf, 5) Take multiple angles if possible."
    },
    "demo_title": "See It In Action",
    "demo_subtitle": "Watch how easy it is to detect crop diseases with AgriCare AI",
    "cta_title": "Ready to Get Started?",
    "cta_subtitle": "Join thousands of farmers using AI to protect their crops and increase yields",
    "start_detection": "Start Detection Now",
    "view_dashboard": "View Dashboard"
  }
};

async function translateText(text, targetLang) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await axios.get(url);
    if (res.data && res.data[0]) {
      return res.data[0].map(s => s[0]).join('');
    }
  } catch (e) {
    console.error(`Error translating "${text}" to ${targetLang}:`, e.message);
  }
  return text; // fallback to english
}

async function traverseAndTranslate(enObj, targetObj, targetLang) {
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      if (!targetObj[key]) targetObj[key] = {};
      await traverseAndTranslate(enObj[key], targetObj[key], targetLang);
    } else {
      if (!targetObj[key] || targetObj[key] === enObj[key]) { // if missing or untranslated
        console.log(`Translating to ${targetLang}: ${enObj[key]}`);
        targetObj[key] = await translateText(enObj[key], targetLang);
        // Wait 100ms to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
      }
    }
  }
}

async function run() {
  // Update en.json
  const enPath = path.join(LOCALES_DIR, 'en.json');
  let enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  
  // Merge new keys into en.json
  const mergeKeys = (src, dest) => {
    for (const key in src) {
      if (typeof src[key] === 'object' && src[key] !== null) {
        if (!dest[key]) dest[key] = {};
        mergeKeys(src[key], dest[key]);
      } else {
        if (!dest[key]) dest[key] = src[key];
      }
    }
  };
  mergeKeys(newEnDict, enJson);
  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));

  // Update other languages
  for (const lang of LANGUAGES) {
    const langPath = path.join(LOCALES_DIR, `${lang}.json`);
    let langJson = {};
    if (fs.existsSync(langPath)) {
      langJson = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
    }

    console.log(`\n=== Processing ${lang} ===`);
    // Create new structure based on english JSON, only translating if not already present
    // First, map existing keys so we don't overwrite user translations.
    await traverseAndTranslate(newEnDict, langJson, lang);

    fs.writeFileSync(langPath, JSON.stringify(langJson, null, 2));
  }
  
  console.log("Done!");
}

run();
