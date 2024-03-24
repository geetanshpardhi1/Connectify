from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer
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
            serializer = PostSerializer(own_posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'msg':'You have not posted yet !'}, status=status.HTTP_200_OK)
        