from flask import Blueprint,jsonify,request
import jwt 
from databases import Company
from database_config import db_session
import re

company_name_saver_code = Blueprint('company_name_saver_code', __name__)

@company_name_saver_code.route('/saveCompanyDetails',methods=['POST'])
def save_db_config():
    try:

        compname  = request.form['compname']
        comloc = request.form['comploc']
        regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
        companyDetaildata = Company.query.filter_by(
            company_name=compname).first()
        if companyDetaildata:
            db_session.commit()
            return jsonify({'success': False, 'message': 'CompanyNameExists'})
        elif (regex.search(compname) == None):
            companyDetaildata = Company(company_name = compname, company_location =comloc)
            db_session.add(companyDetaildata)
            db_session.commit()
            return jsonify({'id': companyDetaildata.id,'success':True,'message':'DataStoreSuccess'})
        else:
            return jsonify({'success': False, 'message': 'SpecialCharactersError'})
    except Exception as e:
        print(e)
        return jsonify({'success':False,'message':'Error'}),401
   