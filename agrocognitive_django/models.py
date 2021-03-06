from django.db import models
from django.contrib.auth.models import Group, Permission
from django.db.models.fields import TextField
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class MyUserManager(BaseUserManager):
    """
    A custom user manager to deal with emails as unique identifiers for auth
    instead of usernames. The default that's used is "UserManager"
    """
    def _create_user(self, ident, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not ident:
            raise ValueError('The Email must be set')
        ident = self.normalize_email(ident)
        user = self.model(ident=ident, **extra_fields)
        user.set_password(password)

        user.save()
        return user

    def create_superuser(self, ident, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        user = self._create_user(ident, password,
                                 direccion = "",
                                 **extra_fields)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    
    ident = models.CharField(max_length = 30, unique=True)
    email = models.EmailField(unique=True, null=True)
    is_superuser = models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')
    verified     = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)
    first_name   = models.CharField(blank=True, max_length=30, verbose_name='first name')
    last_name    = models.CharField(blank=True, max_length=30, verbose_name='last name')
    direccion = models.TextField(max_length = 1000)
    client_id = models.CharField(blank = True, null = True, max_length = 50)
    client_secret = models.CharField(blank = True, null = True, max_length = 50)
    client_data = models.CharField(blank = True, null = True, max_length = 2000000)
    # validation_status =

    USERNAME_FIELD = 'ident'
    objects = MyUserManager()

    def __str__(self):
        return self.ident

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.first_name
		