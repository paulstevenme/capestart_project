from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from database_config import db
from passlib.apps import custom_app_context as pwd_context


class Company(db):
    __tablename__ = 'company'
    id = Column(Integer, primary_key=True)
    company_name = Column(String(32), index=True)
    company_location = Column(String(128))


class Employees(db):
    __tablename__ = 'employees'
    id = Column(Integer, primary_key=True)
    company_id = Column(String(32))
    employee_name = Column(String(32))

    employee_salary = Column(String(32))
   





