from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, RefreshTokenView, LogoutView, UserManagementViewSet

# Create router for ViewSet
router = DefaultRouter()
router.register(r'admin/users', UserManagementViewSet, basename='user-management')

urlpatterns = [
    # Authentication routes (existing)
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Admin user management routes (new)
    path('', include(router.urls)),
]