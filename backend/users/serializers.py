from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Enhanced UserSerializer for full CRUD operations
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=False, allow_blank=True)
    is_admin = serializers.BooleanField(source='is_staff', read_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    role = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source='date_joined', read_only=True)
    last_login = serializers.DateTimeField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'password', 
            'first_name', 
            'last_name',
            'phone',
            'is_admin',
            'role',
            'status',
            'is_active',
            'is_staff',
            'is_superuser',
            'created_at',
            'last_login'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'write_only': True},
            'is_superuser': {'write_only': True}
        }

    def get_role(self, obj):
        """Convert Django permissions to frontend-friendly roles"""
        if obj.is_superuser:
            return "Admin"
        elif obj.is_staff:
            return "Moderator"
        else:
            return "User"

    def get_status(self, obj):
        """Convert is_active to frontend-friendly status"""
        if obj.is_active:
            return "Active"
        else:
            return "Inactive"

    def get_phone(self, obj):
        """Get phone from user profile if exists, otherwise return empty"""
        # For now, return empty since Django User model doesn't have phone
        # You can extend this if you have a UserProfile model
        return ""

    def create(self, validated_data):
        """Create new user with proper password hashing"""
        # Check if this is the first user
        is_first_user = User.objects.count() == 0

        # Extract password and other fields
        password = validated_data.pop('password')
        role_data = self.initial_data.get('role', 'User')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=validated_data.get('is_active', True)
        )

        # Set role based on frontend input
        if role_data == "Admin":
            user.is_staff = True
            user.is_superuser = True
        elif role_data == "Moderator":
            user.is_staff = True
            user.is_superuser = False
        else:  # User
            user.is_staff = False
            user.is_superuser = False

        # Make first user an admin regardless
        if is_first_user:
            user.is_staff = True
            user.is_superuser = True

        user.save()
        return user

    def update(self, instance, validated_data):
        """Update user with special handling for password and roles"""
        # Handle password separately
        password = validated_data.pop('password', None)
        
        # Handle role updates from frontend
        role_data = self.initial_data.get('role')
        if role_data:
            if role_data == "Admin":
                instance.is_staff = True
                instance.is_superuser = True
            elif role_data == "Moderator":
                instance.is_staff = True
                instance.is_superuser = False
            else:  # User
                instance.is_staff = False
                instance.is_superuser = False

        # Handle status updates from frontend
        status_data = self.initial_data.get('status')
        if status_data:
            instance.is_active = (status_data == "Active")

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update password if provided
        if password:
            instance.set_password(password)

        instance.save()
        return instance

    def to_representation(self, instance):
        """Customize the output representation"""
        data = super().to_representation(instance)
        
        # Add phone field (empty for now, but ready for extension)
        data['phone'] = self.get_phone(instance)
        
        # Format dates for frontend
        if data.get('created_at'):
            data['created_at'] = instance.date_joined.strftime('%Y-%m-%d')
        
        if data.get('last_login') and instance.last_login:
            data['last_login'] = instance.last_login.strftime('%Y-%m-%d')
        else:
            data['last_login'] = "Never"

        return data


# Separate serializer for user listing (lighter version)
class UserListSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source='date_joined', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name',
            'role',
            'status',
            'created_at',
            'last_login'
        ]

    def get_role(self, obj):
        if obj.is_superuser:
            return "Admin"
        elif obj.is_staff:
            return "Moderator"
        else:
            return "User"

    def get_status(self, obj):
        return "Active" if obj.is_active else "Inactive"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Add phone field (empty for now)
        data['phone'] = ""
        
        # Format dates
        if data.get('created_at'):
            data['created_at'] = instance.date_joined.strftime('%Y-%m-%d')
        
        if data.get('last_login') and instance.last_login:
            data['last_login'] = instance.last_login.strftime('%Y-%m-%d')
        else:
            data['last_login'] = "Never"

        return data


# Login serializer - no changes needed
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