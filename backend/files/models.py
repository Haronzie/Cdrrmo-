from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import os
import uuid

def upload_path(instance, filename):
    """Create folder structure that matches the virtual path"""
    # Remove leading slash and create physical path
    virtual_path = instance.path.lstrip('/')
    if virtual_path:
        return os.path.join(virtual_path, filename)
    return filename

class FileItem(models.Model):
    TYPE_CHOICES = [
        ('file', 'File'),
        ('folder', 'Folder'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    size = models.BigIntegerField(null=True, blank=True)  # Size in bytes, null for folders
    path = models.CharField(max_length=1000, default='/')  # Current folder path
    parent_id = models.CharField(max_length=100, null=True, blank=True)  # Parent folder path
    mime_type = models.CharField(max_length=100, null=True, blank=True)
    file_data = models.FileField(upload_to=upload_path, null=True, blank=True)  # UPDATED: Use dynamic path
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    
    # Permissions (for future use)
    is_public = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['type', 'name']  # Folders first, then files, both alphabetical
        unique_together = ['name', 'path', 'created_by']  # Prevent duplicate names in same folder
    
    def __str__(self):
        return f"{self.get_type_display()}: {self.name} ({self.path})"
    
    @property
    def full_path(self):
        """Get the full path including the item name"""
        if self.path == '/':
            return f'/{self.name}'
        return f'{self.path}/{self.name}'
    
    @property
    def physical_path(self):
        """Get the physical folder path on disk"""
        if self.path == '/':
            return os.path.join(settings.MEDIA_ROOT, self.name)
        return os.path.join(settings.MEDIA_ROOT, self.path.lstrip('/'), self.name)
    
    @property
    def is_folder(self):
        return self.type == 'folder'
    
    @property
    def is_file(self):
        return self.type == 'file'
    
    def get_children(self):
        """Get all direct children of this folder"""
        if not self.is_folder:
            return FileItem.objects.none()
        
        child_path = self.full_path
        return FileItem.objects.filter(
            path=child_path,
            created_by=self.created_by
        )
    
    def get_size_formatted(self):
        """Get human-readable file size"""
        if not self.size:
            return '-'
        
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if self.size < 1024.0:
                return f"{self.size:.1f} {unit}"
            self.size /= 1024.0
        return f"{self.size:.1f} PB"
    
    def delete(self, *args, **kwargs):
        """Override delete to handle file cleanup and recursive folder deletion"""
        if self.is_file and self.file_data:
            # Delete the actual file from storage
            if os.path.isfile(self.file_data.path):
                os.remove(self.file_data.path)
        
        elif self.is_folder:
            # Delete physical folder if it exists
            if os.path.exists(self.physical_path):
                try:
                    os.rmdir(self.physical_path)  # Remove empty directory
                except OSError:
                    # Directory not empty, remove recursively
                    import shutil
                    shutil.rmtree(self.physical_path, ignore_errors=True)
            
            # Recursively delete all children from database
            children = self.get_children()
            for child in children:
                child.delete()
        
        super().delete(*args, **kwargs)
    
    def save(self, *args, **kwargs):
        """Override save to create physical folders and set file metadata"""
        
        # Create physical folder for folder types
        if self.type == 'folder':
            # Create the physical directory structure
            try:
                os.makedirs(self.physical_path, exist_ok=True)
                print(f"Created physical folder: {self.physical_path}")
            except Exception as e:
                print(f"Error creating folder {self.physical_path}: {e}")
        
        # Handle file metadata
        elif self.is_file and self.file_data:
            self.size = self.file_data.size
            if not self.mime_type:
                # Try to determine mime type from file extension
                name_lower = self.name.lower()
                if name_lower.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    self.mime_type = f'image/{name_lower.split(".")[-1]}'
                elif name_lower.endswith(('.mp4', '.avi', '.mov', '.wmv')):
                    self.mime_type = f'video/{name_lower.split(".")[-1]}'
                elif name_lower.endswith(('.mp3', '.wav', '.flac', '.ogg')):
                    self.mime_type = f'audio/{name_lower.split(".")[-1]}'
                elif name_lower.endswith('.pdf'):
                    self.mime_type = 'application/pdf'
                elif name_lower.endswith(('.zip', '.rar', '.7z')):
                    self.mime_type = 'application/zip'
                elif name_lower.endswith(('.txt', '.md')):
                    self.mime_type = 'text/plain'
                elif name_lower.endswith(('.doc', '.docx')):
                    self.mime_type = 'application/msword'
                else:
                    self.mime_type = 'application/octet-stream'
        
        super().save(*args, **kwargs)