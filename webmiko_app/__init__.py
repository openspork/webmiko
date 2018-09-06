from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)

app.config['SECRET_KEY'] = 'SECRET_KEY'

socketio = SocketIO()
socketio.init_app(app)

from webmiko_app import routes