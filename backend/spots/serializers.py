from rest_framework import serializers
from .models import Spot


class SpotSerializer(serializers.ModelSerializer):

    latitude = serializers.DecimalField(required=True, max_digits=10, decimal_places=8)
    longitude = serializers.DecimalField(required=True, max_digits=11, decimal_places=8)
    category = serializers.CharField(required=True)
    comment = serializers.CharField(required=True, max_length=512)
    reporter_is_official = serializers.SerializerMethodField()

    class Meta:
        model = Spot
        fields = '__all__'
        read_only_fields = ('id', 'reporter', 'user_is_official', 'created_at')
        

    def get_reporter_is_official(self, obj):
        return obj.reporter.is_official

      
