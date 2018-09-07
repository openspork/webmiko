from threading import Lock
from flask import render_template, send_from_directory
from webmiko_app import app, socketio
from flask_socketio import emit, join_room, leave_room, close_room, rooms, disconnect

thread = None
thread_lock = Lock()




@socketio.on('query', namespace='/test')
def test_message(message):
    print('Query received!')
    emit('server_heartbeat', {'data': message['data'], 'count': 123})

@socketio.on('config', namespace='/test')
def test_message(message):
    print('Config received!')    
    emit('server_heartbeat', {'data': message['data'], 'count': 123})
    

@socketio.on('inventory', namespace='/test')
def test_message(message):
    print('Inventory received!')
    print(message['data'])
    emit('inventory', {'data': 'success'})


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
        socketio.emit('server_heartbeat',
                      {'data': 'Server generated event', 'count': count},
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

















