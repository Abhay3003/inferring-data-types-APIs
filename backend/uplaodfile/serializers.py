from rest_framework import serializers
from .models import FileDetails, UploadedFile


class CreateFileDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileDetails
        fields = "__all__"


class CreateParentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ["id", "uploaded_at", "file_name"]
