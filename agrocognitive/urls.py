"""agrocognitive URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from . import settings
from agrocognitive_django import views
from django.conf.urls.static import static

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.home, name="home"),
    url(r'^iniciar-sesion/$',views.iniciarSesion, name="iniciarSesion"),
    url(r'^perfil/$',views.perfil, name="perfil"),
    url(r'^analisis/$', views.analisis, name="analisis"),
    url(r'^ordenes/$', views.ordenes, name="ordenes"),
    url(r'^monitoreo/$', views.monitoreo, name="monitoreo"),
    url(r'^facturacion/$', views.facturacion, name="facturacion"),
    url(r'^cerrar-sesion/$', views.cerrarSesion, name="cerrarSesion"),
]
