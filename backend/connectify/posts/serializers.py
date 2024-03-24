from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Post
        fields = ['user_id','username', 'caption', 'content']
        extra_kwargs = {
            'user': {'read_only': True},
        }

    def validate(self, data):
        if not data.get('content'):
            raise serializers.ValidationError("You must provide either an image or a video.")

        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)