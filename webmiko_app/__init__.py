from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'gjr39dkjn344_!67#'
socketio.init_app(app)


from webmiko_app import routes