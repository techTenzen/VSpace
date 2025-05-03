@echo off
echo Setting up Python environment...

:: Create virtual environment
python -m venv venv

:: Activate the environment
call venv\Scripts\activate

:: Upgrade pip
python -m pip install --upgrade pip

:: Install pre-built binary packages
pip install --only-binary=:all: numpy pandas scikit-learn

:: Install other required packages
pip install flask==2.2.2 flask-cors==3.0.10 python-dotenv==0.19.2 langchain==0.0.250 Werkzeug==2.3.8

:: Install Google Gemini packages
pip install langchain-google-genai==0.0.4 langchain-community==0.0.7

:: Handle faiss-cpu separately (prebuilt wheel)
pip install --only-binary=:all: faiss-cpu==1.7.4

:: Run the API
echo Starting chatbot API...
python api.py
