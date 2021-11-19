from django.db.utils import IntegrityError
from django.http import JsonResponse
from rest_framework.views import exception_handler


def app_exception_handler(exc, context):
    
    response = exception_handler(exc, context)

    if isinstance(exc, IntegrityError):
        return JsonResponse(
            str(exc) \
                .split('DETAIL:')[1] \
                .replace('=', ' ') \
                .replace('(', '') \
                .replace(')', ''),
            safe = False,
            status = 409
        )

    return response