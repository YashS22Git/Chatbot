import ollama
import sys

def main():
    print("Checking for available models...")
    try:
        models_info = ollama.list()
        # ollama.list() returns a dict-like object (ListResponse) with a 'models' attribute or key
        # We access 'models' and iterate to get 'model' name
        # Handle different response structures if needed
        if hasattr(models_info, 'models'):
             models = [m.model for m in models_info.models]
        else:
             models = [m['model'] for m in models_info.get('models', [])]
        
    except Exception as e:
        # Fallback for safety
        print(f"Warning: Could not list models ({e}). Assuming 'llama3.2' or 'llama2' might be available.")
        models = []

        print(f"Error connecting to Ollama: {e}")
        print("Please ensure the Ollama app is running.")
        return

    if not models:
        print("No models found. Please pull a model first, e.g., 'ollama pull llama3.2'")
        return

    print(f"Available models: {', '.join(models)}")
    
    # Use the first available model or default to llama3.2 if present
    selected_model = 'llama3.2'
    if 'llama3.2' not in models and 'llama3.2:latest' not in models:
        selected_model = models[0]
    
    print(f"Starting chat with model: {selected_model}")
    print("Type 'quit' or 'exit' to end the chat.\n")

    history = []

    while True:
        try:
            user_input = input("You: ").strip()
            if user_input.lower() in ['quit', 'exit']:
                print("Goodbye!")
                break
            
            if not user_input:
                continue

            history.append({'role': 'user', 'content': user_input})

            print("Bot: ", end='', flush=True)
            stream = ollama.chat(
                model=selected_model,
                messages=history,
                stream=True,
            )

            response_content = ""
            for chunk in stream:
                content = chunk['message']['content']
                print(content, end='', flush=True)
                response_content += content
            
            print() # Newline after response
            history.append({'role': 'assistant', 'content': response_content})

        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")
            break

if __name__ == "__main__":
    main()
