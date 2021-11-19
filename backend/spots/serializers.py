from rest_framework import serializers
from .models import Spot

class SpotSerializer(serializers.ModelSerializer):

    latitude = serializers.DecimalField(required=True, min_value=-90, max_value=90)
    longitude = serializers.DecimalField(required=True, min_value=-180, max_value=180)
    category = serializers.CharField(choices=Spot.SpotCategory.choices, required=False)
    comment = serializers.CharField(required=True, max_length=512)
    reporter_id = serializers.IntegerField(required=True)

    class Meta:
        model = Spot
        fields = {'latitude', 'longitude', 'category', 'comment', 'reporter_id'}

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance
