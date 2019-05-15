from django import forms
from django.core.validators import RegexValidator
from agrocognitive_django.models import *

class iniciarSesionForm(forms.Form):
  identificacion = forms.CharField(
              max_length = 50,
              required = True,
              label = "Nº de Identificación",
              widget = forms.TextInput(attrs={'style': 'width:100%'})
          )

  clave = forms.CharField(
              max_length = 25,
              required = True,
              label = "Contraseña",
              widget = forms.PasswordInput(attrs={'style': 'width:100%'})
      )

  def __init__(self, *args, **kwargs):
    super(iniciarSesionForm, self).__init__(*args, **kwargs)
    for i in self.fields:    
        self.fields[i].widget.attrs.update({'class' : 'form-control'})