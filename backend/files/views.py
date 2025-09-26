from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta
import mimetypes
import os

from .models import FileItem
from .serializers import (
    FileItemSerializer, 
    FileItemListSerializer,
    FolderCreateSerializer, 
    FileUploadSerializer,
    FileMoveSerializer,
    FileStatsSerializer
)


class FileManagementViewSet(viewsets.ModelViewSet):
    """
    File Management API ViewSet
    Provides CRUD operations for files and folders
    
    Endpoints:
    - GET /api/files/ - List files in current path
    - POST /api/files/ - Create folder or upload file
    - GET /api/files/{id}/ - Get specific file/folder details
    - PUT /api/files/{id}/ - Update file/folder
    - DELETE /api/files/{id}/ - Delete file/folder
    - GET /api/files/{id}/download/ - Download file
    - POST /api/files/upload/ - Upload multiple files
    - POST /api/files/create_folder/ - Create folder
    - POST /api/files/move/ - Move items
    - GET /api/files/stats/ - Get file system statistics
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_queryset(self):
        """Filter queryset to current user's files only"""
        return FileItem.objects.filter(created_by=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return FileItemListSerializer
        elif self.action == 'create_folder':
            return FolderCreateSerializer
        elif self.action == 'upload':
            return FileUploadSerializer
        elif self.action == 'move':
            return FileMoveSerializer
        return FileItemSerializer
    
    def list(self, request):
        """
        GET /api/files/?path=/folder1/subfolder
        List files and folders in specified path
        """
        try:
            path = request.query_params.get('path', '/')
            search = request.query_params.get('search', '')
            
            # Get items in the specified path
            queryset = self.get_queryset().filter(path=path)
            
            # Apply search filter if provided
            if search:
                queryset = queryset.filter(
                    Q(name__icontains=search)
                )
            
            # Order by type (folders first) then name
            queryset = queryset.order_by('type', 'name')
            
            serializer = self.get_serializer(queryset, many=True)
            
            return Response({
                'success': True,
                'data': serializer.data,
                'path': path,
                'count': queryset.count()
            })
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def create(self, request):
        """
        POST /api/files/
        Create folder or upload file based on request data
        """
        try:
            item_type = request.data.get('type', 'file')
            
            if item_type == 'folder':
                serializer = FolderCreateSerializer(
                    data=request.data,
                    context={'request': request}
                )
            else:
                serializer = FileUploadSerializer(
                    data=request.data, 
                    context={'request': request}
                )
            
            if serializer.is_valid():
                item = serializer.save()
                response_serializer = FileItemSerializer(
                    item, 
                    context={'request': request}
                )
                
                return Response({
                    'success': True,
                    'data': response_serializer.data,
                    'message': f'{item_type.title()} created successfully'
                }, status=status.HTTP_201_CREATED)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def retrieve(self, request, pk=None):
        """
        GET /api/files/{id}/
        Get specific file or folder details
        """
        try:
            item = get_object_or_404(self.get_queryset(), pk=pk)
            serializer = self.get_serializer(item)
            
            return Response({
                'success': True,
                'data': serializer.data
            })
        
        except Exception as e:
            return Response({
                'success': False,
                'error': 'Item not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """
        PUT/PATCH /api/files/{id}/
        Update file or folder (mainly for renaming)
        """
        try:
            item = get_object_or_404(self.get_queryset(), pk=pk)
            serializer = self.get_serializer(
                item, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'Item updated successfully'
                })
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, pk=None):
        """
        DELETE /api/files/{id}/
        Delete file or folder (recursively for folders)
        """
        try:
            item = get_object_or_404(self.get_queryset(), pk=pk)
            item_name = item.name
            item_type = item.get_type_display()
            
            # This will handle recursive deletion for folders
            item.delete()
            
            return Response({
                'success': True,
                'message': f'{item_type} "{item_name}" deleted successfully'
            })
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        GET /api/files/{id}/download/
        Download file content
        """
        try:
            item = get_object_or_404(
                self.get_queryset().filter(type='file'), 
                pk=pk
            )
            
            if not item.file_data:
                raise Http404("File content not found")
            
            # Get the file path
            file_path = item.file_data.path
            
            if not os.path.exists(file_path):
                raise Http404("File not found on disk")
            
            # Determine content type
            content_type = item.mime_type or 'application/octet-stream'
            
            # Create response with file content
            with open(file_path, 'rb') as f:
                response = HttpResponse(
                    f.read(),
                    content_type=content_type
                )
                response['Content-Disposition'] = f'attachment; filename="{item.name}"'
                response['Content-Length'] = item.size
                return response
        
        except Exception as e:
            return Response({
                'success': False,
                'error': 'File not found or cannot be downloaded'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def upload(self, request):
        """
        POST /api/files/upload/
        Upload multiple files to specified path
        """
        try:
            files = request.FILES.getlist('files')
            path = request.data.get('path', '/')
            results = []
            errors = []
            
            for file in files:
                try:
                    file_data = {
                        'name': file.name,
                        'path': path,
                        'file_data': file,
                        'is_public': request.data.get('is_public', False)
                    }
                    
                    serializer = FileUploadSerializer(
                        data=file_data,
                        context={'request': request}
                    )
                    
                    if serializer.is_valid():
                        item = serializer.save()
                        response_serializer = FileItemSerializer(
                            item,
                            context={'request': request}
                        )
                        results.append(response_serializer.data)
                    else:
                        errors.append({
                            'file': file.name,
                            'errors': serializer.errors
                        })
                
                except Exception as e:
                    errors.append({
                        'file': file.name,
                        'error': str(e)
                    })
            
            return Response({
                'success': len(errors) == 0,
                'uploaded': len(results),
                'errors': len(errors),
                'data': results,
                'error_details': errors if errors else None,
                'message': f'Uploaded {len(results)} file(s) successfully'
            }, status=status.HTTP_201_CREATED if len(errors) == 0 else status.HTTP_207_MULTI_STATUS)
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def create_folder(self, request):
        """
        POST /api/files/create_folder/
        Create a new folder
        """
        try:
            serializer = FolderCreateSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                folder = serializer.save()
                response_serializer = FileItemSerializer(
                    folder,
                    context={'request': request}
                )
                
                return Response({
                    'success': True,
                    'data': response_serializer.data,
                    'message': 'Folder created successfully'
                }, status=status.HTTP_201_CREATED)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def move(self, request):
        """
        POST /api/files/move/
        Move multiple files/folders to a new location
        """
        try:
            serializer = FileMoveSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                target_path = serializer.validated_data['target_path']
                item_ids = serializer.validated_data['items']
                
                items = self.get_queryset().filter(id__in=item_ids)
                moved_items = []
                
                for item in items:
                    # Prevent moving item into itself (for folders)
                    if item.type == 'folder' and target_path.startswith(item.full_path):
                        continue
                    
                    # Update the item's path
                    item.path = target_path
                    item.save()
                    moved_items.append(item)
                
                return Response({
                    'success': True,
                    'moved': len(moved_items),
                    'message': f'Moved {len(moved_items)} item(s) successfully'
                })
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        GET /api/files/stats/
        Get file system statistics for the current user
        """
        try:
            queryset = self.get_queryset()
            
            # Get basic statistics
            total_files = queryset.filter(type='file').count()
            total_folders = queryset.filter(type='folder').count()
            total_size = queryset.filter(
                type='file',
                size__isnull=False
            ).aggregate(total=Sum('size'))['total'] or 0
            
            # Get recent files (last 7 days)
            recent_cutoff = timezone.now() - timedelta(days=7)
            recent_files = queryset.filter(
                created_at__gte=recent_cutoff,
                type='file'
            ).order_by('-created_at')[:5]
            
            stats_data = {
                'total_files': total_files,
                'total_folders': total_folders,
                'total_size': total_size,
                'recent_files': recent_files
            }
            
            serializer = FileStatsSerializer(stats_data)
            
            return Response({
                'success': True,
                'data': serializer.data
            })
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['delete'])
    def bulk_delete(self, request):
        """
        DELETE /api/files/bulk_delete/
        Delete multiple files/folders
        """
        try:
            item_ids = request.data.get('items', [])
            
            if not item_ids:
                return Response({
                    'success': False,
                    'error': 'No items specified for deletion'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            items = self.get_queryset().filter(id__in=item_ids)
            deleted_count = items.count()
            
            # Delete all items (model's delete method handles file cleanup)
            for item in items:
                item.delete()
            
            return Response({
                'success': True,
                'deleted': deleted_count,
                'message': f'Deleted {deleted_count} item(s) successfully'
            })
        
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)