from operator import add
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.models import User
from django.http import Http404, JsonResponse
from django.middleware.csrf import get_token
from django.utils import timezone

from rest_framework import serializers, viewsets
from rest_framework import permissions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import response
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, GroupSerializer, ItemSerializer, OrderItemSerializer, OrderSerializer, ShippingAddressSerializer
from .models import Item, OrderItem, Order, ShippingAddress, CustomUser

def is_valid_form(values):
    valid = True
    for field in values:
        if field == '':
            valid = False
    return valid
'''
def get_csrf(request):
    response = JsonResponse({'Info': 'Success - Set CSRF cookie'})
    response['X-CSRFToken'] = get_token(request)
    print(f"Response {response}")
    return response
'''

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


'''
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
'''

'''
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)


    def post(self, request):
        try:
            data = request.data

            first_name = data['first_name']
            last_name = data['last_name']
            username = data['username']
            email = data['email']
            password = data['password']
            re_password = data['re_password']

            if password == re_password:
                user = CustomUser.objects.create(
                    first_name=first_name,
                    last_name=last_name,
                    username=username,
                    email=email,
                    password=password,
                )
                user.save()
                return Response({
                    'success': 'Account created successfully.'
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'error': 'Password do not match.'
                }, status=status.HTTP_400_BAD_REQUEST)

        except:
            return Response({
                'error': 'Something went wrong when trying to register account.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
'''
'''
{
 "first_name": "Coolio",
 "last_name": "Mando",
 "username": "CoolMan",
 "password":  "qwertghj",
 "re_password": "qwertghj",
}
'''


class UserViewSet(viewsets.ModelViewSet):
    """
        API endpoint that allows users to be viewed or edited.
    """

    queryset = get_user_model().objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

