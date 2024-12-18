from flask import Blueprint, request, jsonify
from ..models import User, Snippet
import json

snippets = Blueprint("snippets", __name__)


@snippets.route("/get-snips/<username>", methods=["GET"])
def get_snips(username):
    user = User.objects(username=username).first()
    if user:
        snips = Snippet.objects(user=user)
        return jsonify(snips)
    
    return "False"

@snippets.route("/delete-snip", methods=["POST", "GET"])
def delete_snip():
    content = request.json
    snip = content['content']
    ret = Snippet.objects(content=snip).first()
    ret.delete()
    return jsonify(ret)


@snippets.route("/save-snip", methods=["POST"])
def save_snip():
    # if current_user.is_authenticated:
    #     return redirect(url_for('lyrics.index'))
    
    content = request.json
    user = content['username']
    snip = content['snip']
    artist = content['artist']
    song = content['song']
    
    user = User.objects(username=content['username']).first()
    if (user is not None):
            
        snippet = Snippet(user=user, artist=artist, song=song, content=snip)
        snippet.save()
        return "True"
    
    
    # if request.method == 'POST': #wont need this later, just make it POST
    #     content = request.json
    #     # will need to validate the input rip
        
    #     check_user = User.objects(username=content['username']).first()
    #     email = User.objects(email=content['email']).first()
    #     if check_user or email:
    #         return "False"
        
    #     hashed = bcrypt.generate_password_hash(content['password']) # fix
    #     user = User(username=content['username'], 
    #                 email=content['email'], password=hashed)
    #     user.save()
        return "False"