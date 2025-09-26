from rest_framework import generics, status
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, CustomTokenObtainPairSerializer


# ✅ Register (returns user info + tokens)
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
            "user": serializer.data,  # 👈 wrap user fields
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response(data, status=status.HTTP_201_CREATED)


# ✅ Login
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer  # use custom serializer
    permission_classes = [AllowAny]


# ✅ Refresh Token
class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]


# ✅ Logout
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)
