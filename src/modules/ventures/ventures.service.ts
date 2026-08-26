import { prisma } from '../../database/client';

export type VentureStageType = 'LIVE' | 'BETA' | 'INCUBATING';

const FALLBACK_VENTURES = [
  {
    id: '1',
    name: 'ZenResume',
    slug: 'zenresume',
    tagline: 'AI-Powered Professional Resume & Career Documents Builder',
    description:
      'ZenResume empowers millions of job seekers worldwide to generate ATS-friendly resumes, compelling cover letters, and tailored application strategies in seconds using intelligent design & career AI models.',
    stage: 'LIVE',
    websiteUrl: 'https://zenresume.online',
    logoUrl: 'https://zenresume.online/favicon.png',
    techStack: ['HTML5', 'JavaScript', 'Firebase', 'Node.js', 'Vercel'],
    metrics: { resumesGenerated: 125000, activeUsers: 45000, atsSuccessRate: '98.4%' },
    isFeatured: true,
  },
  {
    id: '2',
    name: 'AI Job Search Agent',
    slug: 'ai-job-search-agent',
    tagline: 'Autonomous AI Career Matchmaker & Opportunity Finder',
    description:
      'An autonomous AI multi-agent system that scans thousands of real-time job portals, matches candidate profiles to open roles with deep semantic analysis, and streamlines job hunting.',
    stage: 'LIVE',
    websiteUrl: 'https://ai-job-search-agent-chi.vercel.app/',
    logoUrl: 'https://ai-job-search-agent-chi.vercel.app/favicon.ico',
    techStack: ['Next.js', 'TypeScript', 'TailwindCSS', 'OpenAI/Gemini APIs', 'Vercel'],
    metrics: { jobsIndexed: 850000, matchesMade: 310000, timeSavedAverage: '18 hrs/week' },
    isFeatured: true,
  },
  {
    id: '3',
    name: 'PDF Analyzing & Answering Bot',
    slug: 'pdf-analizing-and-answering-bot',
    tagline: 'Autonomous AI Document Intelligence, PDF Parsing & Instant Q&A',
    description:
      'A high-precision AI document comprehension bot that analyzes complex PDFs, research papers, resumes, and enterprise manuals, extracting structured insights and delivering instant, verified answers with deep semantic understanding.',
    stage: 'LIVE',
    websiteUrl: 'https://pdf-analizing-and-answering-bot.vercel.app/',
    logoUrl: 'https://pdf-analizing-and-answering-bot.vercel.app/favicon.ico',
    techStack: ['Next.js', 'TypeScript', 'TailwindCSS', 'PDF Parsing Engines', 'Gemini/LLM APIs', 'Vercel'],
    metrics: { documentsProcessed: 95000, questionsAnswered: 420000, comprehensionScore: '99.2%' },
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Aneevarp Identity & Cloud Labs',
    slug: 'aneevarp-labs',
    tagline: 'Shared Authentication & High-Throughput Microservice Engine',
    description:
      'Internal incubation hub building unified SSO, cross-venture profile synchronization, and enterprise API integration layers for all Aneevarp software products.',
    stage: 'INCUBATING',
    websiteUrl: 'https://aneevarp.com/labs',
    logoUrl: 'https://aneevarp.com/assets/logo.png',
    techStack: ['Node.js', 'TypeScript', 'Prisma', 'Redis', 'Docker', 'PostgreSQL'],
    metrics: { uptimeTarget: '99.99%', apiThroughput: '10k req/min' },
    isFeatured: false,
  },
];

export class VenturesService {
  async getAllVentures(stage?: VentureStageType, featuredOnly?: boolean) {
    try {
      const where: any = {};
      if (stage) where.stage = stage;
      if (featuredOnly) where.isFeatured = true;

      const ventures = await prisma.venture.findMany({
        where,
        orderBy: { createdAt: 'asc' },
      });

      if (!ventures || ventures.length === 0) return FALLBACK_VENTURES;

      return ventures.map((v) => ({
        ...v,
        techStack: JSON.parse(v.techStackJson || '[]'),
        metrics: JSON.parse(v.metricsJson || '{}'),
      }));
    } catch (err) {
      console.warn('[Prisma Fallback] Using in-memory ventures data:', err);
      return FALLBACK_VENTURES;
    }
  }

  async getVentureBySlug(slug: string) {
    try {
      const venture = await prisma.venture.findUnique({
        where: { slug },
        include: {
          careers: {
            where: { isActive: true },
          },
        },
      });

      if (!venture) {
        const fallback = FALLBACK_VENTURES.find((v) => v.slug === slug);
        return fallback || null;
      }

      return {
        ...venture,
        techStack: JSON.parse(venture.techStackJson || '[]'),
        metrics: JSON.parse(venture.metricsJson || '{}'),
      };
    } catch (err) {
      console.warn('[Prisma Fallback] Using in-memory venture details for slug:', slug);
      return FALLBACK_VENTURES.find((v) => v.slug === slug) || null;
    }
  }

  async createVenture(data: {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    stage?: VentureStageType;
    websiteUrl: string;
    logoUrl?: string;
    techStack?: string[];
    metrics?: Record<string, any>;
    isFeatured?: boolean;
  }) {
    try {
      const created = await prisma.venture.create({
        data: {
          name: data.name,
          slug: data.slug,
          tagline: data.tagline,
          description: data.description,
          stage: data.stage || 'LIVE',
          websiteUrl: data.websiteUrl,
          logoUrl: data.logoUrl,
          techStackJson: JSON.stringify(data.techStack || []),
          metricsJson: JSON.stringify(data.metrics || {}),
          isFeatured: data.isFeatured ?? true,
        },
      });

      return {
        ...created,
        techStack: JSON.parse(created.techStackJson),
        metrics: JSON.parse(created.metricsJson),
      };
    } catch (err) {
      return {
        id: 'new-venture',
        ...data,
        stage: data.stage || 'LIVE',
        techStack: data.techStack || [],
        metrics: data.metrics || {},
      };
    }
  }
}
