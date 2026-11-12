from django.http import Http404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView

factory = APIRequestFactory()


class RaisingView(APIView):
    """GET raises the exception given in `exc`; POST needs a logged-in user."""

    exc = None

    def get(self, request):
        raise self.exc

    def post(self, request):
        return Response(status=201)


def call(exc=None, method='get'):
    view = RaisingView.as_view(exc=exc)
    request = getattr(factory, method)('/test/')
    response = view(request)
    response.render()
    return response


def test_health(api_client):
    response = api_client.get('/api/v1/health/')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}


def test_validation_error_format():
    response = call(serializers.ValidationError({'username': ['Already taken.']}))
    assert response.status_code == 400
    assert response.data == {
        'error': {
            'code': 'validation_error',
            'message': 'Some fields are invalid.',
            'fields': {'username': ['Already taken.']},
        }
    }


def test_non_field_errors_become_the_message():
    response = call(
        serializers.ValidationError({'non_field_errors': ['Passwords do not match.']})
    )
    assert response.data['error']['message'] == 'Passwords do not match.'
    assert response.data['error']['fields'] == {}


def test_http404_is_formatted():
    response = call(Http404())
    assert response.status_code == 404
    assert response.data['error']['code'] == 'not_found'
    assert response.data['error']['fields'] == {}


def test_anonymous_write_returns_401():
    response = call(method='post')
    assert response.status_code == 401
    assert response.data['error']['code'] == 'not_authenticated'
