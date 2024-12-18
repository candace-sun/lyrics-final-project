from flask_login import UserMixin
from datetime import datetime
from . import db, login_manager

@login_manager.user_loader
def load_user(user_id):
    return User.objects(username=user_id).first()

class User(db.Document, UserMixin):
    username = db.StringField(required=True)
    email = db.StringField(required=True)
    password = db.StringField(required=True)

    # Returns unique string identifying our object
    def get_id(self):
        return self.username
    
    
class Snippet(db.Document):
    user = db.ReferenceField('User')
    artist = db.StringField(required=True)
    song = db.StringField(required=True)
    content = db.StringField(required=True)
    # date = db.StringField(required=True)