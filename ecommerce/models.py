from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.validators import FileExtensionValidator
from decimal import Decimal

# Create your models here.
ADDRESS_CHOICES = (
    ('B', 'Billing'),
    ('S', 'Shipping'),
)


class CustomUser(AbstractUser):
    pass
    # add additional fields here

    def __str__(self):
        return self.username

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

class OrderItem(models.Model):
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f'{self.quantity} of {self.item.name}'
   
    def get_total_item_price(self):
        return self.quantity * self.item.price

class Order(models.Model):
    customer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    shipping_address = models.ForeignKey('ShippingAddress', related_name='shipping_address', on_delete=models.SET_NULL, blank=True, null=True)
    billing_address = models.ForeignKey('ShippingAddress', related_name='billing_address', on_delete=models.SET_NULL, blank=True, null=True)
    being_delivered = models.BooleanField(default=False)    
    received = models.BooleanField(default=False)    
    refund_requested = models.BooleanField(default=False)    
    refund_granted = models.BooleanField(default=False)

    class Meta:
        ordering = ('-ordered_date',)

    def __str__(self):
        return f"{self.customer.username}"
   
    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_total_item_price()
        return total

class ShippingAddress(models.Model):
    customer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    #item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True)
    address = models.CharField(max_length=500, null=False)
    apt = models.CharField(max_length=100, null=False, blank=True)
    city = models.CharField(max_length=300, null=False)
    state = models.CharField(max_length=200, null=False)
    zipcode = models.CharField(max_length=200, null=False)
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES)
    default = models.BooleanField(default=False)

    class Meta:
        ordering = ('-default',)
        verbose_name_plural = 'ShippingAddresses'

    def __str__(self):
        return f'{self.customer.username} | {self.state} | {self.address_type}'
