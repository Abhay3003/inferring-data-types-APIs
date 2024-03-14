from django.urls import path, include
from .views import (
    GetHomePage,
    PostFile,
    UpdateDataTypes,
    GetFileDetailsById,
    GetAllFiles,
    DeleteFileById,
)

app_name = "uplaodfile"

urlpatterns = [
    path("", GetHomePage.as_view(), name="home-page"),
    path("upload/", PostFile.as_view(), name="post-file"),
    path(
        "update-data-types/<int:id>/",
        UpdateDataTypes.as_view(),
        name="update-data-types",
    ),
    path("file/<int:id>/", GetFileDetailsById.as_view(), name="get-file-details"),
    path("file/", GetAllFiles.as_view(), name="get-all-files"),
    path("delete-file/<int:id>/", DeleteFileById.as_view(), name="delete-file-by-id"),
]
