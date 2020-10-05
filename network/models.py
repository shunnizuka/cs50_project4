from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    follower = models.ManyToManyField("User", blank=True, related_name="userFollowers")
    following = models.ManyToManyField("User", blank=True, related_name="userFollowing")


class Post(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="postOwner")
    content = models.CharField(max_length=255)
    likes = models.ManyToManyField("User", blank=True, related_name="LikedBy")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}: posted {self.content}, at {self.timestamp}"
