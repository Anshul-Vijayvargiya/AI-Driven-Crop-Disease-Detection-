import sys
from ai_model import predict_disease

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_ai.py <image_path>")
        sys.exit(1)
        
    result = predict_disease(sys.argv[1])
    print(result)
