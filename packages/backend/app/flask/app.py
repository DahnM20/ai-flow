from flask import Flask
from flask_cors import CORS
import os
import sys

if getattr(sys, "frozen", False):
    base_path = sys._MEIPASS
    build_dir = os.path.join(base_path, "build")
else:
    base_path = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(base_path, "..", "..", "..", "ui", "build")

app = Flask(__name__, static_folder=build_dir)
CORS(app)
