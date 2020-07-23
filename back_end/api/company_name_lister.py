from flask import Blueprint, jsonify, request
import jwt
from databases import Company
from databases import Employees
import json

company_name_lister_code = Blueprint('company_name_lister_code', __name__)


@company_name_lister_code.route('/listCompanyNames', methods=['POST'])
def list_company_name():
    try:
        d = {}
        db_data = []
        page = request.form['page']
        custom_page = request.form['custom_page']
        if custom_page == "":
            custom_page = 10
        
        total_db_datas = Company.query.count()
        companyDetailData = Company.query.all()
       
        for i in companyDetailData:
            employeecount_data = Employees.query.filter_by(company_id=i.id).count()
            dd = {'id': i.id, 'name': i.company_name, 'data': i.company_location, 'employee_count': employeecount_data}
            db_data.append(dd)
        pages = [db_data[x:x+int(custom_page)]for x in range(0, len(db_data), int(custom_page))]
        count = 1
        for i in pages:
            d[count] = i
            count = count + 1
        if int(page) < len(d):
            next_page = True
        else:
            next_page = False
        try:
            db_data = d[int(page)]
            page_numbers_list = []
            for i in range((len(d)+1)):
                if i != 0:
                    page_numbers_list.append(i)
            prev_page_click = int(page) - 1
            next_page_click = int(page) + 1
            if next_page_click >= len(d):
                next_page_click = len(d)

            return jsonify({'success':True,'data': d[int(page)], 'total_pages': len(d), 'next_page': next_page, 'custom_page': int(custom_page), 'page_number': int(page), 'page_number_list': page_numbers_list, 'prev_page_click': prev_page_click, 'next_page_click': next_page_click, 'total_data': total_db_datas})
        except:
            return jsonify({'success': False, 'data': [], 'total_pages': 1, 'next_page': next_page, 'custom_page': int(custom_page), 'page_number': int(page), 'page_number_list': [1]})
    except:
        return jsonify({'success': False, 'message': 'Token Expired!!!'})

