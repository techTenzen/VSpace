from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
from embeddings import get_embedding_model
from vector_store import init_vector_store, add_json_to_vector, retrieve_json_from_vector
from json_processor import process_json
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Initialize LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    api_key=os.getenv("GEMINI_API_KEY")
)

# Embeddings model and session setup
embedding_model = get_embedding_model()
session_id = "json_chat_session"

# Vector store init
faculty_vector_store = init_vector_store(session_id + "_faculty", embedding_model)
fees_vector_store = init_vector_store(session_id + "_fees", embedding_model)

# Pre-load JSON files
def load_json_data(file_path, vector_store, label):
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            json_data = json.load(f)
            processed = process_json(json_data)
            add_json_to_vector(session_id + f"_{label}", processed)
            print(f"✅ Loaded {file_path} for {label}")
    else:
        print(f"❌ File {file_path} not found!")

# Update these paths to reflect your data file locations
# Change these lines
load_json_data("data/sample.json", faculty_vector_store, "faculty")
load_json_data("data/fees.json", fees_vector_store, "fees")

# Handle chatbot requests
@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_input = request.json.get("message", "")

        if not user_input.strip():
            return jsonify({"response": "Please enter a valid message."})

        # Greeting shortcut
        greetings = ["hi", "hello", "hey", "good morning", "good evening"]
        if user_input.lower().strip() in greetings:
            return jsonify({
                "response": "Hello! 😊 Ask me about faculty info or college fees."
            })

        # Determine query type
        if any(k in user_input.lower() for k in ["fee", "tuition", "cost", "hostel"]):
            data_type = "fees"
            context = retrieve_json_from_vector(session_id + "_fees", user_input)
        elif any(k in user_input.lower() for k in ["faculty", "professor", "teacher", "department", "office", "cabin"]):
            data_type = "faculty"
            context = retrieve_json_from_vector(session_id + "_faculty", user_input)
        else:
            data_type = "general"
            context = "This is a general knowledge question."

        system_prompt = f"""
        You are a helpful assistant for VIT-AP college-related queries.
        You have access to:
        - Faculty Details (`sample.json`)
        - Fee Structure (`fees.json`)
        - General AI knowledge

        User Question: {user_input}
        Context from {data_type} data: {context}

        Provide a helpful response.
        """

        response = llm.invoke(system_prompt)
        return jsonify({"response": response.content})

    except Exception as e:
        print("❌ Error in /chat:", str(e))
        return jsonify({"response": "Something went wrong. Please try again."})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
