from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Item, Order, OrderItem, ShippingAddress
from decimal import Decimal

# Can use primary keys and various other relationships, but hyperlinking is good RESTful design

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'url', 'name', 'image', 'price', 'description', 'stock', 'sold', 'created']
        read_only_fields = ('image', 'name',)

class OrderItemSerializer(serializers.HyperlinkedModelSerializer):
    customer_detail = UserSerializer(source='customer', read_only=True)
    item_detail = ItemSerializer(source='item', read_only=True)
    get_total_item_price = serializers.CharField(required=False)
    #get_total_item_price = serializers.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    class Meta:
        model = OrderItem
        fields = ['id', 'customer', 'customer_detail', 'ordered', 'item', 'item_detail', 'quantity', 'get_total_item_price']
        read_only_fields = ('customer',)

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    customer_detail = UserSerializer(source='customer', read_only=True)
    # When using ManyToManyField, set many=True
    order_items= OrderItemSerializer(source='items', many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_detail', 'items', 'order_items', 'order_items', 'ordered_date', 'shipping_address', 'billing_address', 'being_delivered', 'received', 'refund_requested', 'refund_granted']
        read_only_fields = ('customer', 'items',)

class ShippingAddressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['id', 'customer', 'item', 'address', 'apt', 'city', 'state', 'zipcode']
