from flask import Blueprint,jsonify,request
import jwt 
from databases import Company
from databases import Employees
from database_config import db_session
import json

company_name_deleter_code = Blueprint('company_name_deleter_code', __name__)

@company_name_deleter_code.route('/deleteCompanyName',methods=['POST'])
def delete_company_name():
    try:
        dbid    = request.form['id']
        dbconfigdata = Company.query.filter_by(id=dbid)
        employeecount_data = Employees.query.filter_by(company_id=dbid).count()
        if(employeecount_data ==0):
            Company.query.filter_by(id=dbid).delete()
            db_session.commit()
            return jsonify({ 'success':True,'message':'DataDeleted' }) 
        else:
            db_session.commit()
            return jsonify({ 'success':True,'message':'DeleteEmployee' }) 
    except Exception as e :
        return jsonify({'success':False,'message':e}),401