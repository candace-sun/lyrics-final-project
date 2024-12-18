from flask import Blueprint, redirect, url_for, render_template, flash, request
from flask_login import current_user, login_required, login_user, logout_user
import base64
from io import BytesIO
from .. import bcrypt
from werkzeug.utils import secure_filename
from ..forms import RegistrationForm, LoginForm #, UpdateUsernameForm, UpdateProfilePicForm
from ..models import User
import io

users = Blueprint("users", __name__)

# @users.route("/logout")
# @login_required
# def logout():
#     logout_user()
#     return redirect(url_for('lyrics.index'))

@users.route("/logout/<username>")
def logout(username):
    user = User.objects(username=username).first()
    if user:
        logout_user()
    
    return "" + str(user.is_authenticated)

@users.route("/is_logged_in/<username>", methods=["GET"])
def is_logged_in(username):
    user = User.objects(username=username).first()
    if user:
        return "" + str(user.is_authenticated)
    else: 
        return "False"
    
@users.route("/get_email/<username>", methods=["GET"])
def get_email(username):
    user = User.objects(username=username).first()
    if user:
        return "" + str(user.email)
    else: 
        return "False"
    
@users.route("/update_email", methods=["POST"])
def update_email():
        content = request.json
        user = User.objects(username=content['username']).first()
        email = content['email']
        if user:
            user.email = email
            user.save()
            return "True"
        
        return "False"

@users.route("/login", methods=["GET", "POST"])
def login():
    
    if request.method == 'POST': #wont need this later, just make it POST
        content = request.json
        user = User.objects(username=content['username']).first()
        if (user is not None and 
 bcrypt.check_password_hash(user.password, content['password'])): 
            login_user(user)
            return "True"
        return "False"

#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.objects(username=form.username.data).first()

#         if (user is not None and 
#  bcrypt.check_password_hash(user.password, form.password.data)): 
#             login_user(user)
#             return redirect(url_for('lyrics.index'))

#     if request.method == 'POST': # ? tbh ?
#         flash("Login failed. Check your username and/or password")

#     return render_template('login.html', form=form)

    return "hello"


@users.route("/register", methods=["GET", "POST"])
def register():    
    if request.method == 'POST': #wont need this later, just make it POST
        content = request.json
        # will need to validate the input rip
        
        check_user = User.objects(username=content['username']).first()
        email = User.objects(email=content['email']).first()
        if check_user or email:
            return "False"
        
        hashed = bcrypt.generate_password_hash(content['password']) # fix
        user = User(username=content['username'], 
                    email=content['email'], password=hashed)
        user.save()
        return "True"

    # form = RegistrationForm()
    # if form.validate_on_submit():
    #     hashed = bcrypt.generate_password_hash(form.password.data) # fix
    #     user = User(username=form.username.data, 
    #                 email=form.email.data, password=hashed)
    #     user.save()
    #     return redirect(url_for('users.login'))
    
    
    # return render_template('register.html', title='Register', form=form)

