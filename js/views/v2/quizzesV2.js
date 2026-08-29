/**
 * LearnHub V2 Quiz Proxy
 * Seamlessly routes to the unified master Quiz Examination & Arena Suite
 */

window.Views = window.Views || {};
window.Views.v2 = window.Views.v2 || {};

window.Views.v2.renderQuizzes = function(params, query) {
  if (typeof window.Views.renderQuizzes === 'function') {
    return window.Views.renderQuizzes(params, query);
  }
};

window.Views.v2.renderQuizDetails = function(params, query) {
  if (typeof window.Views.renderQuizDetails === 'function') {
    return window.Views.renderQuizDetails(params, query);
  }
};

window.Views.v2.renderQuizTake = function(params, query) {
  if (typeof window.Views.renderQuizTake === 'function') {
    return window.Views.renderQuizTake(params, query);
  }
};

window.Views.v2.renderQuizArena = function(params, query) {
  if (typeof window.Views.renderQuizTake === 'function') {
    return window.Views.renderQuizTake(params, query);
  }
};