class GroupViewSet(viewsets.ModelViewSet):

    """
        API endpoint that allows users to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (IsAuthenticated,)

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticated,)

class OrderViewSet(viewsets.ModelViewSet):
    #authentication_classes = [SessionAuthentication]
    permission_classes = (IsAuthenticated,)
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = self.queryset
        user_ordered_items = queryset.filter(customer_id=self.request.user.id, ordered=False)
        return user_ordered_items

    #def put()

    def partial_update(self, request, pk):
        # instance before update
        instance = self.get_queryset()
        print(f"queryset {instance}")
        # read data from request
        self.request.data.get("ordered", None)
        #print(instance.query)
        ##updated_instance = serializer.save()
        #print(f"updated data {updated_instance}")

        single_main_order = Order.objects.get(id=pk)
        print(f"single main order {single_main_order}")

        user_order_items = OrderItem.objects.filter(customer_id=self.request.user.id, ordered=False) 
        print(f"user order items {user_order_items}")
        
        address_shipping_qs = ShippingAddress.objects.get(customer_id=self.request.user.id, address_type='S', default=True)
        print(f"shipping address {address_shipping_qs}")
        
        address_billing_qs = ShippingAddress.objects.get(customer_id=self.request.user.id, address_type='B', default=True)
        print(f"billing address {address_billing_qs}")
        
        single_main_order.shipping_address = address_shipping_qs
        single_main_order.billing_address = address_billing_qs
        single_main_order.ordered = True
        single_main_order.save()

        print(f"user item id {user_order_items}")
        user_order_items.update(ordered=True)
        for item in user_order_items:
            item.save()
            
        # Adding the context={'request': request} helps with AssertionError: `HyperlinkedRelatedField`
        serializer = OrderSerializer(single_main_order, context={'request': request})
        
        return Response(serializer.data)
        
    #def perform_create(self, serializer):
    #    queryset = self.queryset
    #    user_address = ShippingAddress.objects.get(customer_id=self.request.user.id)

class OrderItemViewSet(viewsets.ModelViewSet):
    #authentication_classes = [SessionAuthentication]
    permission_classes = (IsAuthenticated,)
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        queryset = self.queryset
        user_order_items = queryset.filter(customer_id=self.request.user.id, ordered=False)
        return user_order_items

    def perform_create(self, serializer):
        queryset = self.queryset
        #order_item_id = request.user.data.get('item', None)
        #item = Item.objects.get(id=order_item_id)

        # First save serializer, then can use serializer.data.get('id', None)
        serializer.save(customer_id=self.request.user.id)
        item_order_id = serializer.data.get('id', None)
        print(f"Item order id {item_order_id}")
        print(f"Serializer data {serializer.data}")
        item_order_obj = queryset.get(id=item_order_id)
        print(f"Item order obj {item_order_obj}")
        order_qs = Order.objects.filter(customer_id=self.request.user.id, ordered=False)
        print(f"order qs, {order_qs}")
        if order_qs.exists():
            order = order_qs[0]
            print(f"order {order.items}")
            order.items.add(item_order_obj)
        else:
            ordered_date = timezone.now()
            order = Order.objects.create(
                customer_id=self.request.user.id, ordered_date=ordered_date
            )
            order.items.add(item_order_obj)
        # print(f"Order {order.id}")
        # If you want to set a list to m2m field write:
        # order.items.set(item_order_obj)
        # order.items.add(item_order_obj)
    
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
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        queryset = self.queryset
        user_address = queryset.filter(customer_id=self.request.user.id)
        return user_address

    def create(self, request, *args, **kwargs):
        queryset = self.queryset
        order = Order.objects.get(customer_id=request.user.id, ordered=False)
        print(f"Order {order}")
        user_shipping = request.data.get('shipping', None)
        user_billing = request.data.get('billing', None)
        user_default_shipping = request.data.get('user_default_shipping', None)
        print(f"default shipping {user_default_shipping}")
        print(f"request {request.data}")
        checkbox_check = request.data.get('checkbox', None);

        
        address_qs = queryset.filter(customer_id=request.user.id, address_type='S', default=True)
        print(f"Address qs {address_qs}")
        size_of_s_address = len(address_qs)
        print(f"Size of shipping address {size_of_s_address}")
        address_b_qs = queryset.filter(customer_id=request.user.id, address_type='B', default=True)
        size_of_b_address = len(address_b_qs)
        print(f"Address b qs {address_b_qs}")
        print(f"Size of billinging address {size_of_b_address}")
        
        if user_shipping:
            if user_default_shipping:
                print("Using the default shipping address.")
                print(f"address_qs {address_qs}")
                if address_qs.exists():
                    shipping_address = address_qs[0]
                    order.shipping_address = shipping_address
                    order.save()
                else:
                    return JsonResponse({"detail": "No default shipping address available."})
            else:
                print("User is entering a new shipping address.")
                address = request.data.get("address", None)
                apt = request.data.get("apt", None)
                city = request.data.get("city", None)
                state = request.data.get("state", None)
                zipcode = request.data.get("zipcode", None)
                if is_valid_form([address, apt, city, state, zipcode]):
                    shipping = ShippingAddress.objects.create(customer_id=request.user.id, address=address, apt=apt, city=city, state=state, zipcode=zipcode, address_type='S')
                    

                    if size_of_s_address == 0:
                        shipping.default = True
                    #else:
                    #    address_qs.update(default=False)
                    #    for s_address in address_qs:
                    #        s_address.save()

                    if checkbox_check:
                        address_qs.update(default=False)
                        for s_address in address_qs:
                            s_address.save()
                        shipping.default = True

                    shipping.save()
                    
                    billing_address = shipping
                    billing_address.pk = None
                    billing_address.default = False
                    billing_address.save()
                    billing_address.address_type = 'B'

                    
                    if size_of_b_address == 0:
                        billing_address.default = True
                    #else:
                    #    address_b_qs.update(default=False)
                    #    for b_address in address_b_qs:
                    #        b_address.save()

                    billing_address.save()
                    
                    order.shipping_address = shipping
                    order.billing_address = billing_address 

                    order.save() 

                    return JsonResponse({"detail": "Created shipping address."})

        user_default_billing = request.data.get('user_default_billing', None)
        default_billing = request.data.get('billing_checkbox', None)

        if user_billing:
            if user_default_billing:
                print("Using the default billing address")
                #billing_qs = ShippingAddress.objects.filter(customer_id=request.user.id, address_type='B', default=True)
                if address_b_qs.exists():
                    billing_address = address_b_qs[0]
                    order.billing_address = billing_address
                    order.save()
                else:
                    return JsonResponse({'detail': 'No default billing address available.'})
            else:
                print("User is entering a new billing address.")
                address = request.data.get("address", None)
                apt = request.data.get("apt", None)
                city = request.data.get("city", None)
                state = request.data.get("state", None)
                zipcode = request.data.get("zipcode", None)
            
                if is_valid_form([address, apt, city, state, zipcode]):
                    billing_address = ShippingAddress.objects.create(customer_id=request.user.id, address=address, apt=apt, city=city, state=state, zipcode=zipcode, address_type='B')
                    order.billing_address = billing_address

                    if default_billing:
                        address_b_qs.update(default=False)
                        for b_address in address_b_qs:
                            b_address.save()
                        billing_address.default = True
                        billing_address.save()
                    order.save()


                    return JsonResponse({'detail': 'Created billing address'})

    def partial_update(self, request, pk):
        print("partial update")
        single_address = ShippingAddress.objects.get(id=pk)
        print(f"single address {single_address}")
        address_shipping_qs = self.queryset.filter(customer_id=request.user.id, address_type='S', default=True)
        address_billing_qs = self.queryset.filter(customer_id=request.user.id, address_type='B', default=True)
        
        user_default_shipping = request.data.get('user_default_shipping', None)
        print(f"User default shippin {user_default_shipping}")

        if user_default_shipping:
            address_shipping_qs.update(default=False)
            for item in address_shipping_qs:
                print(f"shipping default items {item}")
                item.save()

            single_address.default = True
            single_address.save()
     
        user_default_billing = request.data.get('user_default_billing', None)
        print(f"User default billing {user_default_billing}")

        if user_default_billing:
            address_billing_qs.update(default=False)
            for item in address_billing_qs:
                print(f"billing deafult items {item}")
                item.save()

            single_address.default = True
            single_address.save()
                
      

        return JsonResponse({'detail': 'updated address'})



class OrderPlacedViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = self.queryset
        latest_order = queryset.filter(customer_id=self.request.user.id)[:1]
        return latest_order

    #def get_object(self):
    #    queryset = self.get_queryset()
    #    return get_object_or_404(queryset)

'''
glasseDetailItem(APIView):
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
'''
