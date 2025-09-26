from django.db import migrations
from django.contrib.auth.models import User
import os
from django.conf import settings

def create_cdrrmo_folder_structure(apps, schema_editor):
    """Create CDRRMO folder with Operation, Research, and Training subfolders"""
    FileItem = apps.get_model('files', 'FileItem')
    User = apps.get_model('auth', 'User')
    
    # Create folders for all existing users
    for user in User.objects.all():
        # First, create the main CDRRMO folder
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
        try:
            os.makedirs(cdrrmo_physical_path, exist_ok=True)
            print(f"Created physical CDRRMO folder: {cdrrmo_physical_path}")
        except Exception as e:
            print(f"Error creating physical CDRRMO folder {cdrrmo_physical_path}: {e}")
        
        # Now create the subfolders inside CDRRMO
        subfolders = ['Operation', 'Research', 'Training']
        
        for subfolder_name in subfolders:
            # Check if subfolder already exists inside CDRRMO
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
            try:
                os.makedirs(subfolder_physical_path, exist_ok=True)
                print(f"Created physical subfolder: {subfolder_physical_path}")
            except Exception as e:
                print(f"Error creating physical subfolder {subfolder_physical_path}: {e}")

def reverse_cdrrmo_folder_structure(apps, schema_editor):
    """Remove CDRRMO folder structure (for migration rollback)"""
    FileItem = apps.get_model('files', 'FileItem')
    
    # Delete subfolders first
    FileItem.objects.filter(
        name__in=['Operation', 'Research', 'Training'],
        path='/CDRRMO',
        type='folder'
    ).delete()
    
    # Then delete the main CDRRMO folder
    FileItem.objects.filter(
        name='CDRRMO',
        path='/',
        type='folder'
    ).delete()
    
    # Remove physical directories
    import shutil
    cdrrmo_physical_path = os.path.join(settings.MEDIA_ROOT, 'CDRRMO')
    if os.path.exists(cdrrmo_physical_path):
        try:
            shutil.rmtree(cdrrmo_physical_path)
            print(f"Removed physical CDRRMO folder: {cdrrmo_physical_path}")
        except Exception as e:
            print(f"Error removing physical CDRRMO folder: {e}")

class Migration(migrations.Migration):
    dependencies = [
        ('files', '0001_initial'),  # Replace with your actual previous migration
        ('auth', '0012_alter_user_first_name_max_length'),  # Ensure User model is available
    ]

    operations = [
        migrations.RunPython(create_cdrrmo_folder_structure, reverse_cdrrmo_folder_structure),
    ]