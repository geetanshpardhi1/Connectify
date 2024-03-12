from django.urls import path,include
from accounts.views import UserRegistration,UserLoginView


urlpatterns = [
    path('register/',UserRegistration.as_view(),name='register'),
    path('login/',UserLoginView.as_view(),name='login'),
]
