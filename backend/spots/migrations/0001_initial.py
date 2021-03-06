# Generated by Django 3.2.7 on 2021-11-19 22:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Spot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('WYSYPISKO', 'Wysypisko Smieci'), ('HOLE', 'Dziura W Drodze'), ('GOOD_SHOP', 'Fajny Sklep'), ('GOOD_RESTAURANT', 'Dobra Restauracja'), ('PALENIE_SMIECI', 'Palenie Smieci'), ('NICE PLACE', 'Ladne Miejsce'), ('SPORT EVENT', 'Wydarzenie Sportowe'), ('ROBOTY_DROGOWE', 'Roboty Drogowe'), ('DANGEROUS_PLACE', 'Niebezpieczne Miejsce'), ('TINY FIXES', 'Drobne Naprawy'), ('BROKEN_LIGHTS', 'Uszkodzone Oswietlenie'), ('BUSH', 'Zarosniete Krzakami')], max_length=256)),
                ('comment', models.CharField(max_length=512)),
                ('reporter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
