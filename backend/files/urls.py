from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileManagementViewSet

# Create router for file management
router = DefaultRouter()
router.register(r'files', FileManagementViewSet, basename='files')

urlpatterns = [
    # File management routes: /api/files/
    path('', include(router.urls)),
]

# Available endpoints:
# GET    /api/files/                    - List files in current path (?path=/folder)
# POST   /api/files/                    - Create folder or upload file
# GET    /api/files/{id}/               - Get specific file/folder details  
# PUT    /api/files/{id}/               - Update file/folder (rename)
# DELETE /api/files/{id}/               - Delete file/folder
# GET    /api/files/{id}/download/      - Download file
# POST   /api/files/upload/             - Upload multiple files
# POST   /api/files/create_folder/      - Create new folder
# POST   /api/files/move/               - Move items to new location
# GET    /api/files/stats/              - Get file system statistics
# DELETE /api/files/bulk_delete/        - Delete multiple items