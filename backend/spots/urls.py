from django.urls import path
from . import views

router = routers.DefaultRouter()
router.register('spots', views.SpotsViewSet)

urlpatterns = [
    path('/spots', views.spots, name='Spots'),
    path('/spots/<uuid:spot_id>', views.get_spot, name='Get slot for a given id'),
]
