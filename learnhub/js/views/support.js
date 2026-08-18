/**
 * LearnHub Help & Support Module
 */

window.Views = window.Views || {};

window.Views.renderSupport = async function() {
  const container = document.getElementById('main-content');
  const user = window.Auth.getCurrentUser();
  const cms = window.DB.get('cmsContent') || {};
  const faqs = cms.faqs || [];

  const tickets = user ? window.DB.get('supportTickets').filter(t => t.userId === user.id) : [];

  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <!-- Support Header -->
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span class="badge badge-primary text-xs">24/7 Dedicated Assistance</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Help & Support Desk</h1>
        <p class="text-xs sm:text-sm text-slate-500">Find instant answers to common questions or submit a priority ticket to our support engineers.</p>
      </div>

      <!-- FAQ Accordion Section -->
      <div class="lh-card p-6 sm:p-8 space-y-6">
        <h3 class="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
          <i data-lucide="help-circle" class="w-5 h-5 text-indigo-600"></i> Frequently Asked Questions
        </h3>

        <div class="space-y-3">
          ${faqs.map((faq, idx) => `
            <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <button onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.chevron').classList.toggle('rotate-180');" class="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <span>${faq.question}</span>
                <i data-lucide="chevron-down" class="chevron w-4 h-4 text-slate-400 transition-transform"></i>
              </button>
              <div class="hidden p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed bg-slate-50/50 dark:bg-slate-850">
                ${faq.answer}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Support Tickets Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Ticket Submission Form -->
        <div class="lg:col-span-6 lh-card p-6 sm:p-8 space-y-6">
          <div>
            <h3 class="font-bold text-lg text-slate-900 dark:text-white">Create Support Ticket</h3>
            <p class="text-xs text-slate-500 mt-1">Our technical and billing team will respond within 24 hours.</p>
          </div>

          <form onsubmit="window.Views.submitSupportTicket(event)" class="space-y-4">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Issue Category</label>
              <select id="tkt-category" class="form-input text-xs">
                <option value="Technical">Technical / Platform Issue</option>
                <option value="Billing">Billing & Invoice Inquiries</option>
                <option value="Course Content">Course & Curriculum Questions</option>
                <option value="Certificates">Certificates & Verification</option>
                <option value="Account">Account Security</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
              <select id="tkt-priority" class="form-input text-xs">
                <option value="low">Low Priority</option>
                <option value="medium" selected>Medium Priority</option>
                <option value="high">Urgent / High Priority</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
              <input type="text" id="tkt-subject" required placeholder="Brief description of the issue" class="form-input text-xs">
            </div>
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Detailed Message</label>
              <textarea id="tkt-message" rows="4" required placeholder="Please provide steps to reproduce or specific details..." class="form-input text-xs"></textarea>
            </div>
            <button type="submit" class="btn-primary w-full py-2.5 text-xs rounded-xl">Submit Ticket</button>
          </form>
        </div>

        <!-- Right: My Active Support Tickets -->
        <div class="lg:col-span-6 lh-card p-6 sm:p-8 space-y-6">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white">Your Support Tickets (${tickets.length})</h3>

          ${tickets.length === 0 ? `
            <p class="text-xs text-slate-400">You currently have no open or past support tickets.</p>
          ` : `
            <div class="space-y-3">
              ${tickets.map(tkt => `
                <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-[11px] text-slate-400 font-bold">${tkt.ticketNumber}</span>
                    <span class="badge ${tkt.status === 'resolved' ? 'badge-success' : tkt.status === 'in_progress' ? 'badge-warning' : 'badge-primary'} text-[10px] uppercase">
                      ${tkt.status}
                    </span>
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white">${tkt.subject}</h4>
                  <p class="text-[11px] text-slate-500 line-clamp-2">${tkt.message}</p>
                  
                  <div class="pt-2 flex justify-between items-center border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-400">
                    <span>${new Date(tkt.createdAt).toLocaleDateString()}</span>
                    <button onclick="window.Views.viewTicketThread('${tkt.id}')" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                      View Thread (${(tkt.replies || []).length}) &rarr;
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

window.Views.submitSupportTicket = function(e) {
  e.preventDefault();
  const user = window.Auth.getCurrentUser();
  if (!user) {
    window.App.showToast('Please sign in to submit a ticket.', 'warning');
    window.Router.navigate('/login');
    return;
  }

  const category = document.getElementById('tkt-category').value;
  const priority = document.getElementById('tkt-priority').value;
  const subject = document.getElementById('tkt-subject').value;
  const message = document.getElementById('tkt-message').value;

  const ticketNumber = `TKT-2026-${Math.floor(100 + Math.random() * 900)}`;
  const ticket = {
    id: `tkt-${Date.now()}`,
    ticketNumber,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    category,
    priority,
    subject,
    message,
    status: 'open',
    createdAt: new Date().toISOString(),
    replies: []
  };

  window.DB.insert('supportTickets', ticket);
  window.DB.logAudit(user.name, 'TICKET_SUBMITTED', `${ticketNumber}: ${subject}`);
  window.App.showToast(`Ticket #${ticketNumber} created! Our team will respond shortly.`, 'success');
  window.Router.handleRouting();
};

window.Views.viewTicketThread = function(ticketId) {
  const tkt = window.DB.findById('supportTickets', ticketId);
  if (!tkt) return;

  window.App.showModal(`Ticket ${tkt.ticketNumber}`, `
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white">${tkt.subject}</h4>
          <span class="text-[11px] text-slate-400">Category: ${tkt.category}</span>
        </div>
        <span class="badge badge-success text-[10px] uppercase">${tkt.status}</span>
      </div>

      <div class="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
        <div class="font-bold text-slate-700 dark:text-slate-300">Initial Request:</div>
        <p class="text-slate-600 dark:text-slate-400">${tkt.message}</p>
      </div>

      <!-- Thread Replies -->
      <div class="space-y-3">
        <h5 class="text-xs font-bold text-slate-400 uppercase">Replies</h5>
        ${(tkt.replies || []).length === 0 ? `
          <p class="text-xs text-slate-400">A support agent will reply to your inquiry shortly.</p>
        ` : tkt.replies.map(r => `
          <div class="p-3 rounded-xl text-xs space-y-1 ${r.senderRole === 'admin' ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800' : 'bg-slate-100 dark:bg-slate-800'}">
            <div class="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>${r.senderName} (${r.senderRole})</span>
              <span class="text-[10px] text-slate-400">${new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300">${r.message}</p>
          </div>
        `).join('')}
      </div>

      <!-- Add Reply -->
      <div class="pt-2 flex gap-2">
        <input type="text" id="user-tkt-reply-input" placeholder="Type a follow-up message..." class="form-input text-xs">
        <button onclick="window.Views.sendUserTicketReply('${tkt.id}')" class="btn-primary py-1.5 px-3 text-xs rounded-lg">Send</button>
      </div>
    </div>
  `);
};

window.Views.sendUserTicketReply = function(ticketId) {
  const user = window.Auth.getCurrentUser();
  const input = document.getElementById('user-tkt-reply-input');
  const msg = input?.value?.trim();
  if (!msg || !user) return;

  const tkt = window.DB.findById('supportTickets', ticketId);
  if (!tkt) return;

  tkt.replies = tkt.replies || [];
  tkt.replies.push({
    id: `tr-${Date.now()}`,
    senderName: user.name,
    senderRole: user.role,
    message: msg,
    createdAt: new Date().toISOString()
  });

  window.DB.update('supportTickets', ticketId, { replies: tkt.replies, status: 'open' });
  window.App.showToast('Reply added to ticket.', 'success');
  window.Views.viewTicketThread(ticketId);
};
