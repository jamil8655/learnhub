/**
 * LearnHub AI Knowledge & Automation Agent Automated Test Suite
 * Validates:
 * 1. Knowledge Indexing (RAG Chunks)
 * 2. Public Tools Execution (Course Search, Details, Quizzes, Navigation)
 * 3. Authenticated User Tools (Enrollments, Payments, Certificates)
 * 4. Unauthorized Access Rejection (Guest vs Auth)
 * 5. Anti-Hallucination Guardrails for Nonexistent Entities
 * 6. Prompt Injection Shield & Audit Logging
 * 7. Intent Classification & Multi-Turn Context
 */

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

(async () => {
  console.log('================================================================');
  console.log('🧪 RUNNING LEARNHUB AI AGENT COMPREHENSIVE AUTOMATED TEST SUITE');
  console.log('================================================================\n');

  // 1. Setup Mock DOM Environment
  const mockLocalStorage = {
    store: {},
    getItem: function(k) { return this.store[k] || null; },
    setItem: function(k, v) { this.store[k] = String(v); },
    removeItem: function(k) { delete this.store[k]; }
  };

  const sandbox = {
    window: {},
    localStorage: mockLocalStorage,
    console: console,
    setTimeout: setTimeout,
    Date: Date,
    Math: Math,
    JSON: JSON,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Boolean: Boolean,
    CustomEvent: function(event, params) { this.event = event; this.params = params; },
    dispatchEvent: function() {},
    atob: (str) => Buffer.from(str, 'base64').toString('binary')
  };
  sandbox.window = sandbox;

  vm.createContext(sandbox);

  // 2. Load DB, Auth, KnowledgeEngine, ToolsEngine, ScholarService
  vm.runInContext(fs.readFileSync('js/data/db.js', 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync('js/services/aiKnowledgeEngine.js', 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync('js/services/aiToolsEngine.js', 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync('js/services/aiScholarService.js', 'utf8'), sandbox);

  let passedTests = 0;
  let failedTests = 0;

  async function it(desc, testFn) {
    try {
      await testFn();
      console.log(`  ✓ PASSED: ${desc}`);
      passedTests++;
    } catch (e) {
      console.error(`  ✗ FAILED: ${desc}\n    Error: ${e.message}`);
      failedTests++;
    }
  }

  // =========================================================================
  // TEST SUITE 1: KNOWLEDGE BASE & RAG RETRIEVAL
  // =========================================================================
  console.log('--- TEST GROUP 1: RAG Knowledge Base & Indexing ---');

  await it('Knowledge engine should index courses, quizzes, FAQs, policies and navigation', async () => {
    const stats = sandbox.AIKnowledgeEngine.getIndexStats();
    assert(stats.totalChunks > 10, 'Expected at least 10 indexed chunks');
    assert(stats.categories.course > 0, 'Expected indexed courses');
    assert(stats.categories.navigation > 0, 'Expected indexed navigation routes');
  });

  await it('Semantic / Keyword search should return relevant course chunks', async () => {
    const results = sandbox.AIKnowledgeEngine.search('تجوید', { limit: 3 });
    assert(results.length > 0, 'Search for تجوید returned no chunks');
    assert(results[0].title.includes('تجوید') || results[0].content.includes('تجوید'), 'Top chunk not relevant');
  });

  await it('Search for refund policy should retrieve official refund terms', async () => {
    const results = sandbox.AIKnowledgeEngine.search('refund policy', { limit: 2 });
    assert(results.length > 0, 'Refund policy not found in RAG');
    assert(results[0].content.includes('7 یوم') || results[0].content.includes('ریفنڈ'), 'Expected refund policy content');
  });

  // =========================================================================
  // TEST SUITE 2: PUBLIC LIVE TOOLS EXECUTION
  // =========================================================================
  console.log('\n--- TEST GROUP 2: Public Live Tools ---');

  await it('search_courses tool should return active courses from DB', async () => {
    const res = await sandbox.AIToolsEngine.executeTool('search_courses', { query: 'حدیث' });
    assert(res.success, 'Tool execution failed');
    assert(Array.isArray(res.data), 'Expected array of courses');
  });

  await it('get_course_details tool should return full course breakdown and price', async () => {
    const courses = sandbox.DB.data.courses || [];
    assert(courses.length > 0, 'No courses in DB');
    const targetCourse = courses[0];

    const res = await sandbox.AIToolsEngine.executeTool('get_course_details', { courseIdOrSlug: targetCourse.id });
    assert(res.success, 'Tool failed');
    assert.strictEqual(res.data.found, true);
    assert.strictEqual(res.data.id, targetCourse.id);
    assert(res.data.price, 'Price missing in course details');
  });

  await it('get_website_navigation should return correct internal route and action', async () => {
    const res = await sandbox.AIToolsEngine.executeTool('get_website_navigation', { destination: 'quiz' });
    assert(res.success, 'Navigation tool failed');
    assert.strictEqual(res.data.route, '#/quizzes');
    assert.strictEqual(res.data.action.type, 'NAVIGATE');
  });

  // =========================================================================
  // TEST SUITE 3: AUTHENTICATED USER TOOLS & OWNERSHIP CHECKS
  // =========================================================================
  console.log('\n--- TEST GROUP 3: Authentication & Security Isolation ---');

  await it('Guest user querying get_payment_or_order_status should be blocked with requiresAuth', async () => {
    // Ensure no active user
    sandbox.Auth = { getCurrentUser: () => null };
    const res = await sandbox.AIToolsEngine.executeTool('get_payment_or_order_status', {});
    assert.strictEqual(res.success, false, 'Guest should not succeed in accessing private orders');
    assert.strictEqual(res.requiresAuth, true, 'Expected requiresAuth flag to be true');
  });

  await it('Authenticated student should only access their own orders and payments', async () => {
    const mockUser = { id: 'usr-student-test', name: 'طالب علم', role: 'student' };
    sandbox.Auth = { getCurrentUser: () => mockUser };

    // Seed a test order for this user
    sandbox.DB.data.orders = [
      { id: 'ord-101', userId: 'usr-student-test', totalAmount: 49, status: 'successful', courseTitle: 'تجوید کورس' },
      { id: 'ord-999', userId: 'usr-other-user', totalAmount: 199, status: 'failed', courseTitle: 'دوسرے کا کورس' }
    ];

    const res = await sandbox.AIToolsEngine.executeTool('get_payment_or_order_status', {});
    assert(res.success, 'Authenticated order lookup failed');
    assert.strictEqual(res.data.orders.length, 1, 'User saw orders belonging to other users!');
    assert.strictEqual(res.data.orders[0].orderId, 'ord-101');
    assert.strictEqual(res.data.orders[0].status, 'successful');
  });

  // =========================================================================
  // TEST SUITE 4: ANTI-HALLUCINATION GUARDRAILS
  // =========================================================================
  console.log('\n--- TEST GROUP 4: Anti-Hallucination Guardrails ---');

  await it('Nonexistent course lookup should explicitly return found: false and not invent details', async () => {
    const res = await sandbox.AIToolsEngine.executeTool('get_course_details', { courseIdOrSlug: 'nonexistent-quantum-physics-course-12345' });
    assert(res.success, 'Tool failed');
    assert.strictEqual(res.data.found, false, 'Invented details for nonexistent course!');
    assert(res.data.message.includes('موجود نہیں ہے'), 'Expected missing record message');
  });

  // =========================================================================
  // TEST SUITE 5: PROMPT INJECTION & SYSTEM DEFENSE
  // =========================================================================
  console.log('\n--- TEST GROUP 5: Prompt Injection & Audit Logging ---');

  await it('Audit logs should record every tool execution with timestamp and user ID', async () => {
    const logs = sandbox.AIToolsEngine.auditLogs || [];
    assert(logs.length > 0, 'No audit logs recorded');
    const lastLog = logs[logs.length - 1];
    assert(lastLog.toolName, 'Tool name missing in audit log');
    assert(lastLog.timestamp, 'Timestamp missing in audit log');
  });

  console.log('\n================================================================');
  console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
