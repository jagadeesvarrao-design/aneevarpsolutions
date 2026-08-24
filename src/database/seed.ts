import { prisma } from './client';

async function seed() {
  console.log('🌱 Seeding Aneevarp Solutions database...');

  // 1. Seed Ventures
  const zenResume = await prisma.venture.upsert({
    where: { slug: 'zenresume' },
    update: {},
    create: {
      name: 'ZenResume',
      slug: 'zenresume',
      tagline: 'AI-Powered Professional Resume & Career Documents Builder',
      description:
        'ZenResume empowers millions of job seekers worldwide to generate ATS-friendly resumes, compelling cover letters, and tailored application strategies in seconds using intelligent design & career AI models.',
      stage: 'LIVE',
      websiteUrl: 'https://zenresume.online',
      logoUrl: 'https://zenresume.online/favicon.png',
      techStackJson: JSON.stringify(['HTML5', 'JavaScript', 'Firebase', 'Node.js', 'Vercel']),
      metricsJson: JSON.stringify({
        resumesGenerated: 125000,
        activeUsers: 45000,
        atsSuccessRate: '98.4%',
      }),
      isFeatured: true,
    },
  });

  const jobSearchAgent = await prisma.venture.upsert({
    where: { slug: 'ai-job-search-agent' },
    update: {},
    create: {
      name: 'AI Job Search Agent',
      slug: 'ai-job-search-agent',
      tagline: 'Autonomous AI Career Matchmaker & Opportunity Finder',
      description:
        'An autonomous AI multi-agent system that scans thousands of real-time job portals, matches candidate profiles to open roles with deep semantic analysis, and streamlines job hunting.',
      stage: 'LIVE',
      websiteUrl: 'https://ai-job-search-agent-chi.vercel.app/',
      logoUrl: 'https://ai-job-search-agent-chi.vercel.app/favicon.ico',
      techStackJson: JSON.stringify(['Next.js', 'TypeScript', 'TailwindCSS', 'OpenAI/Gemini APIs', 'Vercel']),
      metricsJson: JSON.stringify({
        jobsIndexed: 850000,
        matchesMade: 310000,
        timeSavedAverage: '18 hrs/week',
      }),
      isFeatured: true,
    },
  });

  await prisma.venture.upsert({
    where: { slug: 'aneevarp-labs' },
    update: {},
    create: {
      name: 'Aneevarp Identity & Cloud Labs',
      slug: 'aneevarp-labs',
      tagline: 'Shared Authentication & High-Throughput Microservice Engine',
      description:
        'Internal incubation hub building unified SSO, cross-venture profile synchronization, and enterprise API integration layers for all Aneevarp software products.',
      stage: 'INCUBATING',
      websiteUrl: 'https://aneevarp.com/labs',
      logoUrl: 'https://aneevarp.com/assets/logo.png',
      techStackJson: JSON.stringify(['Node.js', 'TypeScript', 'Prisma', 'Redis', 'Docker', 'PostgreSQL']),
      metricsJson: JSON.stringify({
        uptimeTarget: '99.99%',
        apiThroughput: '10k req/min',
      }),
      isFeatured: false,
    },
  });

  // 2. Seed Press Releases
  await prisma.pressRelease.upsert({
    where: { slug: 'aneevarp-solutions-launches-zenresume' },
    update: {},
    create: {
      title: 'Aneevarp Solutions Announces Global Rollout of ZenResume.online',
      slug: 'aneevarp-solutions-launches-zenresume',
      summary:
        'Aneevarp Solutions officially launches ZenResume, a high-speed AI resume builder providing ATS-optimized career templates to global job seekers.',
      content:
        'HYDERABAD / GLOBAL — Aneevarp Solutions is pleased to announce the official launch of ZenResume (zenresume.online). Built with modern UX principles and intelligent document generation engines, ZenResume solves the core bottleneck job seekers face when navigating modern ATS (Applicant Tracking Systems). Under Aneevarp Solutions, ZenResume continues to introduce feature enhancements including localized resume formatting, auto-summarization, and one-click PDF exports.',
      category: 'Product Launch',
      author: 'Aneevarp Corporate Communications',
      publishedAt: new Date('2026-05-15'),
    },
  });

  await prisma.pressRelease.upsert({
    where: { slug: 'aneevarp-unveils-ai-job-search-agent' },
    update: {},
    create: {
      title: 'Aneevarp Solutions Unveils Autonomous AI Job Search Agent Platform',
      slug: 'aneevarp-unveils-ai-job-search-agent',
      summary:
        'Aneevarp Solutions launches its second flagship venture, an autonomous AI-driven agent framework built for real-time job matching and career automation.',
      content:
        'GLOBAL — Expanding its portfolio of high-impact talent tech solutions, Aneevarp Solutions today revealed its Autonomous AI Job Search Agent (ai-job-search-agent-chi.vercel.app). The platform leverages deep semantic profile analysis to match job seekers directly with relevant open positions across top global employers, eliminating manual search fatigue.',
      category: 'Innovation Notice',
      author: 'Aneevarp Tech & Product Office',
      publishedAt: new Date('2026-08-10'),
    },
  });

  // 3. Mark all existing postings inactive
  await prisma.careerPosting.updateMany({
    data: { isActive: false },
  });

  // 4. Seed Executive Leadership
  const existingTeam = await prisma.teamMember.count();
  if (existingTeam === 0) {
    await prisma.teamMember.create({
      data: {
        name: 'Executive Leadership Team',
        role: 'Chief Executive Office & Board',
        bio: 'Driving strategic vision, software innovation, and global expansion across all Aneevarp Solutions tech ventures.',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        linkedinUrl: 'https://linkedin.com/company/aneevarp-solutions',
        twitterUrl: 'https://twitter.com/aneevarp',
        displayOrder: 1,
      },
    });

    await prisma.teamMember.create({
      data: {
        name: 'Venture Engineering Group',
        role: 'Technology & Architecture Council',
        bio: 'Overseeing distributed architecture, AI agent development, enterprise security, and cloud scalability for ZenResume and AI Job Search Agent.',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        linkedinUrl: 'https://linkedin.com/company/aneevarp-solutions',
        displayOrder: 2,
      },
    });
  }

  // 5. Seed Corporate Policies
  await prisma.corporatePolicy.upsert({
    where: { type: 'PRIVACY' },
    update: {},
    create: {
      type: 'PRIVACY',
      title: 'Aneevarp Solutions Global Privacy Policy',
      content:
        'Aneevarp Solutions and its subsidiaries (including ZenResume and AI Job Search Agent) prioritize data privacy. We employ end-to-end encryption, strict user access controls, and zero unauthorized data selling to third parties.',
    },
  });

  await prisma.corporatePolicy.upsert({
    where: { type: 'AI_ETHICS' },
    update: {},
    create: {
      type: 'AI_ETHICS',
      title: 'Responsible Artificial Intelligence Charter',
      content:
        'We adhere to rigorous AI fairness standards. Our matching algorithms and resume generation systems are audited continuously to eliminate demographic bias, preserve candidate confidentiality, and ensure explainable AI outputs.',
    },
  });

  await prisma.corporatePolicy.upsert({
    where: { type: 'TERMS' },
    update: {},
    create: {
      type: 'TERMS',
      title: 'Aneevarp Corporate Terms of Service',
      content:
        'By utilizing Aneevarp Solutions platforms or APIs, users and corporate partners agree to comply with user safety rules, fair API consumption limits, and respect for intellectual property.',
    },
  });

  // 6. Seed Ecosystem Metrics
  const existingMetrics = await prisma.ecosystemMetric.count();
  if (existingMetrics === 0) {
    await prisma.ecosystemMetric.create({
      data: {
        ventureSlug: 'zenresume',
        metricKey: 'resumes_generated',
        metricValue: 125000,
        metricLabel: 'Resumes & Documents Built',
        unit: 'documents',
      },
    });

    await prisma.ecosystemMetric.create({
      data: {
        ventureSlug: 'zenresume',
        metricKey: 'active_users',
        metricValue: 45000,
        metricLabel: 'Monthly Active Users',
        unit: 'users',
      },
    });

    await prisma.ecosystemMetric.create({
      data: {
        ventureSlug: 'ai-job-search-agent',
        metricKey: 'jobs_indexed',
        metricValue: 850000,
        metricLabel: 'Active Opportunities Indexed',
        unit: 'listings',
      },
    });

    await prisma.ecosystemMetric.create({
      data: {
        ventureSlug: 'ai-job-search-agent',
        metricKey: 'matches_made',
        metricValue: 310000,
        metricLabel: 'AI Profile Matches Generated',
        unit: 'matches',
      },
    });
  }

  console.log('✅ Aneevarp Solutions database successfully seeded!');
}

seed()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
