from rest_framework import serializers
from django.utils import timezone
from .models import FileItem
import pytz
import mimetypes
import os


class FileItemSerializer(serializers.ModelSerializer):
    """Full serializer for CRUD operations"""
    size = serializers.IntegerField(required=False, allow_null=True)
    parent_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    mime_type = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    file_data = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = FileItem
        fields = [
            'id',
            'name', 
            'type',
            'size',
            'modified',
            'parent_id',
            'mime_type',
            'path',
            'file_data',
            'is_public',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'size', 'mime_type']
    
    def create(self, validated_data):
        """Create new file or folder"""
        # Set the user who created this item
        validated_data['created_by'] = self.context['request'].user
        
        # Handle file upload
        file_data = validated_data.get('file_data')
        if file_data and validated_data.get('type') == 'file':
            # Set name from uploaded file if not provided
            if not validated_data.get('name'):
                validated_data['name'] = file_data.name
            
            # Set size from uploaded file
            validated_data['size'] = file_data.size
            
            # Detect mime type
            mime_type, _ = mimetypes.guess_type(file_data.name)
            validated_data['mime_type'] = mime_type or 'application/octet-stream'
        
        elif validated_data.get('type') == 'folder':
            # Folders don't have file_data, size, or mime_type
            validated_data.pop('file_data', None)
            validated_data.pop('size', None)
            validated_data.pop('mime_type', None)
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Update existing file or folder"""
        # Don't allow changing type after creation
        validated_data.pop('type', None)
        
        # Handle file replacement
        file_data = validated_data.get('file_data')
        if file_data and instance.type == 'file':
            # Update file-related fields
            validated_data['size'] = file_data.size
            mime_type, _ = mimetypes.guess_type(file_data.name)
            validated_data['mime_type'] = mime_type or 'application/octet-stream'
        
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        """Customize output format to match frontend expectations"""
        data = super().to_representation(instance)
        
        # Format modified date for Philippines timezone
        ph_timezone = pytz.timezone('Asia/Manila')
        if instance.modified:
            ph_time = instance.modified.astimezone(ph_timezone)
            data['modified'] = ph_time.isoformat()
        
        # Convert UUID to string
        data['id'] = str(instance.id)
        
        # Ensure size is properly formatted
        if data['size'] is None:
            data['size'] = None
        
        # Remove file_data from response (don't expose file paths)
        data.pop('file_data', None)
        
        # Add download URL for files
        if instance.type == 'file' and instance.file_data:
            request = self.context.get('request')
            if request:
                data['download_url'] = request.build_absolute_uri(
                    f'/api/files/{instance.id}/download/'
                )
        
        return data


class FileItemListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing files"""
    
    class Meta:
        model = FileItem
        fields = [
            'id',
            'name',
            'type', 
            'size',
            'modified',
            'parent_id',
            'mime_type',
            'path'
        ]
    
    def to_representation(self, instance):
        """Customize output format"""
        data = super().to_representation(instance)
        
        # Format modified date
        ph_timezone = pytz.timezone('Asia/Manila')
        if instance.modified:
            ph_time = instance.modified.astimezone(ph_timezone)
            data['modified'] = ph_time.isoformat()
        
        # Convert UUID to string
        data['id'] = str(instance.id)
        
        # Add download URL for files
        if instance.type == 'file' and instance.file_data:
            request = self.context.get('request')
            if request:
                data['download_url'] = request.build_absolute_uri(
                    f'/api/files/{instance.id}/download/'
                )
        
        return data


class FolderCreateSerializer(serializers.ModelSerializer):
    """Serializer specifically for creating folders"""
    
    class Meta:
        model = FileItem
        fields = ['name', 'path', 'parent_id']
    
    def create(self, validated_data):
        validated_data['type'] = 'folder'
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class FileUploadSerializer(serializers.ModelSerializer):
    """Serializer specifically for file uploads"""
    file_data = serializers.FileField(required=True)
    
    class Meta:
        model = FileItem
        fields = ['name', 'path', 'parent_id', 'file_data', 'is_public']
    
    def create(self, validated_data):
        validated_data['type'] = 'file'
        validated_data['created_by'] = self.context['request'].user
        
        # Set file metadata
        file_data = validated_data['file_data']
        validated_data['size'] = file_data.size
        
        # If name not provided, use filename
        if not validated_data.get('name'):
            validated_data['name'] = file_data.name
        
        # Detect mime type
        mime_type, _ = mimetypes.guess_type(file_data.name)
        validated_data['mime_type'] = mime_type or 'application/octet-stream'
        
        return super().create(validated_data)


class FileMoveSerializer(serializers.Serializer):
    """Serializer for moving files/folders"""
    target_path = serializers.CharField(max_length=1000)
    items = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False
    )
    
    def validate_target_path(self, value):
        """Validate the target path exists and is a folder"""
        if value != '/':  # Root is always valid
            user = self.context['request'].user
            try:
                folder = FileItem.objects.get(
                    path=value.rsplit('/', 1)[0] if '/' in value.strip('/') else '/',
                    name=value.rsplit('/', 1)[-1],
                    type='folder',
                    created_by=user
                )
            except FileItem.DoesNotExist:
                raise serializers.ValidationError("Target folder does not exist")
        
        return value
    
    def validate_items(self, value):
        """Validate all items exist and belong to the user"""
        user = self.context['request'].user
        items = FileItem.objects.filter(id__in=value, created_by=user)
        
        if len(items) != len(value):
            raise serializers.ValidationError("Some items do not exist or don't belong to you")
        
        return value


class FileStatsSerializer(serializers.Serializer):
    """Serializer for file system statistics"""
    total_files = serializers.IntegerField()
    total_folders = serializers.IntegerField()
    total_size = serializers.IntegerField()
    recent_files = FileItemListSerializer(many=True)
    
    def to_representation(self, instance):
        """Format total size in human-readable format"""
        data = super().to_representation(instance)
        
        # Format total size
        size = data['total_size']
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size < 1024.0:
                data['total_size_formatted'] = f"{size:.1f} {unit}"
                break
            size /= 1024.0
        else:
            data['total_size_formatted'] = f"{size:.1f} PB"
        
        return data