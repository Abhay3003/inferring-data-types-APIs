from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import UploadedFile, FileDetails
from .utils.util import *
import subprocess
from rest_framework.views import APIView
from rest_framework import status
import sys
from rest_framework.response import Response
import json, os
from django.http import JsonResponse
from .serializers import *


class GetHomePage(APIView):

    def get(self, request):
        return render(request, "upload.html")


class GetFileDetailsById(APIView):
    def get(self, request, id):
        uploaded_file = get_object_or_404(UploadedFile, id=id)
        try:
            file_serializer = CreateParentFileSerializer(uploaded_file)
        except Exception as e:
            return Response({"error": str(e)}, status.HTTP_400_BAD_REQUEST)
        file_details = get_object_or_404(FileDetails, parent_file_id=id)
        try:
            file_details_serializer = CreateFileDetailsSerializer(file_details)
            return Response(
                {"file": file_serializer.data, "details": file_details_serializer.data},
                status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status.HTTP_400_BAD_REQUEST)


class GetAllFiles(APIView):
    def get(self, request):
        try:
            all_files = UploadedFile.objects.all().order_by("-uploaded_at")
            all_files_serializer = CreateParentFileSerializer(all_files, many=True)
            return Response(all_files_serializer.data, status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PostFile(APIView):

    def post(self, request):
        if request.FILES["file"]:
            file = request.FILES["file"]
            extension = file.name.split(".")
            if extension[1] != "csv" and extension[1] != ".xslx":
                return Response(
                    "Please upload the correct file", status.HTTP_400_BAD_REQUEST
                )
            uploaded_file = UploadedFile(file=file)
            uploaded_file.file_name = file.name
            uploaded_file.save()

            process = subprocess.run(
                [
                    "python",
                    f"{os.getcwd()}/backend/scripts/script.py",
                    uploaded_file.file.path,
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            temp = json.loads(process.stdout)

            new_file_details = FileDetails()
            new_file_details.parent_file = uploaded_file
            new_file_details.data_types = convert_to_python_data_types(temp)
            new_file_details.save()
            return Response(
                makeFileDetails(new_file_details, uploaded_file), status.HTTP_200_OK
            )

        return Response(
            "File not uploaded successfully. Please Try again",
            status.HTTP_400_BAD_REQUEST,
        )


class UpdateDataTypes(APIView):
    def put(self, request, file_id):
        file_details_instance = get_object_or_404(FileDetails, parent_file_id=file_id)
        if not validate_update_data_types(request.data.get("data_types")):
            return Response(
                "Given data type is not supported. Please select a valid data type",
                status.HTTP_400_BAD_REQUEST,
            )
        serializer = CreateFileDetailsSerializer(
            file_details_instance, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        return Response({"error": serializer.error}, status.HTTP_200_OK)


class DeleteFileById(APIView):
    def delete(self, request, id):
        file_instance = get_object_or_404(UploadedFile, id=id)
        try:
            file_instance.delete()
            return Response("File deleted successfully", status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status.HTTP_400_BAD_REQUEST)
