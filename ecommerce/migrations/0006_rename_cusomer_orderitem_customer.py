# Generated by Django 4.1 on 2022-09-01 01:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0005_rename_user_orderitem_cusomer'),
    ]

    operations = [
        migrations.RenameField(
            model_name='orderitem',
            old_name='cusomer',
            new_name='customer',
        ),
    ]
