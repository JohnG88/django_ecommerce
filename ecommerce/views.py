from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.http import Http404, JsonResponse
from django.middleware.csrf import get_token
from rest_framework import serializers, viewsets
from rest_framework import permissions
from rest_framework import response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, GroupSerializer, ItemSerializer, OrderItemSerializer, OrderSerializer, ShippingAddressSerializer
from .models import Item, OrderItem, Order, ShippingAddress


def get_csrf(request):
    response = JsonResponse({'Info': 'Success - Set CSRF cookie'})
    response['X-CSRFToken'] = get_token(request)
    print(f"Response {response}")
    return response

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username', None)
        password = request.data.get('password', None)
        if username is None or password is None:
            return JsonResponse({'detail': 'Please provide username and password.'})

        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({'detail': 'Invalid credentials.'}, status=400)
        login(request, user)
        return JsonResponse({'detail': 'Successfully logged in.', 'user': request.user.username})

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
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = self.queryset
        user_ordered_items = queryset.filter(customer_id=self.request.user.id)
        return user_ordered_items

class OrderItemViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        queryset = self.queryset
        user_order_items = queryset.filter(customer_id=self.request.user.id)
        return user_order_items

    def perform_create(self, serializer):
        queryset = self.queryset
        #order_item_id = request.user.data.get('item', None)
        #item = Item.objects.get(id=order_item_id)

        # Forst save serializer, then can use serializer.data.get('id', None)
        serializer.save(customer_id=self.request.user.id)
        item_order_id = serializer.data.get('id', None)
        print(f"Item order id {item_order_id}")
        print(f"Serializer data {serializer.data}")
        item_order_obj = queryset.get(id=item_order_id)
        print(f"Item order obj {item_order_obj}")
        order = Order.objects.get(customer_id=self.request.user.id)
        print(f"Order {order.id}")
        # If you want to set a list to m2m field write:
        # order.items.set(item_order_obj)
        order.items.add(item_order_obj)
    
    '''
    def post(request):
        user = request.user.id
        order_item_id = request.user.data.get('item', None)
        item = Item.objects.get(id=order_item_id)
        order_item = OrderItem(customer=user, item=item)
        order_item.save()
    '''
    '''
    def post(self, request):
        print(self.request.user)
        customer_id = request.data.get('customer', None)
        order_item_id = request.data.get('item', None)
        item = Item.objects.get(id=order_item_id)
        user = get_user_model().objects.get(id=customer_id)
        order_item = OrderItem(customer=user.url, item=item)
        order_item.save()
    '''

class ShippingAddressViewSet(viewsets.ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer

'''
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

''' 

class WhoAmIView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    @staticmethod
    def get(request, format=None):
        print(request.user.username)
        return JsonResponse({"username": request.user.username})


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)
    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})
