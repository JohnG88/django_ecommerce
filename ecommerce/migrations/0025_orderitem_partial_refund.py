# Generated by Django 4.1 on 2023-02-22 01:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0024_orderitem_quantity_returned'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='partial_refund',
            field=models.BooleanField(default=False),
        ),
    ]
