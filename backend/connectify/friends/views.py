from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.renderers import UserRenderer
from accounts.models import User
from .models import FriendRequest
from .serializers import FriendRequestSerializer,PendingRequestSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError

class FriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        sender = request.user 
        recipient_username = request.data.get('recipient')

        try:
            # Find the recipient user by username
            recipient = User.objects.get(username=recipient_username)
        except User.DoesNotExist:
            return Response({'detail': "Recipient user does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            
        existing_request = FriendRequest.objects.filter(sender=sender, recipient=recipient, status='pending').exists()
        if existing_request:
            return Response({'detail': 'Friend request already pending.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FriendRequestSerializer(data={'recipient': recipient.id}, context={'request': request})
        if serializer.is_valid():
            serializer.save(sender=sender)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# class FriendRequestView(APIView):
#     permission_classes = [IsAuthenticated]  # Add the IsAuthenticated permission

#     def post(self, request, format=None):
#         sender = request.user  # The authenticated user making the request
        
#         # Check if there's already a pending request from the sender to the recipient
#         recipient_id = request.data.get('recipient')
#         existing_request = FriendRequest.objects.filter(sender=sender, recipient_id=recipient_id, status='pending').exists()
#         if existing_request:
#             return Response({'detail': 'Friend request already pending.'}, status=status.HTTP_400_BAD_REQUEST)

#         serializer = FriendRequestSerializer(data=request.data,context={'request': request})
#         if serializer.is_valid():
#             serializer.save(sender=sender)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PendingFriendRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        pending_requests = FriendRequest.objects.filter(recipient=user, status='pending')
        if pending_requests.exists():
            serializer = PendingRequestSerializer(pending_requests, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'You do not have any pending friend requests.'}, status=status.HTTP_200_OK)
        
class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, sender_username, receiver_username, format=None):
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
        if request.user != receiver:
            return Response({'detail': 'You are not authorized to accept this friend request'}, status=status.HTTP_403_FORBIDDEN)
        friend_request = FriendRequest.objects.get(sender=sender, recipient=receiver, status='pending')
        friend_request.status = 'accepted'
        friend_request.save()
        return Response({'detail': 'Friend request accepted successfully'}, status=status.HTTP_200_OK)
    
class RejectFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, sender_username, receiver_username, format=None):
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
        if request.user != receiver:
            return Response({'detail': 'You are not authorized to reject this friend request'}, status=status.HTTP_403_FORBIDDEN)
        friend_request = FriendRequest.objects.get(sender=sender, recipient=receiver, status='pending')
        friend_request.delete()
        return Response({'detail': 'Friend request rejected successfully'}, status=status.HTTP_204_NO_CONTENT)