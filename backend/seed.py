"""
Quick seed script for demo data.
Run with: python manage.py shell < seed.py
"""
from core.models import User, InvestorProfile, Business

if not User.objects.filter(username='entre1').exists():
    e1 = User.objects.create_user(username='entre1', password='password123',
                                   email='entre1@example.com', role='entrepreneur',
                                   bio='Founder building fintech solutions.')
    Business.objects.create(owner=e1, name='AgriTech Solutions', industry='Agriculture',
                             description='Smart farming IoT platform.',
                             tags='agritech, iot, sustainability', funding_needed=50000,
                             status='verified')
    Business.objects.create(owner=e1, name='FinPay', industry='Fintech',
                             description='Digital payments for SMEs.',
                             tags='fintech, payments, sme', funding_needed=120000,
                             status='verified')

if not User.objects.filter(username='invest1').exists():
    i1 = User.objects.create_user(username='invest1', password='password123',
                                   email='invest1@example.com', role='investor',
                                   bio='Angel investor focused on early-stage tech.')
    InvestorProfile.objects.create(user=i1, interests='fintech, agritech, iot',
                                    investment_range_min=10000, investment_range_max=200000,
                                    portfolio_summary='5 early-stage investments to date.')

print("Seed data created.")
