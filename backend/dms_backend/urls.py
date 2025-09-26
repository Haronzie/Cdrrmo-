from django.contrib import admin
from django.urls import path, include
from users.urls import auth_urlpatterns, management_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication routes: /api/auth/
    path('api/auth/', include(auth_urlpatterns)),
    
    # User management routes: /api/admin/
    path('api/admin/', include(management_urlpatterns)),
]