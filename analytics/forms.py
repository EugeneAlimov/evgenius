from django import forms

from .models import *
from django.forms import ModelForm, DateTimeInput


class TagForm(ModelForm):
    class Meta:
        model = Tags

