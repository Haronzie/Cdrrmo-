from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
import pytz
import os
from django.conf import settings

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

    def _create_user_folders(self, user):
        """Create default CDRRMO folder structure for new user"""
        try:
            # Import FileItem model here to avoid circular imports
            from files.models import FileItem
            
            # Create main CDRRMO folder
            cdrrmo_folder, created = FileItem.objects.get_or_create(
                name='CDRRMO',
                path='/',
                type='folder',
                created_by=user,
                defaults={'is_public': False}
            )
            
            if created:
                print(f"Created CDRRMO folder for user: {user.username}")
            
            # Create physical directory for CDRRMO
            cdrrmo_physical_path = os.path.join(settings.MEDIA_ROOT, 'CDRRMO')
            os.makedirs(cdrrmo_physical_path, exist_ok=True)
            
            # Create subfolders inside CDRRMO
            subfolders = ['Operation', 'Research', 'Training']
            
            for subfolder_name in subfolders:
                subfolder, created = FileItem.objects.get_or_create(
                    name=subfolder_name,
                    path='/CDRRMO',  # Path points to CDRRMO folder
                    type='folder',
                    created_by=user,
                    defaults={'is_public': False}
                )
                
                if created:
                    print(f"Created subfolder: {subfolder_name} inside CDRRMO for user: {user.username}")
                
                # Create physical directory for subfolder
                subfolder_physical_path = os.path.join(settings.MEDIA_ROOT, 'CDRRMO', subfolder_name)
                os.makedirs(subfolder_physical_path, exist_ok=True)
                
        except Exception as e:
            print(f"Error creating default folders for user {user.username}: {e}")

    def create(self, validated_data):
        """Create new user with proper password hashing and default folders"""
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
        
        # Create default CDRRMO folder structure for the new user
        self._create_user_folders(user)
        
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
        """Customize the output representation with Philippines timezone"""
        data = super().to_representation(instance)
        
        # Add phone field (empty for now, but ready for extension)
        data['phone'] = self.get_phone(instance)
        
        # Get Philippines timezone
        ph_timezone = pytz.timezone('Asia/Manila')
        
        # Format created_at for frontend (M/D/Y format)
        if data.get('created_at') and instance.date_joined:
            # Convert to Philippines timezone
            ph_time = instance.date_joined.astimezone(ph_timezone)
            data['created_at'] = ph_time.strftime('%m/%d/%Y')
        
        # Format last_login for frontend (M/D/Y format)
        if data.get('last_login') and instance.last_login:
            # Convert to Philippines timezone
            ph_time = instance.last_login.astimezone(ph_timezone)
            data['last_login'] = ph_time.strftime('%m/%d/%Y')
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
        """Customize the output representation with Philippines timezone"""
        data = super().to_representation(instance)
        
        # Add phone field (empty for now)
        data['phone'] = ""
        
        # Get Philippines timezone
        ph_timezone = pytz.timezone('Asia/Manila')
        
        # Format created_at (M/D/Y format)
        if data.get('created_at') and instance.date_joined:
            ph_time = instance.date_joined.astimezone(ph_timezone)
            data['created_at'] = ph_time.strftime('%m/%d/%Y')
        
        # Format last_login (M/D/Y format)
        if data.get('last_login') and instance.last_login:
            ph_time = instance.last_login.astimezone(ph_timezone)
            data['last_login'] = ph_time.strftime('%m/%d/%Y')
        else:
            data['last_login'] = "Never"

        return data


# Login serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the JWT
        token['is_admin'] = user.is_staff
        return token

    def validate(self, attrs):
        # Call the parent validate method
        data = super().validate(attrs)
        
        # Store the user instance for access in the view
        self.user = self.user  # This is set by parent class
        
        # Include user info in the response body
        data['user'] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "is_admin": self.user.is_staff
        }
        return data