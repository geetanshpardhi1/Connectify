from django.urls import path
from .views import PostCreateView,OwnPostsListView,LikePostView,CommentCreateView

urlpatterns = [
    path('create/', PostCreateView.as_view(), name='post-create'),
    path('my-posts/', OwnPostsListView.as_view(), name='own-posts'),
    path('like-post/', LikePostView.as_view(), name='like-post'),
    path('comment-post/', CommentCreateView.as_view(), name='comment-post'),
    
]