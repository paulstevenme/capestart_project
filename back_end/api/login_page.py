import time
from datetime import datetime, timedelta
import jwt
from flask import Blueprint, Response, jsonify, request
from flask_cors import CORS, cross_origin

login_page_code = Blueprint('login_page_code', __name__)
@login_page_code.route('/login', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
def verify():
    try:
    
        username = request.form['username']
        password = request.form['password']
        if(username == "admin" and password == "admin"):
    
            # Default Settings
            
            return jsonify({'success':True,'message': 'Welcome {}'.format(username)})
        else:
            return jsonify({'success':False,'message': 'WrongPassword'})
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'message': 'WrongPassword'}), 201
