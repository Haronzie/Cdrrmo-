from rest_framework import generics, status, viewsets
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from .serializers import UserSerializer, UserListSerializer, CustomTokenObtainPairSerializer


# Register (returns user info + tokens)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # generate tokens
        refresh = RefreshToken.for_user(user)
        data = {
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response(data, status=status.HTTP_201_CREATED)


# Login
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


# Refresh Token
class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]


# Logout
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)


# Admin User Management CRUD
class UserManagementViewSet(viewsets.ModelViewSet):
    """
    Admin-only CRUD operations for user management
    Provides endpoints for:
    - GET /api/admin/users/ (list all users)
    - POST /api/admin/users/ (create new user)
    - GET /api/admin/users/{id}/ (get specific user)
    - PUT /api/admin/users/{id}/ (update user)
    - DELETE /api/admin/users/{id}/ (delete user)
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        """Use lighter serializer for list view"""
        if self.action == 'list':
            return UserListSerializer
        return UserSerializer

    def list(self, request):
        """
        GET /api/admin/users/
        List all users with pagination support
        """
        try:
            users = self.get_queryset()
            serializer = UserListSerializer(users, many=True)
            return Response({
                'success': True,
                'data': serializer.data,
                'count': users.count()
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        """
        GET /api/admin/users/{id}/
        Get specific user details
        """
        try:
            user = get_object_or_404(User, pk=pk)
            serializer = UserSerializer(user)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        """
        POST /api/admin/users/
        Create new user (admin only)
        """
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'User created successfully'
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        """
        PUT /api/admin/users/{id}/
        Update existing user
        """
        try:
            user = get_object_or_404(User, pk=pk)
            
            # Prevent admins from demoting themselves
            if user.id == request.user.id and request.data.get('role') != 'Admin':
                return Response({
                    'success': False,
                    'error': 'You cannot change your own admin role'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'User updated successfully'
                })
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self, request, pk=None):
        """
        PATCH /api/admin/users/{id}/
        Partial update of user
        """
        return self.update(request, pk)

    def destroy(self, request, pk=None):
        """
        DELETE /api/admin/users/{id}/
        Delete user (with safety checks)
        """
        try:
            user = get_object_or_404(User, pk=pk)
            
            # Prevent self-deletion
            if user.id == request.user.id:
                return Response({
                    'success': False,
                    'error': 'You cannot delete your own account'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Prevent deletion of the last admin
            if user.is_superuser:
                admin_count = User.objects.filter(is_superuser=True).count()
                if admin_count <= 1:
                    return Response({
                        'success': False,
                        'error': 'Cannot delete the last admin user'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            username = user.username
            user.delete()
            
            return Response({
                'success': True,
                'message': f'User "{username}" deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        GET /api/admin/users/stats/
        Get user statistics for dashboard
        """
        try:
            total_users = User.objects.count()
            active_users = User.objects.filter(is_active=True).count()
            admin_users = User.objects.filter(is_staff=True).count()
            new_users_today = User.objects.filter(
                date_joined__date=timezone.now().date()
            ).count()

            return Response({
                'success': True,
                'data': {
                    'total_users': total_users,
                    'active_users': active_users,
                    'admin_users': admin_users,
                    'new_users_today': new_users_today
                }
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """
        POST /api/admin/users/{id}/toggle_status/
        Toggle user active status
        """
        try:
            user = get_object_or_404(User, pk=pk)
            
            # Prevent self-deactivation
            if user.id == request.user.id:
                return Response({
                    'success': False,
                    'error': 'You cannot deactivate your own account'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user.is_active = not user.is_active
            user.save()
            
            status_text = "activated" if user.is_active else "deactivated"
            
            return Response({
                'success': True,
                'message': f'User "{user.username}" {status_text} successfully',
                'is_active': user.is_active
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Alternative simple views if you prefer function-based views
class UserListView(generics.ListAPIView):
    """Simple list view for users"""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Simple detail/update/delete view for users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class UserCreateView(generics.CreateAPIView):
    """Simple create view for users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]