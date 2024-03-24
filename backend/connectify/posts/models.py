from django.db import models
import os
from connectify import settings
from accounts.models import User

def post_content_upload_path(instance, filename): #for manual pathing of post content
    username = instance.user.username
    return f"posts/content/{username}/{filename}"
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.FileField(upload_to=post_content_upload_path, null=True, blank=True)
    caption = models.CharField(max_length=255,null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user} ---> {self.caption}"
    
    def delete(self, *args, **kwargs):
        if self.content:
            file_path = os.path.join(settings.MEDIA_ROOT, str(self.content))
            if os.path.exists(file_path):
                os.remove(file_path)
        super().delete(*args, **kwargs)