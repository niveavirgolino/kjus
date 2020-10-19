#!/usr/bin/python3 

from urllib.parse import quote_plus
from pymongo import MongoClient
from sshtunnel import SSHTunnelForwarder

with SSHTunnelForwarder(
  '18.229.203.58',
  ssh_username='ubuntu',
  ssh_pkey='./cnjinova.pem',
  remote_bind_address=('10.0.22.39', 27017),
  local_bind_address=('0.0.0.0', 27018)
) as tunnel:

  user = 'admin'
  password = 'cnjinova'
  host = '0.0.0.0:27018'
  
  uri = "mongodb://%s:%s@%s" % (
  quote_plus(user), quote_plus(password), host)
  client = MongoClient(uri)
  
  db = client.cnjinova
  
  # List all collections.
  print(db.list_collection_names())
