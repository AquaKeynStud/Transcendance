"""
API pagination (SPEC_TECH §3).

- `CursorPagination` (default): everything that scrolls (feeds, replies, messages,
  notifications). Response: {"next", "previous", "results"}.
- `PageNumberPagination`: admin and search. Response: {"count", "next", "previous", "results"}.
"""

from rest_framework import pagination


class CursorPagination(pagination.CursorPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    # Views whose model has no `created_at` field must override `ordering`.
    ordering = '-created_at'


class PageNumberPagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
