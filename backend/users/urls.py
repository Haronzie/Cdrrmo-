# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, RefreshTokenView, LogoutView, UserManagementViewSet

# Create router for management endpoints only
router = DefaultRouter()
router.register(r'users', UserManagementViewSet, basename='user-management')

# Separate URL patterns
auth_urlpatterns = [
    # Authentication routes only
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

management_urlpatterns = [
    # Management routes only (admin CRUD operations)
    path('', include(router.urls)),
]

# Export both patterns for use in main urls.py
urlpatterns = auth_urlpatterns  # Default for backwards compatibility