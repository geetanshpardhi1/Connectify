from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.renderers import UserRenderer
from .models import FriendRequest
from .serializers import FriendRequestSerializer
from rest_framework.permissions import IsAuthenticated

class FriendRequestView(APIView):
    permission_classes = [IsAuthenticated]  # Add the IsAuthenticated permission

    def post(self, request, format=None):
        sender = request.user  # The authenticated user making the request
        
        # Check if there's already a pending request from the sender to the recipient
        recipient_id = request.data.get('recipient')
        existing_request = FriendRequest.objects.filter(sender=sender, recipient_id=recipient_id, status='pending').exists()
        if existing_request:
            return Response({'detail': 'Friend request already pending.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FriendRequestSerializer(data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save(sender=sender)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)