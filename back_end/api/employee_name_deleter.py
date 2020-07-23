from flask import Blueprint,jsonify,request
import jwt 
from databases import Employees
from database_config import db_session
import json

employee_name_deleter_code = Blueprint('employee_name_deleter_code', __name__)

@employee_name_deleter_code.route('/deleteEmployeeName',methods=['POST'])
def delete_employee_name():
    try:
        dbid    = request.form['id']
        dbconfigdata = Employees.query.filter_by(id=dbid)
        Employees.query.filter_by(id=dbid).delete()
        db_session.commit()
        return jsonify({ 'success':True,'message':'DataDeleted' }) 
    except Exception as e :
        return jsonify({'success':False,'message':e}),401