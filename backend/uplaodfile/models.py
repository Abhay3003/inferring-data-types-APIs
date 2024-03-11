from django.db import models


class UploadedFile(models.Model):
    file = models.FileField(upload_to="static/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_name = models.CharField(max_length=1000)

    def __str__(self):
        return self.file.name


class FileDetails(models.Model):
    parent_file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE)
    data_types = models.JSONField()
