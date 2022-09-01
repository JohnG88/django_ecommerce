from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, UserViewSet, GroupViewSet, OrderItemViewSet, OrderViewSet, ShippingAddressViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'items', ItemViewSet)
router.register(r'order', OrderViewSet)
router.register(r'order-item', OrderItemViewSet)
router.register(r'shipping', ShippingAddressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
