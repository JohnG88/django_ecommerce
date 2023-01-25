from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Item, ShippingAddress, CustomUser, Order, OrderItem
# Register your models here

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username',)

    fieldsets = (
        *UserAdmin.fieldsets, (
            'Other Personal info',
            {
                'fields': (
                    'avatar',
                )
            }
        )
    )

admin.site.register(Item)
admin.site.register(ShippingAddress)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Order)
admin.site.register(OrderItem)
