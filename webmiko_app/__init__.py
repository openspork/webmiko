from flask import Flask
from flask_socketio import SocketIO
from webmiko_app.models import *

db.create_tables([Var, GlobalVar, Device, DeviceVar, LiveCommand, FavCommand], safe = True)

app = Flask(__name__)

@app.before_request
def _db_connect():
	db.connect()

@app.teardown_request
def _db_close(exc):
	if not db.is_closed():
		db.close()


app.config['SECRET_KEY'] = 'SECRET_KEY'

socketio = SocketIO()
socketio.init_app(app)

from webmiko_app import routes