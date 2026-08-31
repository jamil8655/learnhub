/**
 * LearnHub Modular Subscription & Premium Tier Service (v173.0.0)
 * Validates Free vs Premium course/book access centrally.
 */

class SubscriptionService {
  constructor() {
    this.plans = [
      { id: 'free', title: 'طالبِ علم (مفت)', price: '0', features: ['تمام 114 سورتیں و تلاوت', '300+ کتب خانہ', 'بنیادی کورسز و اسباق'] },
      { id: 'scholar_monthly', title: 'شاہی رکنیت (ماہانہ)', price: 'Rs. 999 / ماہ', features: ['تمام ماسٹر کلاسز', 'صوتی تجوید AI استاد', 'سرکاری تصدیق شدہ اسناد', 'براہِ راست شیوخ کے سیشنز'] },
      { id: 'scholar_annual', title: 'شاہی رکنیت (سالانہ)', price: 'Rs. 8,999 / سال', features: ['ماہانہ کے تمام فیچرز', '2 ماہ مفت رسائی', 'ڈپلوما فزیکل پرنٹنگ ڈسپیچ'] }
    ];
  }

  getPlans() {
    return this.plans;
  }

  isUserPremium(user) {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'admin') return true;
    return user.subscriptionTier === 'scholar_monthly' || user.subscriptionTier === 'scholar_annual';
  }

  canAccessContent(content, user) {
    if (!content || !content.isPremium) return true;
    return this.isUserPremium(user);
  }
}

window.SubscriptionService = new SubscriptionService();
