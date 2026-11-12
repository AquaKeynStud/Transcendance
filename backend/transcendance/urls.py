from django.conf import settings
from django.contrib import admin
from django.urls import include, path

from core.views import HealthView

# API v1 routes. Each app adds its own `include('<app>.urls')` here.
api_v1_patterns = [
    path('health/', HealthView.as_view(), name='health'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1_patterns)),
]

# OpenAPI docs, dev only (SPEC_TECH §1).
if settings.DEBUG:
    from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

    urlpatterns += [
        path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
        path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
    ]
