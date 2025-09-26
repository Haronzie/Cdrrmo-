from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# ✅ For Register
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_admin = serializers.BooleanField(source='is_staff', read_only=True)  # map is_staff → is_admin

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_admin']

    def create(self, validated_data):
        # Check if this is the first user
        is_first_user = User.objects.count() == 0

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )

        # Make first user an admin
        if is_first_user:
            user.is_staff = True
            user.is_superuser = True
            user.save()

        return user


# ✅ For Login
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the JWT
        token['is_admin'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Include user info in the response body
        data['user'] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "is_admin": self.user.is_staff
        }
        return data
