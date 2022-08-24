from django.db import models
from django.core.validators import FileExtensionValidator
from decimal import Decimal

# Create your models here.

class Item(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="item_images", validators=[FileExtensionValidator(['png', 'jpg', 'jpeg'])])
    price = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    description = models.TextField(blank=True)
    stock = models.PositiveIntegerField(default=0)
    sold = models.PositiveIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} | {self.price} | {self.stock} | {self.sold}'
