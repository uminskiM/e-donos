from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('spots', views.SpotsViewSet)

urlpatterns = [
    path(r'', include(router.urls)),
]
