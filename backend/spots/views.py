from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .models import Spot
from .serializers import SpotSerializer


class SpotsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Spot.objects.all()
    serializer_class = SpotSerializer


    def get_queryset(self):
        if self.action in {'list'}:
            return super().get_queryset()
        return super().get_queryset().filter(reporter = self.request.user)


    def perform_create(self, serializer):
        serializer.save(reporter = self.request.user)


    def perform_update(self, serializer):
        serializer.save(reporter = self.request.user)


    def get_permissions(self):
        if self.action in {'list'}:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


    
