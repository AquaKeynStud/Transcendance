from django.contrib import admin

from .models import Like, Mention, Post, Repost


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'title', 'is_reply', 'created_at', 'deleted_at')
    list_filter = ('is_reply', 'deleted_by_admin')
    search_fields = ('title', 'content', 'author__username')
    raw_id_fields = ('author', 'parent')


@admin.register(Like, Repost)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    raw_id_fields = ('user', 'post')


@admin.register(Mention)
class MentionAdmin(admin.ModelAdmin):
    list_display = ('user', 'post')
    raw_id_fields = ('user', 'post')
