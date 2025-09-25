from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Users authentication routes (register, login, logout, refresh)
    path('api/auth/', include('users.urls')),
]
