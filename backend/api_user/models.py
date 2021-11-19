from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

from backend.models import TimeStampMixin
from .user_manager import UserManager


class User(TimeStampMixin, AbstractBaseUser, PermissionsMixin):
    """ Ovveride base user model.
    """


    name = models.CharField(max_length = 250)
    surname = models.CharField(max_length = 250)
    email = models.EmailField(max_length = 250, unique = True)

    is_official = models.BooleanField(default=False)
    is_active = models.BooleanField(default = True)
    is_staff = models.BooleanField(default = False)


    # relations
    # some user relations here e.g.:
    #   subscription = models.OneToOneField(Subscription, on_delete = models.CASCADE, null = True)


    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()


    def email_user(self, subject, message, from_email=None, **kwargs):
        ''' Sends an email to this User.
        '''
        send_mail(subject, message, from_email, [self.email], **kwargs)