from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model, authenticate, login
from django.http import Http404
from rest_framework import serializers, viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, GroupSerializer, ItemSerializer, OrderItemSerializer, OrderSerializer, ShippingAddressSerializer
from .models import Item, OrderItem, Order, ShippingAddress

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request,user)
            return Response({'Message': 'Logged in'}, status=status.HTTP_200_OK)
        else:
            return Response({'Message': 'Invalid username and password combination'}, status=status.HTTP_401_UNAUTHORIZED)

class UserViewSet(viewsets.ModelViewSet):
    """
        API endpoint that allows users to be viewed or edited.
    """

    queryset = get_user_model().objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class GroupViewSet(viewsets.ModelViewSet):

    """
        API endpoint that allows users to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    #permission_classes = [permissions.IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    
   # def get_queryset(self):
        #user = self.request.user
        #return OrderItem.objects.filter(customer=user.id)


class ShippingAddressViewSet(viewsets.ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer


class DetailItem(APIView):
    """
        Retrieve, update or delete an item instance.
    """
    def get_object(self, id):
        try:
            return Item.objects.get(id=id)
        except Item.DoesNotExist:
            raise Http404

    def get(self, request, id, format=None):
        item = self.get_object(id)
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    def put(self, request, id, format=None):
        item = self.get_object(id)
        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, format=None):
        item = self.get_object(id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

        
