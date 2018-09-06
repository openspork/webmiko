class BaseModel(Model):
    class Meta:
        database = db

class Var(BaseModel):
	key = CharField(unique=True)
	value = CharField()

class GlobalVar(Var):
	global_var = ForeignKeyField(BaseModel, backref = 'vars')


class Device(BaseModel):
	dev_type = CharField()
    ip_addr = CharField()
    username = CharField()
    password = CharField()

class DeviceVar(Var):
	device_var = ForeignKeyField(Device, backref = 'device_vars')
	key = CharField(unique=True)
	value = CharField()

class LiveCommand(BaseModel):
    command = CharField()
    date_issued = DateTimeField()
    success = BooleanField()

class FavCommand(BaseModel):
	command = CharField()
	uses = IntField()