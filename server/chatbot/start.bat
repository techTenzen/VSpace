@echo off
echo Setting up Python environment...

:: Create virtual environment if it doesn't exist
if not exist venv\ (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate the virtual environment (Windows-style)
call venv\Scripts\activate

:: Install dependencies
echo Installing requirements...
pip install flask==2.2.2 flask-cors==3.0.10 python-dotenv==0.19.2 langchain-google-genai==0.0.4 langchain-community==0.0.7 gunicorn==20.1.0 Werkzeug==2.3.8 langchain==0.0.250

:: For FAISS, install a prebuilt version to avoid compilation issues
pip install faiss-cpu==1.7.4 --no-deps
pip install numpy pandas scikit-learn

:: Run the API
echo Starting chatbot API...
python api.py
