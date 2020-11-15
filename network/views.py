import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


from .models import User, Post


def index(request):

    allPosts = Post.objects.all()
    allPosts = allPosts.order_by("-timestamp").all()

    return render(request, "network/index.html", {
        "allPosts": allPosts,
        "isAllPostPage": True
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def profile(request, user):

    profileUser = User.objects.get(pk=user)
    posts = Post.objects.filter(user=user)
    
    if(request.user.is_authenticated):
        isFollowing = User.objects.filter(pk=user, follower=request.user)
    else:
        isFollowing = None

    return render(request, "network/profile.html", {
        "profileUser": profileUser,
        "allPosts": posts,
        "isFollowing": isFollowing
    })


@csrf_exempt
@login_required
def newPost(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    content = data.get("content", "")

    post = Post(user=request.user, content=content)
    post.save()

    return JsonResponse({"message": "Post created successfully."}, status=201)


@login_required
def follow(request, user):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    profileUser = User.objects.get(pk=user)
    requestUser = User.objects.get(username=request.user)

    if(requestUser != profileUser):
        profileUser.follower.add(requestUser)
        profileUser.save()
        requestUser.following.add(profileUser)
        requestUser.save()
    return redirect('profile', user)

@login_required
def unfollow(request, user):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    profileUser = User.objects.get(pk=user)
    requestUser = User.objects.get(username=request.user)

    if(requestUser != profileUser):
        profileUser.follower.remove(requestUser)
        profileUser.save()
        requestUser.following.remove(profileUser)
        requestUser.save()
    return redirect('profile', user)

@login_required
def following(request, user):

    following = User.objects.get(pk=user).following.all()
    followingPosts = Post.objects.filter(user__in=following).order_by("-timestamp").all()
    print(followingPosts)

    return render(request, "network/index.html", {
        "allPosts": followingPosts,
        "isAllPostPage": False
    })