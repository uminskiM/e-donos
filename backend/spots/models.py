from django.db import models
from django.conf import settings

class Spot(models.Model):

    class SpotCategory(models.TextChoices):
        WYSYPISKO_SMIECI = 'WYSYPISKO'
        DZIURA_W_DRODZE = 'HOLE'
        FAJNY_SKLEP = 'GOOD_SHOP'
        DOBRA_RESTAURACJA = 'GOOD_RESTAURANT'
        PALENIE_SMIECI = 'PALENIE_SMIECI'
        LADNE_MIEJSCE = 'NICE PLACE'
        WYDARZENIE_SPORTOWE = 'SPORT EVENT'
        ROBOTY_DROGOWE = 'ROBOTY_DROGOWE'
        NIEBEZPIECZNE_MIEJSCE = 'DANGEROUS_PLACE'
        DROBNE_NAPRAWY = 'TINY FIXES'
        USZKODZONE_OSWIETLENIE = 'BROKEN_LIGHTS'
        ZAROSNIETE_KRZAKAMI = 'BUSH'

    latitude = models.DecimalField
    longitude = models.DecimalField
    category = models.CharField(
        max_length=256,
        choices=SpotCategory.choices
    )
    comment = models.CharField(
        max_length=512
    )
    photo = models.CharField
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)


