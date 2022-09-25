from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Item, Order, OrderItem, ShippingAddress

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

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'customer', 'items', 'ordered_date', 'shipping_address', 'billing_address', 'being_delivered', 'received', 'refund_requested', 'refund_granted']

class OrderItemSerializer(serializers.HyperlinkedModelSerializer):
    customer_detail = UserSerializer(source='customer', read_only=True)
    item_detail = ItemSerializer(source='item', read_only=True)
    get_total_item_price = serializers.CharField(required=False)
    class Meta:
        model = OrderItem
        fields = ['id', 'customer', 'customer_detail', 'ordered', 'item', 'item_detail', 'quantity', 'get_total_item_price']
        read_only_fields = ('customer',)

class ShippingAddressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['id', 'customer', 'item', 'address', 'apt', 'city', 'state', 'zipcode']
