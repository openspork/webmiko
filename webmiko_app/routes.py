from threading import Lock
from flask import render_template
from webmiko_app import app
from webmiko_app import socketio
from flask_socketio import emit, join_room, leave_room, close_room, rooms, disconnect

thread = None
thread_lock = Lock()

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

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('my event', namespace='/test')
def test_message(message):
    print('received')
    emit('my response', {'data': message['data']})

@socketio.on('connect', namespace='/test')
def test_connect():
    print('Connected!')
    emit('my response', {'data': 'Connected'})
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
    emit('my_response', {'data': 'Connected', 'count': 0})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')