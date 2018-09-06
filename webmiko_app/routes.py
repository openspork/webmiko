from threading import Lock
from flask import render_template, send_from_directory
from webmiko_app import app, socketio
from flask_socketio import emit, join_room, leave_room, close_room, rooms, disconnect

thread = None
thread_lock = Lock()




@socketio.on('query', namespace='/test')
def test_message(message):
    print('Query sent!')
    emit('my_response', {'data': message['data'], 'count': 123})

@socketio.on('config', namespace='/test')
def test_message(message):
    print('Config sent!')
    emit('my_response', {'data': message['data'], 'count': 123})

@socketio.on('connect', namespace='/test')
def test_connect():
    print('Client connected')
    emit('my_response', {'data': 'Connected', 'count': 0})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')




def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(10)
        count += 1
        print(count)
        socketio.emit('my_response',
                      {'data': 'Server generated event', 'count': count},
                      namespace='/test')
def start_background_thread():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)

@app.route('/')
def index():
    return render_template('base.j2')

@app.route('/<path:path>')
def serve_static(path):
    print(app.root_path)
    send_from_directory('static',path)

















