from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.urls import auth_urlpatterns, management_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication routes: /api/auth/
    path('api/auth/', include(auth_urlpatterns)),
    
    # User management routes: /api/admin/
    path('api/admin/', include(management_urlpatterns)),
    
    # File management routes: /api/
    path('api/', include('files.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)