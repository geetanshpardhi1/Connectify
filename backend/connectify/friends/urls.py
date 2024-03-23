from django.urls import path
from .views import FriendRequestView,PendingFriendRequestsView

urlpatterns = [
    path('friend-request/', FriendRequestView.as_view(), name='friend-request'),
    path('pending-requests/', PendingFriendRequestsView.as_view(), name='pending_friend_requests'),
]