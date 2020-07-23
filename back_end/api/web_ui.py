from flask import Flask
from flask_cors import CORS
from login_page import login_page_code
from company_name_saver import company_name_saver_code
from company_name_lister import company_name_lister_code
from company_name_deleter import company_name_deleter_code
from company_name_getter import company_name_getter_code
from company_name_updater import company_name_updater_code

from employee_name_saver import employee_name_saver_code
from employee_name_lister import employee_name_lister_code
from employee_name_deleter import employee_name_deleter_code
from employee_name_getter import employee_name_getter_code
from employee_name_updater import employee_name_updater_code


app = Flask(__name__)
CORS(app)
app.register_blueprint(login_page_code)
app.register_blueprint(company_name_saver_code)
app.register_blueprint(company_name_lister_code)
app.register_blueprint(company_name_deleter_code)
app.register_blueprint(company_name_getter_code)
app.register_blueprint(company_name_updater_code)

app.register_blueprint(employee_name_saver_code)
app.register_blueprint(employee_name_lister_code)
app.register_blueprint(employee_name_deleter_code)
app.register_blueprint(employee_name_getter_code)
app.register_blueprint(employee_name_updater_code)

if __name__ == '__main__':
    from database_config import init_db
    init_db()
    from database_config import db_session
    app.run(host='localhost', port=5001, debug=True)
