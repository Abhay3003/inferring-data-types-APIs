from rest_framework import serializers
from .models import FileDetails

class CreateFileDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileDetails
        fields = "__all__"