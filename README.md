# 🎓 LearnHub — Modern Premium EdTech & Learning Management Platform

**LearnHub** is a complete, production-ready, ultra-premium Learning Management & Skill Assessment platform built with modern web architectures. It features interactive course curriculum players, an entirely standalone diagnostic quiz examination engine, real-time learning streak calendars, digital certificate verification, and a comprehensive 24-module administration control suite.

---

## 🌟 Key Highlights & Architectural Modules

### 1. 🧑‍💻 User Experience & Learner Side
* **Premium Homepage**: Modern hero section, search bar, featured/popular masterclasses, standalone quizzes spotlight, categories grid, top instructors, learning statistics, student testimonials, and verified credentials showcase.
* **Global Omnibar Search (`Ctrl+K` / `⌘K`)**: Universal instant search across courses, standalone quizzes, instructors, categories, and resources.
* **Course Catalog & Multi-Filter**: Filter by Category, Difficulty Level (Beginner, Intermediate, Advanced), Pricing (Free/Paid), Minimum Rating, and Sort by Popularity, Rating, Newest, or Price.
* **Course Details & Reviews**: Rich overview, instructor bio, learning outcomes, syllabus accordion, ratings breakdown, and interactive student review submission.
* **Distraction-Free Learning Player**: Multi-format curriculum player supporting Video lessons (embed player), Markdown/Text reading lessons, Audio lectures, and Downloadable resource attachments. Automatically calculates progress (`completed / total × 100`) and auto-issues certificates upon 100% completion.
* **⚡ Standalone Quiz Engine (100% Independent)**: Quizzes are a first-class independent module. Users can take timed assessments without enrolling in any course. Features real-time countdown timer, question palette navigation, MCQ & True/False options, server-side grading (answers never exposed prior to submission), scorecard with percentage, pass/fail badge, and question-by-question explanations.
* **Learning Dashboard & Streak Calendar**: Continue Learning card with progress bar, active enrollments, 14-day activity streak heatmap calendar, and quick stats.
* **Verified Certificates & Public Registry**: Digitally verifiable certificate viewer with unique serial ID (e.g., `LH-CERT-2026-8841`), print/PDF generation, and public verification lookup portal (`#/verify-cert/:id`).
* **Gamification & Achievements**: Milestone badges (First Course, Quiz Master, 7-Day Streak, 5 Courses Done), XP point accrual, and top learner leaderboard.
* **Engagement & Community**: Wishlist, Bookmarks, Notification Center, Discussion Forums with nested replies and instructor badges, and Downloadable Resource Library.
* **Secure Checkout & Coupons**: E-commerce cart, coupon redemption (e.g., `LEARN20` for 20% off), mock Stripe credit card gateway, and printable tax invoice confirmation.
* **Help & Support Desk**: FAQ search accordion, ticket submission with priority levels, and user ticket reply threads.

---

### 2. 🛡️ Admin Management Suite (24 Enterprise Modules)
* **Overview Dashboard**: Executive KPI metrics (Total Revenue, Active Users, Quiz Pass Rates, Certificates), and interactive Chart.js line & doughnut graphs.
* **Course & Curriculum Builder**: Create/edit masterclasses, configure pricing, upload thumbnails, and manage lessons with instant up/down reordering.
* **Standalone Quiz & Question Bank Builder**: Create independent exams, set time limits, passing grades, attempt limits, randomize questions/options, and add MCQ / True-False questions with marks and explanations.
* **User & RBAC Governance**: Manage users, assign roles (`student`, `instructor`, `admin`, `super_admin`), activate/suspend accounts, reset passwords, and view user learning telemetry.
* **Orders, Invoices & Coupon Builder**: Complete transaction audit trail, printable invoices, and coupon code creator (percentage or fixed discounts, usage caps, expiration dates).
* **Category & Instructor Management**: Domain taxonomy management and faculty profiles.
* **Reviews & Moderation**: Moderate student reviews and manage ratings.
* **Broadcast Announcements**: Publish priority announcements to all platform learners.
* **Support Ticket Triage**: Customer support desk, triage incoming tickets, change statuses (Open, In Progress, Resolved, Closed), and compose official responses.
* **CMS Content Manager**: Edit homepage hero text, banner text, and FAQ items without code changes.
* **Media Library**: Manage images, PDFs, documents, and videos.
* **Audit Logs**: Immutable security log tracking all administrative actions with timestamps and IP addresses.
* **Platform Settings**: White-label branding, site name, primary/accent colors, and seed database reset.

