from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, InvestorProfile, Business, Recommendation, InvestmentBid,
    Transaction, Message,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'role', 'phone', 'bio', 'is_verified', 'created_at']
        read_only_fields = ['id', 'is_verified', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone', 'bio']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'entrepreneur'),
            phone=validated_data.get('phone', ''),
            bio=validated_data.get('bio', ''),
        )
        if user.role == 'investor':
            InvestorProfile.objects.create(user=user)
        return user


class InvestorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = InvestorProfile
        fields = ['id', 'user', 'interests', 'investment_range_min',
                  'investment_range_max', 'portfolio_summary']


class BusinessSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Business
        fields = ['id', 'owner', 'name', 'industry', 'description', 'tags',
                  'funding_needed', 'status', 'created_at']
        read_only_fields = ['id', 'owner', 'status', 'created_at']


class RecommendationSerializer(serializers.ModelSerializer):
    business = BusinessSerializer(read_only=True)

    class Meta:
        model = Recommendation
        fields = ['id', 'investor', 'business', 'score', 'created_at']
        read_only_fields = ['id', 'investor', 'created_at']


class InvestmentBidSerializer(serializers.ModelSerializer):
    investor = UserSerializer(read_only=True)
    business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = InvestmentBid
        fields = ['id', 'investor', 'business', 'business_name', 'amount',
                  'message', 'status', 'created_at']
        read_only_fields = ['id', 'investor', 'status', 'created_at']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'bid', 'amount', 'status', 'reference', 'created_at']
        read_only_fields = ['id', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'created_at', 'is_read']
        read_only_fields = ['id', 'sender', 'created_at', 'is_read']
