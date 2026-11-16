from django.contrib import admin

from .models import Follow


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('follower', 'followed', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('follower__username', 'followed__username')
    raw_id_fields = ('follower', 'followed')
