from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, InvestorProfile, Business, Recommendation, InvestmentBid,
    Transaction, Message,
)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Business Nexus Info', {'fields': ('role', 'phone', 'bio', 'is_verified')}),
    )
    list_display = ('username', 'email', 'role', 'is_verified', 'is_staff')


admin.site.register(InvestorProfile)
admin.site.register(Business)
admin.site.register(Recommendation)
admin.site.register(InvestmentBid)
admin.site.register(Transaction)
admin.site.register(Message)