---

## 🔑 Demo Accounts & Credentials

You can log in directly or use the one-click demo sign-in buttons on the sign-in page:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Student** | `student@learnhub.com` | `student123` | Learning Dashboard, Courses, Quizzes, Certificates, Wishlist |
| **Instructor** | `instructor@learnhub.com` | `instructor123` | Teaching modules, Course Curriculum, Discussion responses |
| **Administrator** | `admin@learnhub.com` | `admin123` | Full 24-Module Admin Suite, Users, Orders, CMS, Audit Logs |

> **Tip**: You can also use the **Role Switcher Dropdown** in the top navigation bar to seamlessly toggle between Student, Instructor, and Admin modes at any time.

---

## 🚀 How to Run Locally

### Option 1: Native PowerShell Local Web Server (Recommended)
Open PowerShell in the project directory and run:
```powershell
.\start-server.ps1
```
This launches a zero-dependency native HTTP server on `http://localhost:3000` and opens your default browser automatically.

### Option 2: Direct File Opening
You can simply double-click or open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

---

## 📁 Project File Structure

```
learnhub/
├── index.html                  # Main application shell and layout containers
├── start-server.ps1            # Zero-dependency native PowerShell HTTP web server
├── README.md                   # Full documentation & feature guide
├── css/
│   └── styles.css              # LearnHub Design System tokens & CSS styling
└── js/
    ├── app.js                  # Master application controller, modals, toasts, omnibar
    ├── router.js               # Hash router with deep linking & route guards
    ├── data/
    │   ├── db.js               # Relational store with rich seed data & persistence
    │   └── api.js              # Data access layer, search indexing, secure quiz scoring
    ├── services/
    │   └── auth.js             # Authentication, RBAC checks & session manager
    └── views/
        ├── home.js             # Premium homepage view & course cards
        ├── courses.js          # Course catalog, multi-filter & course details
        ├── learningPlayer.js   # Distraction-free curriculum player & progress tracker
        ├── quizzes.js          # Standalone quiz catalog, timed exam engine & review
        ├── dashboard.js        # Learning dashboard & streak heatmap calendar
        ├── profile.js          # User profile, learning history & security settings
        ├── certificates.js     # Certificates gallery, visual viewer & public verifier
        ├── achievements.js     # Milestone badges, XP points & leaderboard
        ├── engagement.js       # Wishlist, bookmarks, notifications, discussions, resources
        ├── checkout.js         # Cart, coupon discounts & Stripe payment simulation
        ├── support.js          # FAQ accordion & support ticket submission
        └── admin/
            ├── adminDashboard.js   # Admin KPIs, Chart.js graphs & recent orders
            ├── adminCourses.js     # Course management & lesson builder/reorderer
            ├── adminQuizzes.js     # Standalone quiz builder, question editor & analytics
            ├── adminUsers.js       # User directory, role assignment & audit drawer
            ├── adminOrders.js      # Orders, printable invoices & coupon builder
            └── adminContent.js     # Categories, instructors, CMS, media & audit logs
```

---

## 🔒 Security Architecture
1. **Secure Quiz Grading**: During exam taking (`getQuizQuestionsForTake`), correct answers and explanations are stripped from the client payload. Grading occurs strictly on submission (`submitQuizAttempt`).
2. **Role-Based Guards**: Protected routes (`#/admin/*`) automatically verify elevated privileges.
3. **Audit Trail**: Every significant administrative mutation (course updates, coupon creations, password resets, ticket resolutions) is logged with actor details and timestamps in `DB.auditLogs`.

---

© 2026 LearnHub Inc. Built for world-class learning experiences.
