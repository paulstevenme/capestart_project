from flask import Blueprint,jsonify,request
import jwt 
from databases import Employees

employee_name_getter_code = Blueprint('employee_name_getter_code', __name__)

@employee_name_getter_code.route('/getEmployeeName',methods=['POST'])
def get_db_config():
    try:
        dbid    = request.form['id']
        dbconfigdata = Employees.query.filter_by(id=dbid).first()
        if dbconfigdata:
            return jsonify({'success':True,'ID':dbconfigdata.id,
                            'employee_name': dbconfigdata.employee_name,'employee_salary':dbconfigdata.employee_salary})
        else:
            return jsonify({'success':False,'message':'ID does not exists!!!'})
    except jwt.ExpiredSignatureError:
        return jsonify({'success':False,'message':'Token Expired!!!'})
    except jwt.InvalidTokenError:
        return jsonify({'success':False,'message':'Invalid Token!!!'})
