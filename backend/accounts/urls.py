from django.urls import path

from . import views

urlpatterns = [
    path('auth/csrf/', views.CsrfView.as_view(), name='auth-csrf'),
    path('auth/register/', views.RegisterView.as_view(), name='auth-register'),
    path('auth/login/', views.LoginView.as_view(), name='auth-login'),
    path('auth/logout/', views.LogoutView.as_view(), name='auth-logout'),
    path('auth/me/', views.MeView.as_view(), name='auth-me'),
    # `users/me/...` before `users/<username>/`: "me" can't be a username (3 chars minimum).
    path('users/me/', views.MyProfileView.as_view(), name='my-profile'),
    path('users/me/avatar/', views.MyAvatarView.as_view(), name='my-avatar'),
    path('users/<str:username>/', views.UserProfileView.as_view(), name='user-profile'),
]
