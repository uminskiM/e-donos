from django.urls import path
from . import views

urlpatterns = [
    path('/spots', views.get_spots, name='Get all spots'),
    path('/spots/{spot_id}', views.get_spot, name='Get slot for a given id'),
    path('/spots', views.create_spot, name='Create spot')
]
