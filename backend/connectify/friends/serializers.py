from rest_framework import serializers
from .models import FriendRequest

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['recipient', 'status']  # Exclude 'sender' field since it's obtained from the request automatically
        extra_kwargs = {
            'status': {'default': 'pending'}  # Set default value for 'status'
        }

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user  # Obtain sender from request user
        return super().create(validated_data)
    
    def validate(self, data):
        sender = self.context['request'].user
        recipient = data.get('recipient')
        
        if sender == recipient:
            raise serializers.ValidationError("You cannot send a friend request to yourself.")

        return data