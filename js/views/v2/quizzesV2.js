/**
 * LearnHub V2 Modern Quiz Arena with Lifelines & Analysis
 */

window.Views = window.Views || {};
window.Views.v2 = window.Views.v2 || {};

window.Views.v2.renderQuizArena = function(params, query) {
  if (typeof window.Views.renderAdventureGame === 'function') {
    return window.Views.renderAdventureGame(params, query);
  }
};
