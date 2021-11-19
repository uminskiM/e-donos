from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    """ Override custom user manager.
    """

    use_in_migrations = True


    def __create_user(self, email, password, **extra_fields):
        """ Creates and saves a User with the given eappail and password.
        """
        if not email:
            raise ValueError('The email must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        
        return user


    def create_user(self, email, password, **extra_fields):
        """ Create normal user.
        """
        extra_fields.setdefault('is_superuser', False)

        if extra_fields.get('is_superuser') is True:
            raise ValueError('Normal user must have is_superuser=False.')
        
        return self.__create_user(email, password, **extra_fields)
        

    def create_superuser(self, email, password, **extra_fields):
        """ Create superuser.
        """
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', True)
        
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.__create_user(email, password, **extra_fields)