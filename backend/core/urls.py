from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'businesses', views.BusinessViewSet, basename='business')
router.register(r'bids', views.InvestmentBidViewSet, basename='bid')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'messages', views.MessageViewSet, basename='message')

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', views.MeView.as_view(), name='me'),
    path('investor-profile/', views.InvestorProfileView.as_view(), name='investor-profile'),
    path('recommendations/', views.RecommendationListView.as_view(), name='recommendations'),
    path('', include(router.urls)),
]
