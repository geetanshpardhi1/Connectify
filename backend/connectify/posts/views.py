from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post,Like,Comment
from .serializers import PostSerializer,PostDetailSerializer,LikeCreateSerializer,CommentCreateSerializer
from accounts.renderers import UserRenderer
from rest_framework.permissions import IsAuthenticated

class PostCreateView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OwnPostsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        own_posts = Post.objects.filter(user=user)
        if own_posts.exists():
            serializer = PostDetailSerializer(own_posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'msg':'You have not posted yet !'}, status=status.HTTP_200_OK)
    

class LikePostView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        post_id = request.data.get('post_id')
        if not post_id:
            return Response({'detail': 'Please provide the post_id in the request data.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = LikeCreateSerializer(data={'post': post_id}, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Post liked successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        post_id = request.data.get('post_id')
        text = request.data.get('text')

        if not post_id:
            return Response({'detail': 'Please provide the post_id in the request data.'}, status=status.HTTP_400_BAD_REQUEST)
        if not text:
            return Response({'detail': 'Please provide the text for the comment in the request data.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentCreateSerializer(data={'post': post_id, 'text': text}, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)  
            return Response({'detail': 'Comment added successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]
    def delete(self, request, format=None):
        post_id = request.data.get("post_id")
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
        if post.user != request.user:
            return Response({'detail': 'You are not authorized to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({'detail': 'Post deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        