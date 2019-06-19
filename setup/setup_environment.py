import os
import yaml
import logging

from sqlalchemy import create_engine



log = logging.getLogger(__name__)


def get_database():
    try:
        engine = get_connection_from_config()
        log.info("Successfully Connected to BETY Database!")
    except IOError:
        log.exception("Failed to get database connection!")
        return None, 'fail'

    return engine


def get_connection_from_config(config_file_name="credentials.yaml"):
    """
    Sets up database connection from config file.
    Input:
    config_file_name: File containing PGHOST, PGUSER,
                      PGPASSWORD, PGDATABASE, PGPORT, which are the
                      credentials for the PostgreSQL database
    """

    with open(config_file_name, 'r') as f:
        creds = yaml.load(f,Loader=yaml.FullLoader)

    if not ('PGHOST' in creds.keys() and
            'PGUSER' in creds.keys() and
            'PGPASSWORD' in creds.keys() and
            'PGDATABASE' in creds.keys() and
            'PGPORT' in creds.keys()):
        raise Exception('Bad config file: ' + config_file_name)

    return get_engine(creds['PGDATABASE'], creds['PGUSER'],
                      creds['PGHOST'], creds['PGPORT'],
                      creds['PGPASSWORD'])


def get_engine(db, user, host, port, passwd):
    """
    Get SQLalchemy engine using credentials.
    Input:
    db: database name
    user: Username
    host: Hostname of the database server
    port: Port number
    passwd: Password for the database
    """

    url = 'postgresql+psycopg2://{user}:{passwd}@{host}:{port}/{db}'.format(
        user=user, passwd=passwd, host=host, port=port, db=db)
    engine = create_engine(url)
    return engine