from rest_framework import serializers
from .models import Spot

class SpotSerializer(serializers.ModelSerializer):

    latitude = serializers.DecimalField(required=True, )
