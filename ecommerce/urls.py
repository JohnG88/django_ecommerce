from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterAPIView, OrderPlacedViewSet, ItemViewSet, UserViewSet, GroupViewSet, OrderItemViewSet, OrderViewSet, ShippingAddressViewSet, RefundOrderViewset, RefundItemOrderViewset, CardView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'items', ItemViewSet)
router.register(r'order', OrderViewSet)
router.register(r'order-item', OrderItemViewSet)
router.register(r'shipping', ShippingAddressViewSet)
router.register(r'order-placed', OrderPlacedViewSet)
router.register(r'refund-order', RefundOrderViewset)
router.register(r'refund-item', RefundItemOrderViewset)

urlpatterns = [
    path('', include(router.urls)),
    path('register', RegisterAPIView.as_view(), name='register'),
    path('cards', CardView.as_view(), name='cards'),

    #path('csrf', get_csrf, name='api-csrf'),
    #path('login', LoginAPIView.as_view(), name='api-login'),
    #path('whoami', WhoAmIView.as_view(), name='whoami'),
    #path('logout', logout_view, name='api-logout'),
]
