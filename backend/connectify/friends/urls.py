from django.urls import path
from .views import FriendRequestView

urlpatterns = [
    path('friend-request/', FriendRequestView.as_view(), name='friend-request'),
]