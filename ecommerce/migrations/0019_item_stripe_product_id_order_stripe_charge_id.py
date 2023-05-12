# Generated by Django 4.1 on 2023-01-31 02:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0018_alter_customuser_age'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='stripe_product_id',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='stripe_charge_id',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
    ]