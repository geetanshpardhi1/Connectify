from rest_framework import serializers
from .models import Post,Comment,Like

class PostSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Post
        fields = ['id','user_id','username', 'content' ,'caption','created_at']
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
    
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['user', 'text', 'created_at']

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Like
        fields = ['user','created_at']

        
class PostDetailSerializer(serializers.ModelSerializer):
    total_likes = serializers.IntegerField(source='likes.count', read_only=True)
    likes = LikeSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id','content', 'caption', 'likes','total_likes', 'comments', 'created_at']
        
class LikeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['post'] 

    def validate(self, data):
        user = self.context['request'].user
        post = data['post']
        existing_like = Like.objects.filter(post=post, user=user).exists()
        if existing_like:
            raise serializers.ValidationError("You have already liked this post.")

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
    
class CommentCreateSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['user', 'post', 'text']

    def validate_post(self, value):
        if not isinstance(value, Post):
            raise serializers.ValidationError("Invalid post object.")
        return value

class FriendPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'caption', 'created_at']