from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderPlacedViewSet, get_csrf,  LoginAPIView, ItemViewSet, UserViewSet, GroupViewSet, OrderItemViewSet, OrderViewSet, ShippingAddressViewSet, WhoAmIView, logout_view

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'items', ItemViewSet)
router.register(r'order', OrderViewSet)
router.register(r'order-item', OrderItemViewSet)
router.register(r'shipping', ShippingAddressViewSet)
router.register(r'order-placed', OrderPlacedViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('csrf', get_csrf, name='api-csrf'),
    path('login', LoginAPIView.as_view(), name='api-login'),
    path('whoami', WhoAmIView.as_view(), name='whoami'),
    path('logout', logout_view, name='api-logout'),
]
