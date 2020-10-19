from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from rest_framework import routers, serializers, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from urllib.parse import quote_plus
from pymongo import MongoClient
from sshtunnel import SSHTunnelForwarder
import json

dev = True

user = 'admin'
password = 'cnjinova'

if dev:
  host = '0.0.0.0:27018'
else:
  host = '10.0.22.39:27017'

@ensure_csrf_cookie
def index(request):
  return render(request, "index.html", {})


def main(request):
  return JsonResponse({
    'numbers': ['1', '2', '3'],
    'letters': ['a', 'b', 'c'],
  })

def get_processo(pk):
  server = None
  if dev:
    server = SSHTunnelForwarder(
      '18.229.203.58',
      ssh_username='ubuntu',
      ssh_pkey='./cnjinova.pem',
      remote_bind_address=('10.0.22.39', 27017),
      local_bind_address=('0.0.0.0', 27018)
    )
    server.start()

  uri = "mongodb://%s:%s@%s" % (
      quote_plus(user), quote_plus(password), host)
  client = MongoClient(uri)
  db = client.cnjinova
  processo = db.processos.find_one({ 'id': str(pk) })
  client.close()

  if dev:
    server.stop()
  return processo

def get_unidade(pk):
  server = None
  if dev:
    server = SSHTunnelForwarder(
      '18.229.203.58',
      ssh_username='ubuntu',
      ssh_pkey='./cnjinova.pem',
      remote_bind_address=('10.0.22.39', 27017),
      local_bind_address=('0.0.0.0', 27018)
    )
    server.start()

  uri = "mongodb://%s:%s@%s" % (
      quote_plus(user), quote_plus(password), host)
  client = MongoClient(uri)
  db = client.cnjinova
  unidade = db.unidades.find_one({ 'id': str(pk) })
  client.close()

  if dev:
    server.stop()
  return unidade

def processo(request, pk):
  processo = get_processo(pk)
  if processo is None:
    return JsonResponse({
      'error': 'Couldn\'t find id.'
    })
    
  del processo['_id']
  print(json.dumps(processo))
  return JsonResponse(processo)

def unidade(request, pk):
  unidade = get_unidade(pk)
  if unidade is None:
    return JsonResponse({
      'error': 'Couldn\'t find id.'
    })
    
  del unidade['_id']
  print(json.dumps(unidade))
  return JsonResponse(unidade)
