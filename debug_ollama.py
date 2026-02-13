
import ollama
try:
    models_info = ollama.list()
    print(f"Type: {type(models_info)}")
    print(f"Content: {models_info}")
    
    # Simulate server logic
    if hasattr(models_info, 'models'):
        print("Has 'models' attribute")
        models = [m.model for m in models_info.models]
    else:
        print("Is dict (or other)")
        models = [m['model'] for m in models_info.get('models', [])]
    
    print(f"Extracted models: {models}")

except Exception as e:
    print(f"Error: {e}")
