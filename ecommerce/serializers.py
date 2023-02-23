from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework import serializers
import rest_framework
from .models import CustomUser, Item, Order, OrderItem, ShippingAddress
from decimal import Decimal

#from rest_framework.response import Response 
# Can use primary keys and various other relationships, but hyperlinking is good RESTful design

class CreateUserSerializer(serializers.ModelSerializer):
    #re_password = serializers.CharField()
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')
        #extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        '''
        password = validated_data['password']
        re_password = validated_data['re_password']

        if password != re_password:
            raise serializers.ValidationError("Passwords don't match.")
        else:
        '''
        user = CustomUser(username=validated_data['username'], email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'groups', 'age', 'avatar']

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
        fields = ['id', 'customer', 'customer_detail', 'ordered', 'item', 'item_detail', 'quantity', 'quantity_returned', 'get_total_item_price', 'refunded', 'partial_refund']
        read_only_fields = ('customer',)

class ShippingAddressSerializer(serializers.HyperlinkedModelSerializer):
    customer_detail = UserSerializer(source="customer", read_only=True)
    class Meta:
        model = ShippingAddress
        fields = ['id', 'customer', 'customer_detail', 'address', 'apt', 'city', 'state', 'zipcode', 'address_type', 'default']

class OrderSerializer(serializers.HyperlinkedModelSerializer):
    customer_detail = UserSerializer(source='customer', read_only=True)
    # When using ManyToManyField, set many=True
    order_items= OrderItemSerializer(source='items', many=True, read_only=True)
    get_total = serializers.CharField(required=False)
    get_address = ShippingAddressSerializer(source="shipping_address", read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_detail', 'items', 'order_items', 'get_total', 'ordered_date', 'ordered', 'shipping_address', 'get_address', 'billing_address', 'being_delivered', 'received', 'refund_requested', 'refund_granted']
        read_only_fields = ('customer', 'items',)

class CardSerializer(serializers.Serializer):
    last4 = serializers.CharField()
    exp_month = serializers.IntegerField()
    exp_year = serializers.IntegerField()

