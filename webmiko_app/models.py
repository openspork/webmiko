from peewee import *

db = SqliteDatabase('webmiko.db')

class BaseModel(Model):
    class Meta:
        database = db

class Var(BaseModel):
    key = CharField()
    value = CharField()

class GlobalVar(Var):
    global_var = ForeignKeyField(BaseModel, backref = 'vars')

class Device(BaseModel):
    name = CharField()

class DeviceVar(Var):
    device = ForeignKeyField(Device, backref = 'device_vars')

class LiveCommand(BaseModel):
    command = CharField()
    date_issued = DateTimeField()
    success = BooleanField()

class FavCommand(BaseModel):
    command = CharField()
    uses = IntegerField()