/**
 * LearnHub Smart Push & Daily Reminder Service
 * Handles web notifications, daily Dhikr reminders, prayer alerts, and streak notifications.
 */

window.NotificationService = window.NotificationService || {};

(function() {
  const S = window.NotificationService;

  S.isSupported = function() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  };

  S.getPermission = function() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  };

  S.requestPermission = async function() {
    if (!('Notification' in window)) {
      window.App?.showToast('آپ کا براؤزر پش نوٹیفکیشن سپورٹ نہیں کرتا۔', 'warning');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        window.App?.showToast('نوٹیفکیشنز کامیابی سے آن ہو گئیں! 🔔', 'success');
        S.scheduleDailyDhikrNotification();
        return true;
      } else {
        window.App?.showToast('نوٹیفکیشنز کی اجازت نہیں ملی۔', 'info');
        return false;
      }
    } catch (e) {
      console.error('Notification permission error:', e);
      return false;
    }
  };

  S.sendLocalNotification = function(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const defaultOptions = {
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      dir: 'rtl',
      lang: 'ur',
      vibrate: [200, 100, 200],
      ...options
    };

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, defaultOptions);
      });
    } else {
      new Notification(title, defaultOptions);
    }
  };

  S.scheduleDailyDhikrNotification = function() {
    const hour = new Date().getHours();
    let title = 'صبح کے اذکار کا وقت 🌅';
    let body = 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ...';
    
    if (hour >= 16 && hour < 20) {
      title = 'شام کے مسنون اذکار 🌙';
      body = 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ...';
    } else if (hour >= 20) {
      title = 'سونے سے پہلے کی سنتیں ✨';
      body = 'آیۃ الکرسی اور تینوں قل پڑھ کر دم فرمائیں۔';
    }

    // Trigger preview notification
    setTimeout(() => {
      S.sendLocalNotification(title, {
        body,
        data: { url: '#/tasbeeh' }
      });
    }, 1000);
  };

})();
