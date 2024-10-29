# main.py
from flask import Flask
from routes import auth_bp
from flask_cors import CORS

from config import FRONTEND_URI 

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

app.register_blueprint(auth_bp, url_prefix='/auth')

if __name__ == '__main__':
    app.run(debug=True)
