from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
 
    email = serializers.EmailField(required = True)
    name = serializers.CharField()
    password = serializers.CharField(min_length = 8, write_only = True)
    surname = serializers.CharField()
    is_official = serializers.BooleanField(required=True)


    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'surname', 'password', 'is_official')
        extra_kwargs = {'password': {'write_only': True}}


    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance