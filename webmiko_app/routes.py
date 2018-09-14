from threading import Lock
from time import mktime
from datetime import datetime, timezone
from flask import render_template, send_from_directory
from flask_socketio import emit, join_room, leave_room, close_room, rooms, disconnect

from webmiko_app import app, socketio
from utils.utils import js_hashcode


thread = None
thread_lock = Lock()

# Process inventory update
@socketio.on('inventory', namespace='/test')
def test_message(message):
    print('Inventory received!')
    print(message['data'])
    emit('inventory', {'data': 'success'})

# Process query submission
@socketio.on('query_req', namespace='/test')
def answer_query(message):
    query = message['query']
    hash = int(message['hash'])
    result = '<query result>'
    # Recompute query's hash and make sure it is correct
    if hash == js_hashcode(query):
        response = { 'hash': hash,'code': 0, 'result': result}
    else:
        response = { 'hash': hash, 'code': 1, 'result': result}

    print('Query response:' + str(response))
    emit('query_resp', response)





@socketio.on('config', namespace='/test')
def test_message(message):
    print('Config received!')    
    emit('log', {'data': message['data'], 'type': 'config'})

@socketio.on('connect', namespace='/test')
def test_connect():
    print('Client connected')
    start_heartbeat_thread()
    emit('server_heartbeat', {'data': 'Connected', 'count': 0})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')



def heartbeat_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(1)
        count += 1
        utc_datetime = datetime.now(timezone.utc)
        utc_datetime_for_js = int(mktime(utc_datetime.timetuple())) * 1000
        socketio.emit('heartbeat',
                      {'datetime': utc_datetime_for_js, 'count': count},
                      namespace='/test')


def start_heartbeat_thread():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=heartbeat_thread)

@app.route('/')
def index():
    return render_template('base.j2')

@app.route('/<path:path>')
def serve_static(path):
    print(app.root_path)
    send_from_directory('static',path)

















