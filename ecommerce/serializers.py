from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Item, Order, OrderItem, ShippingAddress

# Can use primary keys and various other relationships, but hyperlinking is good RESTful design

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'name', 'image', 'price', 'description', 'stock', 'sold', 'created')

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'customer', 'items', 'ordered_date', 'shipping_address', 'billing_address', 'being_delivered', 'received', 'refund_requested', 'refund_granted']

class OrderItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'user', 'ordered', 'item', 'quantity']

class ShippingAddressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['id', 'customer', 'item', 'address', 'apt', 'city', 'state', 'zipcode']
