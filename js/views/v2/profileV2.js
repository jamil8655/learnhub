/**
 * LearnHub V2 Profile Proxy - Seamlessly routes to the Master Ultra-Luxury Profile Engine
 */

window.Views = window.Views || {};
window.Views.v2 = window.Views.v2 || {};

window.Views.v2.renderProfile = function(params, query) {
  if (window.Views && typeof window.Views.renderProfile === 'function') {
    return window.Views.renderProfile(params, query);
  }
};

window.Views.v2.openEditProfileModal = function() {
  if (window.Views && typeof window.Views.switchProfileTab === 'function') {
    window.Views.switchProfileTab('edit');
  }
};

window.Views.v2.openAvatarPickerModal = function() {
  if (window.Views && typeof window.Views.switchProfileTab === 'function') {
    window.Views.switchProfileTab('edit');
  }
};

window.Views.v2.switchProfileTab = function(tab) {
  if (window.Views && typeof window.Views.switchProfileTab === 'function') {
    window.Views.switchProfileTab(tab);
  }
};
