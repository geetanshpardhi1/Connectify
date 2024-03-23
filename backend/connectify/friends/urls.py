from django.urls import path
from .views import FriendRequestView,RemoveFriendView,PendingFriendRequestsView,AcceptFriendRequestView,RejectFriendRequestView

urlpatterns = [
    path('friend-request/', FriendRequestView.as_view(), name='friend-request'),
    path('pending-requests/', PendingFriendRequestsView.as_view(), name='pending_friend_requests'),
    path('pending-requests/<str:sender_username>/<str:receiver_username>/accept/', AcceptFriendRequestView.as_view(), name='accept-friend-request'),
    path('pending-requests/<str:sender_username>/<str:receiver_username>/reject/', RejectFriendRequestView.as_view(), name='reject-friend-request'),
    path('remove-friend/', RemoveFriendView.as_view(), name='remove-friend'),
]