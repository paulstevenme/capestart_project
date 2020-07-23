from flask import Blueprint,jsonify,request
import jwt 
from databases import Employees
from database_config import db_session
import re

employee_name_updater_code = Blueprint('employee_name_updater_code', __name__)

@employee_name_updater_code.route('/updateEmployeeName',methods=['POST'])
def update_db_config():
    try:
        dbname  = request.form['empname']
        dbconfig= request.form['empsal']
        dbid    = request.form['id']
        regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')

        dbconfigdata = Employees.query.filter_by(id=dbid).first()
        if dbconfigdata:
            dbdatas = Employees.query.all()
            dbconfignames = {}
            for i in dbdatas:
                dbconfignames[str(i.id)] = i.employee_name
            old_db_config_name = dbconfignames[str(dbid)]
            db_config_name_list = list(dbconfignames.values())
            if regex.search(dbname) == None and dbname not in db_config_name_list:
                dbconfigdata = Employees.query.filter_by(id=dbid).first()
                dbconfigdata.employee_name = dbname
                dbconfigdata.employee_salary  = dbconfig
                db_session.commit()
                return jsonify({'success': True, 'message': 'DBUpdated'})
            elif dbname == old_db_config_name:
                dbconfigdata = Employees.query.filter_by(id=dbid).first()
                dbconfigdata.employee_name = dbname
                dbconfigdata.employee_salary  = dbconfig
                db_session.commit()
                return jsonify({'success': True, 'message': 'DBUpdated'})
            elif regex.search(dbname) != None:
                return jsonify({'success': True, 'message': 'SpecialCharactersError'})
            else:
                return jsonify({'success': True, 'message': 'DBNameExists'})
        else:
            db_session.commit()
            return jsonify({'success': False, 'message': 'ID does not exists'})
    except jwt.ExpiredSignatureError:
        return jsonify({'success':False,'message':'Token Expired!!!'}),401
    except jwt.InvalidTokenError:
        return jsonify({'success':False,'message':'Invalid Token!!!'}),401