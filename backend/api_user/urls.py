from django.contrib import admin
from django.urls import path, include, URLPattern
from rest_framework_simplejwt import views as jwt_views
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
router.register('user', views.UserViewSet)

urlpatterns = [
    path(r'', include(router.urls)),
    path(r'login/', jwt_views.TokenObtainPairView.as_view(), name='token_create'), 
    path(r'login/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh')
]