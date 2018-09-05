from flask import Flask

app = Flask(__name__)

from webmiko_app import routes