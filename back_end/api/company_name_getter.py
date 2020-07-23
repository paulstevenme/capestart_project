from flask import Blueprint,jsonify,request
import jwt 
from databases import Company

company_name_getter_code = Blueprint('company_name_getter_code', __name__)

@company_name_getter_code.route('/getCompanyName',methods=['POST'])
def get_db_config():
    try:
        dbid    = request.form['id']
        dbconfigdata = Company.query.filter_by(id=dbid).first()
        if dbconfigdata:
            return jsonify({'success':True,'ID':dbconfigdata.id,
                            'company_name': dbconfigdata.company_name,'company_location':dbconfigdata.company_location})
        else:
            return jsonify({'success':False,'message':'ID does not exists!!!'})
    except jwt.ExpiredSignatureError:
        return jsonify({'success':False,'message':'Token Expired!!!'})
    except jwt.InvalidTokenError:
        return jsonify({'success':False,'message':'Invalid Token!!!'})
