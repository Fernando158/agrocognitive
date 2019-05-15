from agrocognitive_django.models import *
from agrocognitive_django.forms import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
import requests

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
					return redirect('/')
					print('hola')
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

def cerrarSesion(request):
  logout(request)
  return redirect('/')

def perfil(request):
	return render(request, 'perfil.html')



