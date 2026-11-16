from django.contrib import admin

from .models import ModerationLog


@admin.register(ModerationLog)
class ModerationLogAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'admin', 'action', 'target_username', 'target_post')
    list_filter = ('action',)
    search_fields = ('target_username', 'reason')
