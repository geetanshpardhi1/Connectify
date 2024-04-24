from rest_framework import serializers
from .models import FriendRequest,Friendship

class FriendRequestSerializer(serializers.ModelSerializer):
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    class Meta:
        model = FriendRequest
        fields = ['recipient','recipient_username', 'status'] 
        extra_kwargs = {
            'status': {'default': 'pending'}  
        }

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user  
        return super().create(validated_data)
    
    def validate(self, data):
        sender = self.context['request'].user
        recipient = data.get('recipient')
        
        if sender == recipient:
            raise serializers.ValidationError("You cannot send a friend request to yourself.")

        return data  
class PendingRequestSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.username', read_only=True)
    recipient = serializers.CharField(source='recipient.username', read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['sender', 'recipient', 'status','created_at']
        
class FriendshipSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='user2.id',read_only=True)
    friend = serializers.CharField(source='user2.username', read_only=True)
    class Meta:
        model = Friendship
        fields = ['id','friend','created_at']