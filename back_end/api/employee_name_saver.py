from flask import Blueprint,jsonify,request
import jwt 
from databases import Employees
from database_config import db_session
import re

employee_name_saver_code = Blueprint('employee_name_saver_code', __name__)

@employee_name_saver_code.route('/saveEmployeeDetails',methods=['POST'])
def save_db_config():
    try:
        empname  = request.form['empname']
        empsal = request.form['empsal']
        com_id = request.form['compid']
        regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
        employeeDetaildata = Employees.query.filter_by(
            employee_name=empname, company_id= com_id).first()
        if employeeDetaildata:
            db_session.commit()
            return jsonify({'success': False, 'message': 'EmployeeNameExists'})
        elif (regex.search(empname) == None):
            employeeDetaildata = Employees(company_id =com_id ,employee_name = empname,  employee_salary =empsal )
            db_session.add(employeeDetaildata)
            db_session.commit()
            return jsonify({'id': employeeDetaildata.id,'success':True,'message':'DataStoreSuccess'})
        else:
            return jsonify({'success': False, 'message': 'SpecialCharactersError'})
    except Exception as e:
        print(e)
        return jsonify({'success':False,'message':'Error'}),401
   