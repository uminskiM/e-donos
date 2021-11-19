from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Spot
from .serializers import SpotSerializer

class SpotsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Spot.objects.all()
    serializer_class = SpotsSerializer

@api_view(['GET', 'POST'])
def spots(request):
    if request.method == 'GET':
        return get_spots(request)
    elif request.method == 'POST':
        return create_spot(request)
    else:
        return Response(status = status.HTTP_405)

def get_spots(request):

    return Response("Hello world")

def create_spot(request):

    return Response("Hello world")

def get_spot(request):
    return Response("Hello world!")