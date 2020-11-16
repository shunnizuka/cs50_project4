
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<int:user>", views.profile, name="profile"),
    path("follow/<int:user>", views.follow, name="follow"),
    path("unfollow/<int:user>", views.unfollow, name="unfollow"),
    path("following/<int:user>", views.following, name="following"),

    # API paths
    path("newPost", views.newPost, name="newPost"),
    path("editPost", views.editPost, name="editPost")
]
