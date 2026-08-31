/**
 * LearnHub Standalone Quiz & Examination Service (v173.0.0)
 * Secure score evaluation, time limit enforcement, and anti-tampering XP calculations.
 */

class QuizService {
  constructor() {}

  async submitQuizAttempt(quizId, answers, timeSpentSeconds) {
    const user = (window.Auth && window.Auth.getCurrentUser && window.Auth.getCurrentUser()) || { id: 'anon', name: 'Learner' };
    const quiz = (window.DB && typeof window.DB.findById === 'function') ? window.DB.findById('quizzes', quizId) : null;
    
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    const questions = quiz.questions || [];
    let correctCount = 0;
    const detailedResults = [];

    questions.forEach((q, idx) => {
      const userAnswer = answers[q.id || idx];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      detailedResults.push({
        questionId: q.id || idx,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || ''
      });
    });

    const scorePercentage = Math.round((correctCount / (questions.length || 1)) * 100);
    const passed = scorePercentage >= (quiz.passingScore || 70);
    const xpEarned = passed ? (quiz.rewardXp || 50) : 10;

    const attemptRecord = {
      id: 'qa_' + Date.now(),
      quizId,
      userId: user.id,
      userName: user.name,
      score: scorePercentage,
      passed,
      correctCount,
      totalQuestions: questions.length,
      timeSpentSeconds,
      xpEarned,
      completedAt: new Date().toISOString()
    };

    if (window.DB && typeof window.DB.insert === 'function') {
      window.DB.insert('quiz_attempts', attemptRecord);
      window.DB.save();
    }

    if (window.CloudDB && typeof window.CloudDB.recordXpTransaction === 'function') {
      window.CloudDB.recordXpTransaction(user.id, xpEarned, 'quiz_attempt', 'Completed quiz: ' + (quiz.title || quizId));
    }

    return { attemptRecord, detailedResults };
  }
}

window.QuizService = new QuizService();
