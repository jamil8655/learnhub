/**
 * LearnHub Relational Data Store & Seed Database
 * Complete standalone persistence layer with rich, realistic domain models.
 */

const STORAGE_KEY = 'learnhub_db_v1';

// Seed Initial Data
const SEED_DATA = {
  settings: {
    siteName: 'LearnHub',
    tagline: 'Master the skills of tomorrow, today.',
    logoText: 'LearnHub',
    brandPrimary: '#4f46e5',
    brandAccent: '#06b6d4',
    contactEmail: 'support@learnhub.com',
    enableRegistration: true,
    enableReviews: true,
    enableCertificates: true,
    currencySymbol: '$',
    footerText: '© 2026 LearnHub Inc. All rights reserved. Empowering modern learners worldwide.',
    seoTitle: 'LearnHub — Premium EdTech & Learning Management Platform',
    seoDescription: 'Explore thousands of premium online courses, standalone skill assessment quizzes, and verified professional certificates.'
  },

  cmsContent: {
    heroTitle: 'Transform Your Future with World-Class Learning',
    heroSubtitle: 'Access premium courses, test your real-world skills with standalone timed quizzes, earn verified industry certificates, and accelerate your career.',
    bannerText: '🚀 Spring Special: Use coupon LEARN20 for 20% off all certifications and courses!',
    bannerActive: true,
    aboutText: 'LearnHub is a next-generation Learning Management System built for students, professionals, and forward-thinking organizations. We combine cutting-edge curriculum design with interactive hands-on labs and standalone assessments.',
    faqs: [
      { id: 'faq-1', category: 'General', question: 'How do standalone quizzes work?', answer: 'Quizzes at LearnHub are completely independent from courses. You can take any quiz directly to test and validate your knowledge without enrolling in a full course.' },
      { id: 'faq-2', category: 'Certificates', question: 'Are LearnHub certificates verifiable?', answer: 'Yes! Every certificate issued has a unique verification code and public URL (e.g., #/verify-cert/LH-CERT-2026-8841) that employers can verify in real time.' },
      { id: 'faq-3', category: 'Billing', question: 'What payment methods are supported?', answer: 'We support all major Credit/Debit cards, PayPal, and enterprise invoices with instant course enrollment.' },
      { id: 'faq-4', category: 'Courses', question: 'Can I access course materials offline?', answer: 'Yes, downloadable resources, project cheat sheets, and PDF study guides can be saved for offline review.' }
    ]
  },

  roles: [
    { id: 'student', name: 'Student', description: 'Can browse, enroll, take quizzes, earn certificates, and join discussions.' },
    { id: 'instructor', name: 'Instructor', description: 'Can manage assigned courses, lessons, and view student progress.' },
    { id: 'admin', name: 'Administrator', description: 'Full access to courses, standalone quizzes, users, orders, coupons, CMS, and settings.' },
    { id: 'super_admin', name: 'Super Admin', description: 'Complete system control including role assignments, audit logs, and system config.' }
  ],

  users: [
    {
      id: 'usr-jamil',
      name: 'جمیل رحمن انصاری',
      email: 'JRahmanAnsari132@gmail.com',
      password: 'student123',
      role: 'admin',
      avatar: 'https://avatars.githubusercontent.com/u/207941618?v=4',
      headline: 'LearnHub بانی و ایڈمنسٹریٹر',
      bio: 'سیکھنے اور سکھانے کا پرجوش سفر۔',
      status: 'active',
      learningStreak: 7,
      longestStreak: 14,
      totalPoints: 1450,
      createdAt: '2026-01-01',
      notificationsEnabled: true
    },
    {
      id: 'usr-1',
      name: 'Alex Johnson',
      email: 'student@learnhub.com',
      password: 'student123', // In production simulated auth
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      headline: 'Full-Stack Developer & Lifelong Learner',
      bio: 'Software engineer passionate about React, TypeScript, and modern Cloud architectures.',
      status: 'active',
      learningStreak: 12,
      longestStreak: 21,
      totalPoints: 1450,
      createdAt: '2026-01-10T10:00:00Z',
      notificationsEnabled: true
    },
    {
      id: 'usr-2',
      name: 'Dr. Sarah Chen',
      email: 'instructor@learnhub.com',
      password: 'instructor123',
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      headline: 'Lead AI Researcher & Stanford PhD',
      bio: 'Specializing in Deep Learning, Computer Vision, and Neural Networks with 12+ years of industry experience.',
      status: 'active',
      learningStreak: 45,
      longestStreak: 45,
      totalPoints: 5200,
      createdAt: '2025-11-01T12:00:00Z',
      notificationsEnabled: true
    },
    {
      id: 'usr-3',
      name: 'Admin Director',
      email: 'admin@learnhub.com',
      password: 'admin123',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      headline: 'LearnHub Chief Learning Officer & Admin',
      bio: 'Managing academic operations, course quality, and instructor governance.',
      status: 'active',
      learningStreak: 30,
      longestStreak: 60,
      totalPoints: 9800,
      createdAt: '2025-08-01T08:00:00Z',
      notificationsEnabled: true
    }
  ],

  categories: [
    { id: 'cat-1', name: 'Web Development', slug: 'web-dev', icon: 'code', description: 'Next.js, React, Node.js, TypeScript, and modern web architectures.', color: '#4f46e5' },
    { id: 'cat-2', name: 'Artificial Intelligence', slug: 'ai-ml', icon: 'cpu', description: 'Generative AI, Large Language Models, PyTorch, and Deep Learning.', color: '#7c3aed' },
    { id: 'cat-3', name: 'Cloud & DevOps', slug: 'cloud-devops', icon: 'cloud', description: 'AWS, Kubernetes, Docker, CI/CD pipelines, and infrastructure as code.', color: '#0284c7' },
    { id: 'cat-4', name: 'Data Science', slug: 'data-science', icon: 'bar-chart-2', description: 'Python, Pandas, Machine Learning algorithms, and data visualization.', color: '#059669' },
    { id: 'cat-5', name: 'UI/UX Design', slug: 'ui-ux', icon: 'layout', description: 'Figma, Design Systems, wireframing, and user research heuristics.', color: '#db2777' },
    { id: 'cat-6', name: 'Cyber Security', slug: 'cyber-security', icon: 'shield', description: 'Ethical hacking, network defense, penetration testing, and security ops.', color: '#ea580c' }
  ],

  instructors: [
    {
      id: 'inst-1',
      userId: 'usr-2',
      name: 'Dr. Sarah Chen',
      title: 'AI Research Scientist & Author',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      bio: 'Stanford PhD in Computer Science. Former Senior Research Scientist at DeepMind with multiple published papers in Neural Information Processing Systems.',
      rating: 4.95,
      studentsCount: 28450,
      coursesCount: 4,
      expertise: ['Machine Learning', 'PyTorch', 'LLMs', 'Python']
    },
    {
      id: 'inst-2',
      userId: null,
      name: 'Michael Rodriguez',
      title: 'Principal Full-Stack Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      bio: '15+ years building distributed web applications at scale. Creator of top open-source developer tooling with 50M+ downloads.',
      rating: 4.88,
      studentsCount: 34120,
      coursesCount: 5,
      expertise: ['TypeScript', 'Next.js', 'React', 'Node.js', 'GraphQL']
    },
    {
      id: 'inst-3',
      userId: null,
      name: 'Marcus Vance',
      title: 'Senior Cloud Security Architect',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      bio: 'AWS Certified Solutions Architect Fellow & CISSP. Specialized in container security, Kubernetes clusters, and zero-trust enterprise security.',
      rating: 4.92,
      studentsCount: 19800,
      coursesCount: 3,
      expertise: ['AWS', 'Kubernetes', 'Docker', 'Cyber Security']
    },
    {
      id: 'inst-4',
      userId: null,
      name: 'Elena Rostova',
      title: 'Head of Data Science @ TechNova',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      bio: 'Passionate educator who translates complex statistical mechanics and ML algorithms into practical real-world data pipelines.',
      rating: 4.85,
      studentsCount: 15600,
      coursesCount: 3,
      expertise: ['Python', 'Pandas', 'Data Analysis', 'Scikit-Learn']
    }
  ],

  courses: [
    {
      id: 'crs-1',
      title: 'Modern Full-Stack Next.js & TypeScript Bootcamp',
      slug: 'fullstack-nextjs-typescript',
      categoryId: 'cat-1',
      instructorId: 'inst-2',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      badge: 'Bestseller',
      level: 'Intermediate',
      language: 'English',
      price: 79.99,
      originalPrice: 149.99,
      isFree: false,
      status: 'published',
      rating: 4.9,
      ratingCount: 1420,
      durationHours: 32.5,
      enrolledCount: 12400,
      shortDescription: 'Master modern web development from zero to production deployment with Next.js 14, React 18, TypeScript, Tailwind CSS, and PostgreSQL.',
      description: 'In this definitive bootcamp, you will build 4 production-grade web applications. Learn App Router, Server Actions, optimistic UI, state synchronization, payment gateway integrations, and edge caching architecture.',
      learningOutcomes: [
        'Build scalable full-stack applications with Next.js 14 App Router and TypeScript',
        'Implement robust authentication, session management, and RBAC security',
        'Integrate relational database ORMs and optimized SQL queries',
        'Deploy high-availability applications with automated CI/CD pipelines',
        'Master Tailwind CSS, responsive UI/UX patterns, and dark mode theming'
      ],
      requirements: [
        'Basic familiarity with JavaScript (ES6+)',
        'A computer with modern web browser and code editor',
        'Enthusiasm to build real-world web applications'
      ],
      updatedAt: '2026-02-15'
    },
    {
      id: 'crs-2',
      title: 'Artificial Intelligence & Deep Learning Masterclass',
      slug: 'ai-deep-learning-masterclass',
      categoryId: 'cat-2',
      instructorId: 'inst-1',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800',
      badge: 'Featured',
      level: 'Advanced',
      language: 'English',
      price: 99.99,
      originalPrice: 199.99,
      isFree: false,
      status: 'published',
      rating: 5.0,
      ratingCount: 980,
      durationHours: 42.0,
      enrolledCount: 8900,
      shortDescription: 'From neural network foundations to fine-tuning state-of-the-art Large Language Models and Computer Vision transformers using PyTorch.',
      description: 'Demystify deep learning with Dr. Sarah Chen. Write neural architectures from scratch, understand backpropagation mathematically, implement Transformer self-attention, and fine-tune open weights LLMs on custom enterprise datasets.',
      learningOutcomes: [
        'Understand mathematical foundations of Neural Networks and Backpropagation',
        'Implement Convolutional Networks (CNNs) and Vision Transformers (ViTs)',
        'Train and evaluate Transformer architectures from scratch in PyTorch',
        'Fine-tune Large Language Models (LLMs) with LoRA and QLoRA techniques',
        'Deploy production inference APIs with quantization and GPU acceleration'
      ],
      requirements: [
        'Basic Python programming knowledge',
        'High school level calculus and linear algebra concepts'
      ],
      updatedAt: '2026-02-10'
    },
    {
      id: 'crs-3',
      title: 'Cloud Architecture, AWS & Kubernetes DevOps Engineer',
      slug: 'cloud-aws-kubernetes-devops',
      categoryId: 'cat-3',
      instructorId: 'inst-3',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      badge: 'Popular',
      level: 'Intermediate',
      language: 'English',
      price: 89.99,
      originalPrice: 159.99,
      isFree: false,
      status: 'published',
      rating: 4.8,
      ratingCount: 760,
      durationHours: 28.0,
      enrolledCount: 6800,
      shortDescription: 'Design highly available, fault-tolerant cloud infrastructures on AWS using Terraform, Docker, Kubernetes, and GitOps.',
      description: 'Step into the shoes of a Cloud DevOps engineer. Provision enterprise VPC networks, automate container builds with GitHub Actions, orchestrate microservices on Kubernetes (EKS), and set up Prometheus monitoring.',
      learningOutcomes: [
        'Architect scalable AWS cloud solutions with multi-region redundancy',
        'Containerize applications with multi-stage Docker builds',
        'Manage Kubernetes Pods, Deployments, Services, Ingress, and Helm charts',
        'Write declarative Infrastructure as Code using Terraform',
        'Implement automated CI/CD pipelines with security linting and zero-downtime rollouts'
      ],
      requirements: [
        'Basic command-line / Linux navigation',
        'Fundamental networking concepts (IP, DNS, HTTP)'
      ],
      updatedAt: '2026-01-28'
    },
    {
      id: 'crs-4',
      title: 'Data Science & Machine Learning with Python Bootcamp',
      slug: 'python-data-science-bootcamp',
      categoryId: 'cat-4',
      instructorId: 'inst-4',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      badge: 'Free',
      level: 'Beginner',
      language: 'English',
      price: 0.00,
      originalPrice: 0.00,
      isFree: true,
      status: 'published',
      rating: 4.9,
      ratingCount: 2150,
      durationHours: 18.5,
      enrolledCount: 24500,
      shortDescription: 'Master data analysis, data wrangling with Pandas, statistical visualization with Seaborn, and introductory machine learning algorithms.',
      description: 'A comprehensive free entry point into Data Science. Learn Python data structures, perform exploratory data analysis on real-world datasets, build regression and classification models, and create interactive data dashboards.',
      learningOutcomes: [
        'Clean, transform, and analyze tabular datasets using NumPy and Pandas',
        'Create publication-quality visualizations using Matplotlib and Seaborn',
        'Train regression, classification, and clustering models with Scikit-Learn',
        'Evaluate model performance using precision, recall, ROC-AUC, and cross-validation',
        'Present actionable data stories with Jupyter Notebooks'
      ],
      requirements: [
        'No prior programming experience required',
        'Free Jupyter Notebook / Google Colab setup provided in class'
      ],
      updatedAt: '2026-02-01'
    },
    {
      id: 'crs-5',
      title: 'UI/UX Design Masterclass: From Figma to Production Design Systems',
      slug: 'ui-ux-design-figma-masterclass',
      categoryId: 'cat-5',
      instructorId: 'inst-2',
      thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&q=80&w=800',
      badge: 'Hot',
      level: 'All Levels',
      language: 'English',
      price: 69.99,
      originalPrice: 129.99,
      isFree: false,
      status: 'published',
      rating: 4.85,
      ratingCount: 620,
      durationHours: 22.0,
      enrolledCount: 5100,
      shortDescription: 'Create stunning user interfaces, design systems, and responsive prototypes in Figma with real-world UX research workflows.',
      description: 'Learn modern UI/UX design from industry experts. Master typography, auto-layout 5.0, variables, responsive design grids, accessible color contrast, interactive micro-interactions, and handoff to engineering.',
      learningOutcomes: [
        'Build scalable Design Systems in Figma with component tokens and variables',
        'Master wireframing, interactive prototyping, and usability testing',
        'Apply WCAG accessibility guidelines to ensure inclusive interfaces',
        'Collaborate seamlessly with front-end developers using design tokens'
      ],
      requirements: [
        'Free Figma account',
        'Passion for visual aesthetics and user-centric problem solving'
      ],
      updatedAt: '2026-01-20'
    },
    {
      id: 'crs-ur-1',
      title: 'مکمل فل اسٹیک ویب ڈویلپمنٹ ماسٹرکلاس (Next.js اور TypeScript)',
      slug: 'fullstack-nextjs-typescript-urdu',
      categoryId: 'cat-1',
      instructorId: 'inst-2',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      badge: 'اردو میں',
      level: 'Intermediate',
      language: 'اردو (Urdu)',
      price: 49.99,
      originalPrice: 99.99,
      isFree: false,
      status: 'published',
      rating: 4.95,
      ratingCount: 840,
      durationHours: 35.0,
      enrolledCount: 6500,
      shortDescription: 'اردو زبان میں زیرو سے لے کر لائیو ویب سائٹ بنانے تک کا مکمل کورس۔ Next.js 14، React 18، TypeScript اور ڈیٹا بیس سیکھیں۔',
      description: 'اس ماسٹرکلاس میں آپ جدید ویب ڈویلپمنٹ کی بنیادی سے ایڈوانس تکنیکیں سیکھیں گے۔ سرور ایکشنز، ریسٹ اے پی آئی، ڈیٹابیس اور لائیو ہوسٹنگ اردو میں آسان فہم انداز میں سکھائی گئی ہے۔',
      learningOutcomes: [
        'Next.js اور TypeScript کے ساتھ مکمل لائیو ایپلیکیشن بنائیں',
        'جدید آتھینٹیکیشن، لاگ ان سسٹم اور سیکیورٹی لاگو کریں',
        'ڈیٹا بیس اور SQL کے ساتھ تیز رفتار ڈیٹا اسٹورز بنائیں',
        'مکمل ویب سائٹ انٹرنیٹ پر لائیو پبلش کریں'
      ],
      requirements: [
        'کمپیوٹر اور انٹرنیٹ کنکشن',
        'پروگرامنگ سیکھنے کا جذبہ'
      ],
      updatedAt: '2026-02-18'
    },
    {
      id: 'crs-ar-1',
      title: 'دورة تطوير الويب المتكامل الشاملة (Next.js و TypeScript)',
      slug: 'fullstack-nextjs-typescript-arabic',
      categoryId: 'cat-1',
      instructorId: 'inst-2',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
      badge: 'بالعربية',
      level: 'Intermediate',
      language: 'العربية (Arabic)',
      price: 59.99,
      originalPrice: 119.99,
      isFree: false,
      status: 'published',
      rating: 4.9,
      ratingCount: 520,
      durationHours: 30.0,
      enrolledCount: 4200,
      shortDescription: 'تعلم تطوير مواقع الويب الحديثة من الصفر حتى الاحتراف باللغة العربية باستخدام أحدث تقنيات Next.js و TypeScript.',
      description: 'دورة شاملة باللغة العربية تأخذك خطوة بخطوة لبناء تطبيقات ويب تفاعلية وقابلة للتوسع باستخدام أحدث معايير هندسة البرمجيات.',
      learningOutcomes: [
        'بناء تطبيقات متكاملة واحترافية بتقنية Next.js 14',
        'تطبيق أنظمة المصادقة والصلاحيات الآمنة',
        'ربط قواعد البيانات وإدارة الاستعلامات بكفاءة عالية',
        'نشر المشاريع على السحابة مع الحماية والأداء العالي'
      ],
      requirements: [
        'معرفة أساسية بأساسيات البرمجة',
        'حاسوب متصل بالإنترنت'
      ],
      updatedAt: '2026-02-18'
    }
  ],

  lessons: [
    // Course 1 Lessons
    {
      id: 'les-101',
      courseId: 'crs-1',
      order: 1,
      title: 'Course Introduction & Architecture Blueprint',
      durationMinutes: 14,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Embed preview
      isFreePreview: true,
      description: 'Overview of modern full-stack web applications, Next.js 14 architecture, and our master plan for the project.',
      resources: [{ title: 'Fullstack Roadmap PDF', url: '#/resources', type: 'pdf', size: '2.4 MB' }]
    },
    {
      id: 'les-102',
      courseId: 'crs-1',
      order: 2,
      title: 'TypeScript Foundations for React & Node.js',
      durationMinutes: 28,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isFreePreview: true,
      description: 'Deep dive into TypeScript generics, utility types, discriminating unions, and strict typing in Next.js.',
      resources: [{ title: 'TypeScript Cheat Sheet', url: '#/resources', type: 'code', size: '150 KB' }]
    },
    {
      id: 'les-103',
      courseId: 'crs-1',
      order: 3,
      title: 'Next.js App Router, Server Components & Streaming',
      durationMinutes: 35,
      type: 'text',
      contentBody: `### Understanding React Server Components (RSC)

React Server Components represent a paradigm shift in web development. By rendering components on the server:

1. **Zero Client-Side JavaScript**: Server components do not send their code to the client bundle.
2. **Direct Backend Access**: Query databases, access internal microservices, and read files directly.
3. **Automatic Code Splitting**: Client components imported inside server components are dynamically loaded.

\`\`\`typescript
// app/courses/page.tsx
export default async function CoursesPage() {
  const courses = await db.course.findMany({ where: { status: 'published' } });
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map(course => <CourseCard key={course.id} course={course} />)}
    </div>
  );
}
\`\`\`

#### Key Rules:
- Server Components cannot use browser hooks like \`useState\` or \`useEffect\`.
- Use \`"use client"\` directive only at the leaves of your component tree.`,
      isFreePreview: false,
      resources: []
    },
    {
      id: 'les-104',
      courseId: 'crs-1',
      order: 4,
      title: 'Database Modeling & Relational Queries with Prisma',
      durationMinutes: 42,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isFreePreview: false,
      description: 'Designing normalized schemas, relations, cascading deletes, transactions, and seeding production data.',
      resources: [{ title: 'Prisma Schema Starter', url: '#/resources', type: 'code', size: '45 KB' }]
    },
    {
      id: 'les-105',
      courseId: 'crs-1',
      order: 5,
      title: 'Full-Stack Architecture Audio Summary & Best Practices',
      durationMinutes: 18,
      type: 'audio',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      isFreePreview: false,
      description: 'Podcast-style discussion on performance optimizations, caching strategies, and common production pitfalls.',
      resources: []
    },

    // Course 2 Lessons
    {
      id: 'les-201',
      courseId: 'crs-2',
      order: 1,
      title: 'The AI Landscape & Neural Network Intuition',
      durationMinutes: 20,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isFreePreview: true,
      description: 'An intuitive visual breakdown of perceptrons, activation functions, loss curves, and gradient descent.',
      resources: [{ title: 'Neural Net Math Guide', url: '#/resources', type: 'pdf', size: '3.1 MB' }]
    },
    {
      id: 'les-202',
      courseId: 'crs-2',
      order: 2,
      title: 'Building a Neural Network from Scratch in Python',
      durationMinutes: 45,
      type: 'text',
      contentBody: `### Building a 2-Layer Neural Network

Let's implement a multi-layer perceptron using pure NumPy:

\`\`\`python
import numpy as np

class NeuralNetwork:
    def __init__(self, input_dim, hidden_dim, output_dim):
        self.W1 = np.random.randn(input_dim, hidden_dim) * 0.01
        self.b1 = np.zeros((1, hidden_dim))
        self.W2 = np.random.randn(hidden_dim, output_dim) * 0.01
        self.b2 = np.zeros((1, output_dim))
        
    def forward(self, X):
        self.Z1 = np.dot(X, self.W1) + self.b1
        self.A1 = np.maximum(0, self.Z1) # ReLU
        self.Z2 = np.dot(self.A1, self.W2) + self.b2
        exp_scores = np.exp(self.Z2)
        self.probs = exp_scores / np.sum(exp_scores, axis=1, keepdims=True) # Softmax
        return self.probs
\`\`\`

Notice how vectorization eliminates Python loops, multiplying throughput by 100x.`,
      isFreePreview: false,
      resources: []
    },

    // Course 4 Lessons (Free Data Science course)
    {
      id: 'les-401',
      courseId: 'crs-4',
      order: 1,
      title: 'Python for Data Analysis Quickstart',
      durationMinutes: 25,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isFreePreview: true,
      description: 'Setting up Jupyter, understanding NumPy broadcasting, and mastering array operations.',
      resources: [{ title: 'Jupyter Starter Notebook', url: '#/resources', type: 'code', size: '200 KB' }]
    },
    {
      id: 'les-402',
      courseId: 'crs-4',
      order: 2,
      title: 'Data Wrangling and Cleaning with Pandas',
      durationMinutes: 38,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isFreePreview: true,
      description: 'Handling missing values, grouping, merging dataframes, and calculating aggregated summary metrics.',
      resources: [{ title: 'Pandas Data Wrangling Guide', url: '#/resources', type: 'pdf', size: '1.8 MB' }]
    },
    {
      id: 'les-403',
      courseId: 'crs-4',
      order: 3,
      title: 'Exploratory Data Analysis & Statistical Modeling',
      durationMinutes: 30,
      type: 'text',
      contentBody: `### The 5-Step Exploratory Data Analysis (EDA) Framework

1. **Understand Data Types**: Identify numerical (continuous vs discrete) and categorical (nominal vs ordinal) variables.
2. **Missing Data Imputation**: Distinguish between MCAR (Missing Completely at Random) and MAR patterns.
3. **Outlier Detection**: Use Interquartile Range (IQR) and Z-score transformations.
4. **Bivariate Correlation**: Compute Pearson and Spearman correlation matrices.
5. **Feature Engineering**: Standardize, normalize, and one-hot encode categorical features for machine learning pipelines.`,
      isFreePreview: true,
      resources: []
    },

    // Urdu Course Lessons
    {
      id: 'les-ur-101',
      courseId: 'crs-ur-1',
      order: 1,
      title: 'کورس کا تعارف اور جدید ویب ڈویلپمنٹ کا نقشہ',
      durationMinutes: 20,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isFreePreview: true,
      description: 'اس ویڈیو میں ہم سیکھیں گے کہ جدید فل اسٹیک ویب ڈویلپمنٹ کیا ہے اور ہم اس کورس میں کیا بنائیں گے۔',
      resources: [{ title: 'اردو روڈ میپ PDF', url: '#/resources', type: 'pdf', size: '2.1 MB' }]
    },
    {
      id: 'les-ur-102',
      courseId: 'crs-ur-1',
      order: 2,
      title: 'Next.js 14 ایپ راؤٹر اور سرور کمپوننٹس (تفصیلی وضاحت)',
      durationMinutes: 35,
      type: 'text',
      contentBody: `### React Server Components (RSC) کی تفصیلی وضاحت

ری ایکٹ سرور کمپوننٹس ویب ڈویلپمنٹ میں ایک انقلابی تبدیلی ہیں۔ جب ہم کوڈ کو سرور پر رینڈر کرتے ہیں:

1. **تیز ترین اسپیڈ**: براؤزر میں غیر ضروری جاوا اسکرپٹ بنڈل لوڈ نہیں ہوتا۔
2. **ڈیٹا بیس تک براہ راست رسائی**: آپ براہِ راست ڈیٹابیس کیوریاں چلا سکتے ہیں۔
3. **سرور ایکشنز**: بغیر الگ API بنائے فارم کا ڈیٹا محفوظ کریں۔`,
      isFreePreview: true,
      resources: []
    }
  ],

  // STANDALONE QUIZZES MODULE (Completely independent from courses)
  quizzes: [
    {
      id: 'qz-isl-1',
      title: 'قرآن فہمی، تجوید اور سورتوں کے اہم مضامین کا ٹیسٹ',
      slug: 'quran-tajweed-comprehension-quiz',
      categoryId: 'cat-1',
      difficulty: 'Intermediate',
      timeLimitMinutes: 10,
      passingPercentage: 70,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'قرآن مجید کی سورتوں کے بنیادی مضامین، مکی و مدنی احکام اور تجوید کے اہم قواعد کی جانچ۔',
      instructions: 'آپ کے پاس کل 10 منٹ ہیں۔ تمام سوالات کے جوابات دیں، ضرورت پڑنے پر 50-50 لائف لائن استعمال کر سکتے ہیں۔',
      participantsCount: 4520,
      passRate: 92,
      averageScore: 88,
      createdAt: '2026-02-18'
    },
    {
      id: 'qz-isl-2',
      title: 'علم الحدیث اور سیرت النبی ﷺ جامع امتحان',
      slug: 'hadith-sciences-seerah-quiz',
      categoryId: 'cat-1',
      difficulty: 'Intermediate',
      timeLimitMinutes: 12,
      passingPercentage: 75,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'صحاح ستہ، اسماء الرجال کی اصطلاحات، اور حضور نبی اکرم ﷺ کی حیات طیبہ پر جامع امتحانی کوئز۔',
      instructions: '12 منٹ کے اندر سوالات مکمل کریں۔ ٹیسٹ کے اختتام پر تصدیقی سرٹیفکیٹ جاری ہوگا۔',
      participantsCount: 3890,
      passRate: 86,
      averageScore: 84,
      createdAt: '2026-02-18'
    },
    {
      id: 'qz-ur-1',
      title: 'جاوا اسکرپٹ اور جدید ES6+ فہم امتحان (اردو)',
      slug: 'javascript-core-es6-exam-urdu',
      categoryId: 'cat-1',
      difficulty: 'Intermediate',
      timeLimitMinutes: 15,
      passingPercentage: 75,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'اردو زبان میں جاوا اسکرپٹ، ایونٹ لوپ، پرامسز اور جدید فیچرز کی جانچ کریں۔',
      instructions: 'آپ کے پاس کل 15 منٹ ہیں تمام سوالات مکمل کرنے کے لیے۔ ٹیسٹ مکمل ہونے پر آپ کو فوراً تفصیلی اسکور اور جوابات کی وضاحت دکھائی جائے گی۔',
      participantsCount: 1840,
      passRate: 88,
      averageScore: 85,
      createdAt: '2026-02-18'
    },
    {
      id: 'qz-ar-1',
      title: 'اختبار إتقان لغة جافاسكريبت و ES6+ (بالعربية)',
      slug: 'javascript-core-es6-exam-arabic',
      categoryId: 'cat-1',
      difficulty: 'Intermediate',
      timeLimitMinutes: 15,
      passingPercentage: 75,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'اختبار تشخيصي مستقل لتقييم فهمك لأساسيات ومفاهيم جافاسكريبت المتقدمة باللغة العربية.',
      instructions: 'لديك 15 دقيقة للإجابة على جميع الأسئلة. سيتم إظهار الشروحات والنتيجة مباشرة بعد التسليم.',
      participantsCount: 1420,
      passRate: 82,
      averageScore: 84,
      createdAt: '2026-02-18'
    },
    {
      id: 'qz-1',
      title: 'JavaScript Core & Modern ES6+ Proficiency Exam',
      slug: 'javascript-core-es6-exam',
      categoryId: 'cat-1',
      difficulty: 'Intermediate',
      timeLimitMinutes: 15,
      passingPercentage: 75,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'Test your mastery of closures, prototypes, event loops, async/await, and ES2024 features.',
      instructions: 'You have 15 minutes to complete all questions. You can navigate between questions, flag questions for review, and submit when ready. Correct answers will be revealed after final submission.',
      participantsCount: 3840,
      passRate: 78,
      averageScore: 82,
      createdAt: '2026-01-15'
    },
    {
      id: 'qz-2',
      title: 'Python & Data Science Diagnostic Challenge',
      slug: 'python-data-science-diagnostic',
      categoryId: 'cat-4',
      difficulty: 'Beginner',
      timeLimitMinutes: 10,
      passingPercentage: 70,
      maxAttempts: 5,
      randomizeQuestions: false,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'Assess your practical understanding of Python fundamentals, list comprehensions, NumPy slicing, and Pandas operations.',
      instructions: 'A rapid 10-minute diagnostic challenge suitable for aspiring data analysts and software engineers.',
      participantsCount: 5210,
      passRate: 85,
      averageScore: 86,
      createdAt: '2026-01-20'
    },
    {
      id: 'qz-3',
      title: 'AWS & Cloud Infrastructure Security Assessment',
      slug: 'aws-cloud-security-assessment',
      categoryId: 'cat-3',
      difficulty: 'Advanced',
      timeLimitMinutes: 20,
      passingPercentage: 80,
      maxAttempts: 3,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'Comprehensive evaluation of AWS IAM policies, VPC security groups, KMS encryption, and Kubernetes RBAC.',
      instructions: 'Advanced scenario-based questions assessing production cloud security architecture and incident response.',
      participantsCount: 1950,
      passRate: 64,
      averageScore: 74,
      createdAt: '2026-02-01'
    },
    {
      id: 'qz-4',
      title: 'UI/UX Design Heuristics & Design Systems Quiz',
      slug: 'ui-ux-design-heuristics-quiz',
      categoryId: 'cat-5',
      difficulty: 'Beginner',
      timeLimitMinutes: 10,
      passingPercentage: 70,
      maxAttempts: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'Evaluate your knowledge of Jakob Nielsen 10 Usability Heuristics, WCAG 2.2 contrast standards, and Figma components.',
      instructions: 'Designed for product designers and UI engineers looking to certify their UX fundamentals.',
      participantsCount: 2480,
      passRate: 91,
      averageScore: 89,
      createdAt: '2026-02-05'
    },
    {
      id: 'qz-5',
      title: 'Deep Learning & Neural Networks Fundamentals',
      slug: 'deep-learning-neural-networks-quiz',
      categoryId: 'cat-2',
      difficulty: 'Advanced',
      timeLimitMinutes: 15,
      passingPercentage: 75,
      maxAttempts: 3,
      randomizeQuestions: true,
      randomizeOptions: true,
      status: 'published',
      shortDescription: 'Test your understanding of gradient descent, backpropagation, convolutional kernels, and transformer attention.',
      instructions: 'Deep learning concepts for engineers working with modern AI frameworks.',
      participantsCount: 1620,
      passRate: 69,
      averageScore: 76,
      createdAt: '2026-02-12'
    }
  ],

  quizQuestions: [
    // Islamic Quiz 1 Questions (Quran & Tajweed)
    {
      id: 'qq-isl-101',
      quizId: 'qz-isl-1',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'قرآن مجید کی سب سے بڑی اور طویل ترین سورت کون سی ہے؟',
      options: ['سورۃ آل عمران', 'سورۃ البقرہ', 'سورۃ النساء', 'سورۃ المائدہ'],
      correctAnswerIndex: 1,
      explanation: 'سورۃ البقرہ قرآن مجید کی سب سے بڑی سورت ہے، جس میں کل 286 آیات اور قرآن کی سب سے طویل آیت (آیت الدین - 282) اور آیت الکرسی (255) شامل ہیں۔'
    },
    {
      id: 'qq-isl-102',
      quizId: 'qz-isl-1',
      order: 2,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'علمِ تجوید میں "قلقلہ" کے حروف کتنے ہیں اور وہ کون سے ہیں؟',
      options: ['3 حروف (ا، و، ی)', '5 حروف (ق، ط، ب، ج، د)', '6 حروف (حلق والے حروف)', '4 حروف (ن، م، و، ی)'],
      correctAnswerIndex: 1,
      explanation: 'قلقلہ کے 5 حروف ہیں جن کا مجموعہ "قُطْبُ جَدٍّ" (ق، ط، ب، ج، د) ہے۔ جب یہ حروف ساکن ہوں تو ان میں آواز کی جنبش (Echo) پیدا ہوتی ہے۔'
    },
    {
      id: 'qq-isl-103',
      quizId: 'qz-isl-1',
      order: 3,
      type: 'true_false',
      marks: 10,
      questionText: 'سورۃ التوبہ قرآن مجید کی واحد سورت ہے جس کے شروع میں "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" نہیں لکھی جاتی۔',
      options: ['صحیح (True)', 'غلط (False)'],
      correctAnswerIndex: 0,
      explanation: 'صحیح۔ سورۃ التوبہ کے آغاز میں تسمیہ نہیں پڑھی جاتی کیونکہ یہ مشرکین کے ساتھ معاہدات ختم کرنے اور غضبِ الٰہی کا اظہار ہے۔'
    },

    // Islamic Quiz 2 Questions (Hadith & Seerah)
    {
      id: 'qq-isl-201',
      quizId: 'qz-isl-2',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'حدیثِ مبارکہ کی مشہور ترین کتاب "صحیح بخاری" کے مؤلف کا پورا نام کیا ہے؟',
      options: ['امام مسلم بن الحجاج', 'امام محمد بن اسماعیل البخاری', 'امام ابو عیسیٰ الترمذی', 'امام احمد بن حنبل'],
      correctAnswerIndex: 1,
      explanation: 'صحیح بخاری کے مؤلف کا نام امام ابو عبد اللہ محمد بن اسماعیل البخاری رحمۃ اللہ علیہ (194ھ - 256ھ) ہے۔'
    },
    {
      id: 'qq-isl-202',
      quizId: 'qz-isl-2',
      order: 2,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'حضور نبی اکرم ﷺ نے نبوت کے بعد مدینہ منورہ کی طرف ہجرت کس سن عیسوی میں فرمائی؟',
      options: ['610 عیسوی', '622 عیسوی', '630 عیسوی', '632 عیسوی'],
      correctAnswerIndex: 1,
      explanation: 'ہجرتِ مدینہ 622ء میں ہوئی جس سے اسلامی تقویم (ہجری سال) کا آغاز ہوا۔'
    },

    // Quiz Urdu Questions
    {
      id: 'qq-ur-101',
      quizId: 'qz-ur-1',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'جاوا اسکرپٹ میں typeof (function() {})() کا آؤٹ پٹ کیا ہوگا؟',
      options: ['function', 'undefined', 'object', 'null'],
      correctAnswerIndex: 1,
      explanation: 'کیونکہ یہ ایک خودکار ایگزیکیوٹ ہونے والا فنکشن (IIFE) ہے جو کچھ ریٹرن نہیں کرتا، اس لیے اس کا رزلٹ undefined ہوگا اور typeof undefined کی ویلیو "undefined" ہوگی۔'
    },
    {
      id: 'qq-ur-102',
      quizId: 'qz-ur-1',
      order: 2,
      type: 'true_false',
      marks: 10,
      questionText: 'جاوا اسکرپٹ ES6+ میں ایرو فنکشنز (Arrow Functions) کا اپنا الگ `this` نہیں ہوتا بلکہ وہ اپنے بیرونی اسکوپ سے `this` لیتے ہیں۔',
      options: ['صحیح (True)', 'غلط (False)'],
      correctAnswerIndex: 0,
      explanation: 'صحیح۔ ایرو فنکشنز کا اپنا لکسیکل `this` اسکوپ نہیں ہوتا۔'
    },

    // Quiz Arabic Questions
    {
      id: 'qq-ar-101',
      quizId: 'qz-ar-1',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'ما هي نتيجة الكود التالي في جافاسكريبت: typeof (function() {})()؟',
      options: ['function', 'undefined', 'object', 'null'],
      correctAnswerIndex: 1,
      explanation: 'الدالة تنفذ كـ IIFE ولا ترجع قيمة، وبالتالي فإن النتيجة هي undefined ونوعها "undefined".'
    },

    // Quiz 1 Questions (JavaScript Core)
    {
      id: 'qq-101',
      quizId: 'qz-1',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'What is the output of the following JavaScript code?\n\nconsole.log(typeof (function() {})());',
      options: ['function', 'undefined', 'object', 'null'],
      correctAnswerIndex: 1,
      explanation: 'The function executes immediately as an IIFE (Immediately Invoked Function Expression) and returns nothing (undefined), so typeof undefined evaluates to "undefined".'
    },
    {
      id: 'qq-102',
      quizId: 'qz-1',
      order: 2,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'In the JavaScript Event Loop, which queue has the highest execution priority before rendering or moving to the next macrotask?',
      options: ['Microtask Queue (Promises, queueMicrotask)', 'Macrotask Queue (setTimeout, setInterval)', 'I/O Polling Queue', 'RequestAnimationFrame Queue'],
      correctAnswerIndex: 0,
      explanation: 'Microtasks (resolved Promises, process.nextTick, queueMicrotask) are drained completely before the event loop picks up the next macrotask from the task queue.'
    },
    {
      id: 'qq-103',
      quizId: 'qz-1',
      order: 3,
      type: 'true_false',
      marks: 10,
      questionText: 'In JavaScript ES6+, arrow functions have their own lexical `this` binding and do NOT bind their own `arguments` or `prototype`.',
      options: ['True', 'False'],
      correctAnswerIndex: 0,
      explanation: 'True. Arrow functions retain the `this` value of the enclosing lexical context and lack their own `this`, `arguments`, `super`, or `new.target`.'
    },
    {
      id: 'qq-104',
      quizId: 'qz-1',
      order: 4,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'Which method creates a deep clone of a structured JavaScript object without serializing to JSON string?',
      options: ['structuredClone()', 'Object.assign()', 'Object.clone()', 'Array.from()'],
      correctAnswerIndex: 0,
      explanation: 'The built-in global `structuredClone()` function creates a deep clone of complex JavaScript objects including Maps, Sets, and Date objects.'
    },
    {
      id: 'qq-105',
      quizId: 'qz-1',
      order: 5,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'What does `Promise.allSettled()` return when all passed promises finish?',
      options: [
        'An array of objects each describing the outcome of each promise (status: fulfilled/rejected)',
        'The first resolved value among all promises',
        'Throws an immediate error if any promise rejects',
        'A single combined aggregated response object'
      ],
      correctAnswerIndex: 0,
      explanation: 'Promise.allSettled() returns a promise that resolves after all given promises have either fulfilled or rejected, with an array of outcome objects.'
    },

    // Quiz 2 Questions (Python & Data Science)
    {
      id: 'qq-201',
      quizId: 'qz-2',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'In Python, what is the output of `[x**2 for x in range(5) if x % 2 == 0]`?',
      options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[4, 16]'],
      correctAnswerIndex: 0,
      explanation: 'Range(5) contains 0, 1, 2, 3, 4. Even numbers are 0, 2, 4. Their squares are 0, 4, 16.'
    },
    {
      id: 'qq-202',
      quizId: 'qz-2',
      order: 2,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'In Pandas, which method is used to filter out duplicate rows while keeping the first occurrence?',
      options: ['df.drop_duplicates()', 'df.remove_repeats()', 'df.unique_rows()', 'df.filter_distinct()'],
      correctAnswerIndex: 0,
      explanation: '`df.drop_duplicates(keep="first")` removes all subsequent duplicate rows from the DataFrame.'
    },
    {
      id: 'qq-203',
      quizId: 'qz-2',
      order: 3,
      type: 'true_false',
      marks: 10,
      questionText: 'In Python, dictionaries preserve insertion order by default starting from Python 3.7+.',
      options: ['True', 'False'],
      correctAnswerIndex: 0,
      explanation: 'True. In Python 3.7 and above, dictionary insertion order is an official part of the Python language specification.'
    },

    // Quiz 3 Questions (AWS Security)
    {
      id: 'qq-301',
      quizId: 'qz-3',
      order: 1,
      type: 'multiple_choice',
      marks: 10,
      questionText: 'According to the AWS Shared Responsibility Model, which security aspect is the customer directly responsible for in Amazon EC2?',
      options: [
        'Operating system patches, application security, and firewall configurations',
        'Physical data center facility perimeter security',
        'Hypervisor patching and physical host maintenance',
        'Hardware decommission and disk shredding'
      ],
      correctAnswerIndex: 0,
      explanation: 'AWS manages security OF the cloud (physical infrastructure, hypervisor), while customers manage security IN the cloud (OS updates, IAM, network rules).'
    },
    {
      id: 'qq-302',
      quizId: 'qz-3',
      order: 2,
      type: 'true_false',
      marks: 10,
      questionText: 'AWS Security Groups are stateful firewalls, whereas Network Access Control Lists (NACLs) are stateless.',
      options: ['True', 'False'],
      correctAnswerIndex: 0,
      explanation: 'True. If you allow inbound traffic on a Security Group, response traffic is automatically allowed regardless of outbound rules.'
    }
  ],

  // Quiz Attempts (User quiz history & analytics)
  quizAttempts: [
    {
      id: 'qa-101',
      quizId: 'qz-1',
      userId: 'usr-1',
      score: 50,
      totalMarks: 50,
      percentage: 100,
      passed: true,
      timeTakenSeconds: 380,
      attemptNumber: 1,
      answers: [
        { questionId: 'qq-101', selectedOptionIndex: 1, isCorrect: true },
        { questionId: 'qq-102', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-103', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-104', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-105', selectedOptionIndex: 0, isCorrect: true }
      ],
      completedAt: '2026-02-14T14:30:00Z'
    },
    {
      id: 'qa-102',
      quizId: 'qz-2',
      userId: 'usr-1',
      score: 30,
      totalMarks: 30,
      percentage: 100,
      passed: true,
      timeTakenSeconds: 210,
      attemptNumber: 1,
      answers: [
        { questionId: 'qq-201', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-202', selectedOptionIndex: 0, isCorrect: true },
        { questionId: 'qq-203', selectedOptionIndex: 0, isCorrect: true }
      ],
      completedAt: '2026-02-15T09:15:00Z'
    }
  ],

  // User Course Enrollments & Progress
  enrollments: [
    {
      id: 'enr-1',
      userId: 'usr-1',
      courseId: 'crs-1',
      enrolledAt: '2026-01-15T11:00:00Z',
      progressPercentage: 60,
      completedLessons: ['les-101', 'les-102', 'les-103'],
      lastViewedLessonId: 'les-103',
      status: 'in_progress',
      completedAt: null
    },
    {
      id: 'enr-2',
      userId: 'usr-1',
      courseId: 'crs-4',
      enrolledAt: '2026-01-20T10:00:00Z',
      progressPercentage: 100,
      completedLessons: ['les-401', 'les-402', 'les-403'],
      lastViewedLessonId: 'les-403',
      status: 'completed',
      completedAt: '2026-02-02T16:00:00Z'
    }
  ],

  // Certificates
  certificates: [
    {
      id: 'cert-1',
      certificateNumber: 'LH-CERT-2026-8841',
      userId: 'usr-1',
      userName: 'Alex Johnson',
      courseId: 'crs-4',
      courseTitle: 'Data Science & Machine Learning with Python Bootcamp',
      instructorName: 'Elena Rostova',
      issueDate: 'February 2, 2026',
      verificationUrl: '#/verify-cert/LH-CERT-2026-8841',
      grade: 'Distinction (100%)',
      badgeColor: '#059669'
    }
  ],

  // Gamification & Achievements
  achievements: [
    { id: 'ach-1', code: 'first_course', title: 'First Milestone', description: 'Complete your first course on LearnHub.', icon: 'award', points: 100 },
    { id: 'ach-2', code: 'quiz_ace', title: 'Quiz Master', description: 'Pass a standalone quiz with 90% or higher.', icon: 'zap', points: 150 },
    { id: 'ach-3', code: 'streak_7', title: 'Consistency Champion', description: 'Maintain a 7-day learning streak.', icon: 'flame', points: 200 },
    { id: 'ach-4', code: 'five_courses', title: 'Knowledge Explorer', description: 'Complete 5 full courses on LearnHub.', icon: 'book-open', points: 500 },
    { id: 'ach-5', code: 'community_voice', title: 'Community Pillar', description: 'Post 5 helpful answers in course discussions.', icon: 'message-square', points: 120 }
  ],

  userAchievements: [
    { id: 'ua-1', userId: 'usr-1', achievementId: 'ach-1', unlockedAt: '2026-02-02T16:05:00Z' },
    { id: 'ua-2', userId: 'usr-1', achievementId: 'ach-2', unlockedAt: '2026-02-14T14:31:00Z' },
    { id: 'ua-3', userId: 'usr-1', achievementId: 'ach-3', unlockedAt: '2026-02-16T10:00:00Z' }
  ],

  // Activity Logs for Heatmap Calendar
  activityLogs: [
    { id: 'act-1', userId: 'usr-1', date: '2026-02-17', count: 4, type: 'lesson_completed' },
    { id: 'act-2', userId: 'usr-1', date: '2026-02-16', count: 6, type: 'quiz_submitted' },
    { id: 'act-3', userId: 'usr-1', date: '2026-02-15', count: 3, type: 'lesson_viewed' },
    { id: 'act-4', userId: 'usr-1', date: '2026-02-14', count: 8, type: 'quiz_passed' },
    { id: 'act-5', userId: 'usr-1', date: '2026-02-13', count: 2, type: 'discussion_reply' },
    { id: 'act-6', userId: 'usr-1', date: '2026-02-12', count: 5, type: 'lesson_completed' },
    { id: 'act-7', userId: 'usr-1', date: '2026-02-11', count: 4, type: 'lesson_viewed' }
  ],

  // Reviews & Ratings
  reviews: [
    {
      id: 'rev-1',
      courseId: 'crs-1',
      userId: 'usr-1',
      userName: 'Alex Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      title: 'Outstanding production quality and real-world architectures!',
      comment: 'This is without question the best Next.js course on the market. Michael explains Server Components and state boundaries with crystal clarity.',
      createdAt: '2026-02-10T15:00:00Z',
      helpfulCount: 42,
      status: 'approved'
    },
    {
      id: 'rev-2',
      courseId: 'crs-2',
      userId: 'usr-1',
      userName: 'Alex Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      title: 'Dr. Sarah Chen makes deep learning feel intuitive',
      comment: 'The coding exercises and math intuition behind backprop and transformers are phenomenal. Highly recommended for any serious AI engineer.',
      createdAt: '2026-02-12T11:20:00Z',
      helpfulCount: 31,
      status: 'approved'
    }
  ],

  wishlist: [
    { id: 'wl-1', userId: 'usr-1', itemType: 'course', itemId: 'crs-2', addedAt: '2026-02-05' },
    { id: 'wl-2', userId: 'usr-1', itemType: 'quiz', itemId: 'qz-3', addedAt: '2026-02-10' }
  ],

  bookmarks: [
    { id: 'bm-1', userId: 'usr-1', itemType: 'lesson', itemId: 'les-103', title: 'Next.js App Router, Server Components & Streaming', courseId: 'crs-1', addedAt: '2026-02-15' },
    { id: 'bm-2', userId: 'usr-1', itemType: 'resource', itemId: 'res-1', title: 'Neural Net Math Guide PDF', url: '#/resources', addedAt: '2026-02-12' }
  ],

  notifications: [
    {
      id: 'notif-1',
      userId: 'usr-1',
      type: 'certificate',
      title: 'Certificate Issued!',
      message: 'Congratulations! You completed "Data Science & Machine Learning with Python Bootcamp" and earned your verified certificate.',
      link: '#/certificates',
      read: false,
      createdAt: '2026-02-02T16:02:00Z'
    },
    {
      id: 'notif-2',
      userId: 'usr-1',
      type: 'quiz',
      title: 'Perfect Quiz Score',
      message: 'You scored 100% on JavaScript Core & Modern ES6+ Proficiency Exam!',
      link: '#/quizzes/qz-1',
      read: false,
      createdAt: '2026-02-14T14:30:00Z'
    },
    {
      id: 'notif-3',
      userId: 'usr-1',
      type: 'announcement',
      title: 'New AI Masterclass Released',
      message: 'Check out the newly updated PyTorch 2.0 & Transformer modules.',
      link: '#/courses/crs-2',
      read: true,
      createdAt: '2026-02-10T09:00:00Z'
    }
  ],

  announcements: [
    {
      id: 'ann-1',
      title: 'LearnHub 2026 Global AI & Cloud Certification Challenge',
      content: 'Participate in our monthly diagnostic challenge. Top performers in standalone quizzes earn exclusive tuition credits and verified badge upgrades.',
      targetAudience: 'All Learners',
      priority: 'urgent',
      status: 'active',
      createdAt: '2026-02-01',
      expiresAt: '2026-03-31'
    }
  ],

  discussions: [
    {
      id: 'disc-1',
      courseId: 'crs-1',
      lessonId: 'les-103',
      userId: 'usr-1',
      userName: 'Alex Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: 'How should we handle caching when mutating data with Server Actions?',
      body: 'When calling revalidatePath() inside a server action, does it invalidate both the data cache and full route cache automatically?',
      upvotes: 14,
      upvotedBy: ['usr-1', 'usr-3'],
      createdAt: '2026-02-15T16:00:00Z',
      replies: [
        {
          id: 'rep-1',
          userId: 'usr-2',
          userName: 'Dr. Sarah Chen',
          userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          isInstructor: true,
          body: 'Great question Alex! Yes, revalidatePath() purges the data cache for the matching path segments and immediately triggers a background revalidation for subsequent requests.',
          createdAt: '2026-02-15T17:30:00Z',
          upvotes: 8
        }
      ]
    }
  ],

  resources: [
    { id: 'res-1', title: 'Complete Full-Stack Architecture Roadmap 2026', category: 'Web Development', format: 'PDF', size: '3.4 MB', downloadsCount: 4120, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'res-2', title: 'Deep Learning & Transformer Math Cheat Sheet', category: 'Artificial Intelligence', format: 'PDF', size: '2.1 MB', downloadsCount: 2980, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'res-3', title: 'AWS Cloud Architecture Well-Architected Template', category: 'Cloud & DevOps', format: 'ZIP / Code', size: '1.2 MB', downloadsCount: 1840, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'res-4', title: 'Pandas & NumPy Data Wrangling Pocket Guide', category: 'Data Science', format: 'PDF', size: '1.8 MB', downloadsCount: 5600, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  ],

  orders: [
    {
      id: 'ord-1001',
      orderNumber: 'LH-ORD-9021',
      userId: 'usr-1',
      userName: 'Alex Johnson',
      items: [
        { id: 'crs-1', title: 'Modern Full-Stack Next.js & TypeScript Bootcamp', price: 79.99 }
      ],
      subtotal: 79.99,
      discount: 16.00,
      total: 63.99,
      couponCode: 'LEARN20',
      paymentMethod: 'Credit Card (Stripe)',
      status: 'completed',
      createdAt: '2026-01-15T11:00:00Z'
    }
  ],

  coupons: [
    { id: 'cp-1', code: 'LEARN20', discountType: 'percentage', discountValue: 20, minPurchase: 30, maxUsage: 1000, usedCount: 142, active: true, expiresAt: '2026-12-31' },
    { id: 'cp-2', code: 'WELCOME50', discountType: 'fixed', discountValue: 50, minPurchase: 100, maxUsage: 500, usedCount: 88, active: true, expiresAt: '2026-12-31' },
    { id: 'cp-3', code: 'SUMMER10', discountType: 'percentage', discountValue: 10, minPurchase: 0, maxUsage: 2000, usedCount: 310, active: true, expiresAt: '2026-08-31' }
  ],

  supportTickets: [
    {
      id: 'tkt-101',
      ticketNumber: 'TKT-2026-042',
      userId: 'usr-1',
      userName: 'Alex Johnson',
      userEmail: 'student@learnhub.com',
      category: 'Billing',
      subject: 'Invoice copy for company reimbursement',
      message: 'Hello, could you please confirm my tax invoice with company GST details for order LH-ORD-9021?',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2026-01-16T10:00:00Z',
      replies: [
        { id: 'tr-1', senderName: 'Admin Director', senderRole: 'admin', message: 'Hello Alex, the formal GST tax invoice has been generated and attached to your order record.', createdAt: '2026-01-16T12:00:00Z' }
      ]
    }
  ],

  mediaItems: [
    { id: 'med-1', name: 'nextjs-hero.jpg', type: 'image', size: '240 KB', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', uploadedAt: '2026-01-10' },
    { id: 'med-2', name: 'ai-masterclass.jpg', type: 'image', size: '310 KB', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800', uploadedAt: '2026-01-12' },
    { id: 'med-3', name: 'cloud-devops.jpg', type: 'image', size: '280 KB', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', uploadedAt: '2026-01-14' },
    { id: 'med-4', name: 'syllabus-guide.pdf', type: 'document', size: '1.2 MB', url: '#/resources', uploadedAt: '2026-01-15' }
  ],

  auditLogs: [
    { id: 'aud-1', actorName: 'Admin Director', action: 'COURSE_PUBLISHED', target: 'Modern Full-Stack Next.js & TypeScript Bootcamp', timestamp: '2026-01-15T10:30:00Z', ip: '192.168.1.1' },
    { id: 'aud-2', actorName: 'Admin Director', action: 'COUPON_CREATED', target: 'Coupon LEARN20 (20% off)', timestamp: '2026-01-15T10:45:00Z', ip: '192.168.1.1' },
    { id: 'aud-3', actorName: 'Alex Johnson', action: 'USER_LOGIN', target: 'Alex Johnson', timestamp: '2026-02-18T14:00:00Z', ip: '192.168.1.45' },
    { id: 'aud-4', actorName: 'Admin Director', action: 'TICKET_RESOLVED', target: 'Ticket #TKT-2026-042', timestamp: '2026-01-16T12:00:00Z', ip: '192.168.1.1' }
  ]
};

// Data Store Manager Class
class DatabaseManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    this.saveData(SEED_DATA);
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  saveData(data = this.data) {
    try {
      this.data = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('learnhub:db_updated', { detail: { timestamp: Date.now() } }));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }

  get(collectionName) {
    return this.data[collectionName] || [];
  }

  set(collectionName, items) {
    this.data[collectionName] = items;
    this.saveData();
    return items;
  }

  findById(collectionName, id) {
    const list = this.get(collectionName);
    return list.find(item => item.id === id) || null;
  }

  insert(collectionName, item) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    if (!item.id) {
      item.id = `${collectionName.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    }
    item.createdAt = item.createdAt || new Date().toISOString();
    this.data[collectionName].unshift(item);
    this.saveData();
    return item;
  }

  update(collectionName, id, updates) {
    const list = this.get(collectionName);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.data[collectionName][index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData();
    return this.data[collectionName][index];
  }

  delete(collectionName, id) {
    const list = this.get(collectionName);
    this.data[collectionName] = list.filter(item => item.id !== id);
    this.saveData();
    return true;
  }

  resetToSeed() {
    this.saveData(JSON.parse(JSON.stringify(SEED_DATA)));
    return this.data;
  }

  logAudit(actorName, action, target) {
    this.insert('auditLogs', {
      actorName,
      action,
      target,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1'
    });
  }
}

// Global Singleton DB
window.DB = new DatabaseManager();
