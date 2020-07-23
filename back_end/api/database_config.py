from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///data_log.db', convert_unicode=True)
db_session = scoped_session(sessionmaker(
    autocommit=False, autoflush=False, bind=engine))
db = declarative_base()
db.query = db_session.query_property()


def init_db():
    from databases import Company
    from databases import Employees
    # To remove a table in SQlite
    #User.__table__.drop(engine)
    # WebAnalyticsDBConfig.__table__.drop(engine)
    db.metadata.create_all(bind=engine)
