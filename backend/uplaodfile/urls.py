from django.urls import path, include
from .views import GetHomePage, PostFile, UpdateDataTypes

app_name = "uplaodfile"

urlpatterns = [
    path('', GetHomePage.as_view(), name='home-page'),
    path('upload/', PostFile.as_view(), name='post-file'),
    path('update-data-types/<int:file_id>/', UpdateDataTypes.as_view(), name = 'update-data-types')
]
