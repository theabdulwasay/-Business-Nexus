from django.db.models import Q
from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    User, InvestorProfile, Business, Recommendation, InvestmentBid,
    Transaction, Message,
)
from .serializers import (
    UserSerializer, RegisterSerializer, InvestorProfileSerializer,
    BusinessSerializer, RecommendationSerializer, InvestmentBidSerializer,
    TransactionSerializer, MessageSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all().order_by('-created_at')
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        industry = self.request.query_params.get('industry')
        search = self.request.query_params.get('search')
        if industry:
            qs = qs.filter(industry__iexact=industry)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(tags__icontains=search))
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class RecommendationListView(generics.ListAPIView):
    """Simple tag-overlap based recommendation for the logged-in investor."""
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        investor = self.request.user
        profile = InvestorProfile.objects.filter(user=investor).first()
        interests = set()
        if profile and profile.interests:
            interests = {t.strip().lower() for t in profile.interests.split(',') if t.strip()}

        results = []
        for business in Business.objects.filter(status='verified'):
            tags = {t.strip().lower() for t in business.tags.split(',') if t.strip()}
            score = len(interests & tags) if interests else 0.1
            if score > 0:
                rec, _ = Recommendation.objects.update_or_create(
                    investor=investor, business=business, defaults={'score': score}
                )
                results.append(rec)
        results.sort(key=lambda r: r.score, reverse=True)
        return results


class InvestmentBidViewSet(viewsets.ModelViewSet):
    serializer_class = InvestmentBidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'investor':
            return InvestmentBid.objects.filter(investor=user)
        return InvestmentBid.objects.filter(business__owner=user)

    def perform_create(self, serializer):
        serializer.save(investor=self.request.user)

    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """Business owner accepts/rejects a bid: {"status": "accepted"|"rejected"}"""
        bid = self.get_object()
        if bid.business.owner != request.user:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        new_status = request.data.get('status')
        if new_status not in ('accepted', 'rejected'):
            return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        bid.status = new_status
        bid.save()
        if new_status == 'accepted':
            Transaction.objects.create(bid=bid, amount=bid.amount, status='pending',
                                        reference=f'TXN-{bid.id}')
        return Response(InvestmentBidSerializer(bid).data)


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(
            Q(bid__investor=user) | Q(bid__business__owner=user)
        ).order_by('-created_at')


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class InvestorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = InvestorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = InvestorProfile.objects.get_or_create(user=self.request.user)
        return profile
