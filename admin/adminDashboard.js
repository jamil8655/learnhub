/**
 * LearnHub Admin Dashboard View
 * Executive KPI metrics, interactive Chart.js visualizations, and recent transactions.
 */

window.Views = window.Views || {};
window.Views.admin = window.Views.admin || {};

window.Views.admin.renderDashboard = async function() {
  const container = document.getElementById('main-content');
  const analytics = await window.API.getAdminAnalytics();
  const kpis = analytics.kpis;

  container.innerHTML = `
    <div class="space-y-8">
      
      <!-- Top Header & Quick Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="badge badge-primary text-[10px] uppercase font-bold">Administration Control Center</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Platform Overview</h1>
          <p class="text-xs text-slate-500">Live operational telemetry, revenue performance, and learner engagement metrics.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button onclick="window.Views.admin.openCourseBuilderModal()" class="btn-primary py-2 px-3 text-xs rounded-xl">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> New Course
          </button>
          <button onclick="window.Views.admin.openQuizBuilderModal()" class="btn-primary py-2 px-3 text-xs rounded-xl bg-cyan-600 hover:bg-cyan-500 border-none">
            <i data-lucide="zap" class="w-3.5 h-3.5"></i> New Quiz
          </button>
          <button onclick="window.Views.admin.openCouponBuilderModal()" class="btn-secondary py-2 px-3 text-xs rounded-xl">
            <i data-lucide="tag" class="w-3.5 h-3.5"></i> Add Coupon
          </button>
        </div>
      </div>

      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div class="lh-card p-5 space-y-2 border-t-4 border-t-indigo-500">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>Total Gross Revenue</span>
            <i data-lucide="dollar-sign" class="w-4 h-4 text-indigo-500"></i>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">$${kpis.totalRevenue.toLocaleString()}</div>
          <span class="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5"><i data-lucide="trending-up" class="w-3 h-3"></i> +18.4% from last month</span>
        </div>

        <div class="lh-card p-5 space-y-2 border-t-4 border-t-emerald-500">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>Active Users</span>
            <i data-lucide="users" class="w-4 h-4 text-emerald-500"></i>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">${kpis.activeUsers}</div>
          <span class="text-[11px] text-slate-400">Total Registered: ${window.DB.get('users').length}</span>
        </div>

        <div class="lh-card p-5 space-y-2 border-t-4 border-t-cyan-500">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>Standalone Quiz Pass Rate</span>
            <i data-lucide="target" class="w-4 h-4 text-cyan-500"></i>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">${kpis.quizPassRate}%</div>
          <span class="text-[11px] text-slate-400">${kpis.totalQuizAttempts} total diagnostic attempts</span>
        </div>

        <div class="lh-card p-5 space-y-2 border-t-4 border-t-amber-500">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>Certificates Issued</span>
            <i data-lucide="award" class="w-4 h-4 text-amber-500"></i>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">${kpis.certificatesIssued}</div>
          <span class="text-[11px] text-emerald-600 font-bold">100% digitally verifiable</span>
        </div>
      </div>

      <!-- Interactive Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Revenue Trend Bar / Line Chart -->
        <div class="lg:col-span-8 lh-card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Monthly Revenue Performance ($)</h3>
            <span class="badge badge-neutral text-xs">Past 6 Months</span>
          </div>
          <div class="relative h-64 w-full">
            <canvas id="admin-revenue-chart"></canvas>
          </div>
        </div>

        <!-- Category Distribution Doughnut -->
        <div class="lg:col-span-4 lh-card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Curriculum Enrollment by Category</h3>
          </div>
          <div class="relative h-64 w-full flex items-center justify-center">
            <canvas id="admin-category-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Orders & Recent Quiz Attempts Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Recent Orders -->
        <div class="lh-card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Recent Payment Orders</h3>
            <a href="#/admin/orders" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View All &rarr;</a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th class="p-2.5">Order ID</th>
                  <th class="p-2.5">User</th>
                  <th class="p-2.5">Amount</th>
                  <th class="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${analytics.recentOrders.map(o => `
                  <tr>
                    <td class="p-2.5 font-mono font-bold">${o.orderNumber}</td>
                    <td class="p-2.5">${o.userName}</td>
                    <td class="p-2.5 font-extrabold text-slate-900 dark:text-white">$${o.total.toFixed(2)}</td>
                    <td class="p-2.5"><span class="badge badge-success text-[9px] uppercase">${o.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Standalone Quiz Attempts -->
        <div class="lh-card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Recent Standalone Quiz Attempts</h3>
            <a href="#/admin/quizzes" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View All &rarr;</a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th class="p-2.5">Quiz</th>
                  <th class="p-2.5">Score</th>
                  <th class="p-2.5">Result</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${analytics.recentAttempts.map(a => {
                  const q = window.DB.findById('quizzes', a.quizId);
                  return `
                    <tr>
                      <td class="p-2.5 font-medium truncate max-w-[140px]">${q?.title || 'Quiz'}</td>
                      <td class="p-2.5 font-bold">${a.score}/${a.totalMarks} (${a.percentage}%)</td>
                      <td class="p-2.5"><span class="badge ${a.passed ? 'badge-success' : 'badge-danger'} text-[9px] uppercase">${a.passed ? 'PASSED' : 'FAILED'}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize Chart.js
  setTimeout(() => {
    window.Views.admin.renderCharts(analytics.charts);
  }, 50);
};

window.Views.admin.renderCharts = function(chartData) {
  if (!window.Chart) return;

  const revCanvas = document.getElementById('admin-revenue-chart');
  if (revCanvas) {
    new Chart(revCanvas, {
      type: 'line',
      data: {
        labels: chartData.monthlyRevenue.map(d => d.month),
        datasets: [{
          label: 'Revenue ($)',
          data: chartData.monthlyRevenue.map(d => d.revenue),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#4f46e5',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const catCanvas = document.getElementById('admin-category-chart');
  if (catCanvas) {
    new Chart(catCanvas, {
      type: 'doughnut',
      data: {
        labels: chartData.categoryDistribution.map(d => d.label),
        datasets: [{
          data: chartData.categoryDistribution.map(d => d.count),
          backgroundColor: ['#4f46e5', '#7c3aed', '#0284c7', '#059669', '#db2777'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
        }
      }
    });
  }
};
