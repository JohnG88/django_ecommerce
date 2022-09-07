from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Item, ShippingAddress, CustomUser, Order, OrderItem
# Register your models here
admin.site.register(Item)
admin.site.register(ShippingAddress)
admin.site.register(CustomUser, UserAdmin)
admin.site.register(Order)
admin.site.register(OrderItem)
