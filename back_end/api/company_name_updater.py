from flask import Blueprint,jsonify,request
import jwt 
from databases import Company
from database_config import db_session
import re

company_name_updater_code = Blueprint('company_name_updater_code', __name__)

@company_name_updater_code.route('/updateCompanyName',methods=['POST'])
def update_db_config():
    try:
        dbname  = request.form['compname']
        dbconfig= request.form['comploc']
        dbid    = request.form['id']
        regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')

        dbconfigdata = Company.query.filter_by(id=dbid).first()
        if dbconfigdata:
            dbdatas = Company.query.all()
            dbconfignames = {}
            for i in dbdatas:
                dbconfignames[str(i.id)] = i.company_name
            old_db_config_name = dbconfignames[str(dbid)]
            db_config_name_list = list(dbconfignames.values())
            if regex.search(dbname) == None and dbname not in db_config_name_list:
                dbconfigdata = Company.query.filter_by(id=dbid).first()
                dbconfigdata.company_name = dbname
                dbconfigdata.company_location  = dbconfig
                db_session.commit()
                return jsonify({'success': True, 'message': 'DBUpdated'})
            elif dbname == old_db_config_name:
                dbconfigdata = Company.query.filter_by(id=dbid).first()
                dbconfigdata.company_name = dbname
                dbconfigdata.company_location  = dbconfig
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