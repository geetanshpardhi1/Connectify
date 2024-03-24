from django.urls import path
from .views import PostCreateView,OwnPostsListView

urlpatterns = [
    path('create/', PostCreateView.as_view(), name='post-create'),
    path('my-posts/', OwnPostsListView.as_view(), name='post-create'),
    
]