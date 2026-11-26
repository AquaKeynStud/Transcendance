"""
Avatar processing (ACC-04): JPG, PNG or WEBP up to 2 MB, cropped to a square.

The uploaded file is never stored as-is: it is decoded, cropped, resized and
re-encoded as WEBP. This checks the real format (not the extension, MEDIA-03)
and drops the metadata a photo may carry, such as its GPS position (EXIF).
"""

from io import BytesIO

from django.core.files.base import ContentFile
from PIL import Image, ImageOps, UnidentifiedImageError
from rest_framework import serializers

from core.exceptions import FileTooLarge

MAX_AVATAR_BYTES = 2 * 1024 * 1024
ALLOWED_FORMATS = {'JPEG', 'PNG', 'WEBP'}
AVATAR_SIZE = 512
FORMAT_ERROR = 'Use a JPG, PNG or WEBP image.'


def process_avatar(uploaded):
    """Return the square WEBP avatar to store, or raise a 400 / 413 API error."""
    if uploaded.size > MAX_AVATAR_BYTES:
        raise FileTooLarge(
            'The avatar must be 2 MB or less.',
            fields={'avatar': ['The avatar must be 2 MB or less.']},
        )

    try:
        image = Image.open(uploaded)
        image_format = image.format
        image.load()  # decodes the whole file: a truncated or fake image fails here
    except (UnidentifiedImageError, Image.DecompressionBombError, OSError) as exc:
        raise serializers.ValidationError({'avatar': [FORMAT_ERROR]}) from exc
    if image_format not in ALLOWED_FORMATS:
        raise serializers.ValidationError({'avatar': [FORMAT_ERROR]})

    image = ImageOps.exif_transpose(image)  # keep phone photos the right way up
    has_alpha = image.mode in ('RGBA', 'LA') or 'transparency' in image.info
    image = image.convert('RGBA' if has_alpha else 'RGB')
    image = ImageOps.fit(image, (AVATAR_SIZE, AVATAR_SIZE), Image.Resampling.LANCZOS)

    output = BytesIO()
    image.save(output, format='WEBP', quality=85)
    return ContentFile(output.getvalue(), name='avatar.webp')
