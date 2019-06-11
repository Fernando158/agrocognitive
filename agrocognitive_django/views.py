from agrocognitive_django.models import *
from agrocognitive_django.forms import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from base64 import b64encode
import requests
import json
import html.parser

rojo = "color:#F00000"
negro = "color:#000000"
verde = "color:#009900"

def home(request):
	return render(request, 'index.html')

def iniciarSesion(request):
	if request.method == 'POST':
		form=iniciarSesionForm(request.POST)

		if form.is_valid():
			user = authenticate(username = form.cleaned_data['identificacion'], password=form.cleaned_data['clave'])
			if user is not None:
				if user.is_active:
					login(request, user)
					return redirect('dashboard')
				else:
					msg = "Su usuario se encuentra inactivo."
					return render(request,'iniciar_sesion.html', {'form': form, 'msg': msg, 'color':rojo})
			else:
				msg = "Usuario o contraseña incorrecta."
				return render(request, 'iniciar_sesion.html',{'form': form, 'msg': msg, 'color': rojo})
	else:
		form = iniciarSesionForm()
		print('chao')
	return render(request, 'iniciar_sesion.html', {'form': form})

def dashboard(request):
	return render(request, 'dashboard.html')

def cerrarSesion(request):
  logout(request)
  return redirect('/')

def perfil(request):
	return render(request, 'perfil.html')

def sesion(request):
	global client_data
	global sessionCode
	global client_data
	usuario=request.user
	client_id=usuario.client_id.encode()
	client_secret=usuario.client_secret.encode()
	client_data=usuario.client_data
	url = "https://us-south.dynamic-dashboard-embedded.cloud.ibm.com/daas/v1/session"

	userAndPass = b64encode(b"%s:%s" % (
	              client_id,
	              client_secret
	          )).decode("ascii")

	payload = "{\r\n  \"expiresIn\": 3600,\r\n  \"webDomain\": \"http://localhost:8000/\"\r\n}"
	headers = {
	'accept': "application/json",
	'Content-Type': "application/json",
	'Authorization' : 'Basic %s' %  userAndPass
	}

	response = requests.request("POST", url, data=payload, headers=headers)

	json_data = response.text

	python_obj = json.loads(json_data)

	global sessionCode
	sessionCode = python_obj["sessionCode"]
	print(python_obj["sessionCode"])
	

def analisis(request):
  sesion(request)
  # return response.json()
  return render(request, 'analisis.html',{'sessionCode': sessionCode, 'client_data': client_data})

def ordenes(request):
	return render(request, 'ordenes.html')

def monitoreo(request):
	return render(request, 'monitoreo.html')

def facturacion(request):
	return render(request, 'facturacion.html')

def terreno(request):
	return render(request, 'terreno.html')

