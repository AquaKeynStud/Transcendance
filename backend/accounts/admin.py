from django.contrib import admin
from django.contrib.auth import forms as auth_forms
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


class UserCreationForm(auth_forms.UserCreationForm):
    class Meta(auth_forms.UserCreationForm.Meta):
        model = User
        fields = ('username', 'email')


class UserChangeForm(auth_forms.UserChangeForm):
    class Meta(auth_forms.UserChangeForm.Meta):
        model = User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Django admin site (dev tool). The product's admin UI lives in the SPA."""

    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('username', 'email', 'role', 'is_private', 'is_banned', 'date_joined')
    list_filter = ('role', 'is_private', 'is_banned', 'is_staff')
    search_fields = ('username', 'email', 'display_name')
    ordering = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Profile', {'fields': ('display_name', 'bio', 'avatar')}),
        ('Privacy', {'fields': ('is_private', 'likes_visibility', 'reposts_visibility')}),
        ('Moderation', {'fields': ('role', 'is_banned', 'ban_reason')}),
        ('Django admin access', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Dates', {'fields': ('last_login', 'last_seen', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('username', 'email', 'password1', 'password2')}),
    )
