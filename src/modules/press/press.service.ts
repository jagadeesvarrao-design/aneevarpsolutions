import { prisma } from '../../database/client';

const FALLBACK_PRESS = [
  {
    id: '1',
    title: 'Aneevarp Solutions Announces Global Rollout of ZenResume.online',
    slug: 'aneevarp-solutions-launches-zenresume',
    summary:
      'Aneevarp Solutions officially launches ZenResume, a high-speed AI resume builder providing ATS-optimized career templates to global job seekers.',
    content:
      'HYDERABAD / GLOBAL — Aneevarp Solutions is pleased to announce the official launch of ZenResume (zenresume.online). Built with modern UX principles and intelligent document generation engines, ZenResume solves the core bottleneck job seekers face when navigating modern ATS (Applicant Tracking Systems).',
    category: 'Product Launch',
    author: 'Aneevarp Corporate Communications',
    publishedAt: new Date('2026-05-15'),
  },
  {
    id: '2',
    title: 'Aneevarp Solutions Unveils ZenScout AI — Autonomous Career Matchmaker',
    slug: 'aneevarp-unveils-zenscout-ai',
    summary:
      'Aneevarp Solutions launches its second flagship venture, ZenScout AI, an autonomous AI-driven agent framework built for real-time job matching and career automation.',
    content:
      'GLOBAL — Expanding its portfolio of high-impact talent tech solutions, Aneevarp Solutions today revealed ZenScout AI (ai-job-search-agent-chi.vercel.app).',
    category: 'Innovation Notice',
    author: 'Aneevarp Tech & Product Office',
    publishedAt: new Date('2026-08-10'),
  },
  {
    id: '3',
    title: 'Aneevarp Solutions Launches ZenDoc AI — Document Intelligence & PDF Q&A Bot',
    slug: 'aneevarp-launches-zendoc-ai',
    summary:
      'Aneevarp Solutions officially rolls out its third flagship product, ZenDoc AI: a high-precision AI document intelligence engine for instant PDF analysis, summarization, and query extraction.',
    content:
      'GLOBAL — Expanding into intelligent document synthesis, Aneevarp Solutions today unveiled ZenDoc AI (pdf-analizing-and-answering-bot.vercel.app). The platform ingests complex PDFs, multi-page reports, and technical documentation, providing instant verified answers and citation references.',
    category: 'Product Launch',
    author: 'Aneevarp Tech & Product Office',
    publishedAt: new Date('2026-08-26'),
  },
];

export class PressService {
  async getAllPressReleases(category?: string) {
    try {
      const where: any = {};
      if (category) where.category = category;

      const releases = await prisma.pressRelease.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
      });

      if (!releases || releases.length === 0) return FALLBACK_PRESS;
      return releases;
    } catch (err) {
      console.warn('[Prisma Fallback] Using in-memory press releases:', err);
      return FALLBACK_PRESS;
    }
  }

  async getPressReleaseBySlug(slug: string) {
    try {
      const release = await prisma.pressRelease.findUnique({
        where: { slug },
      });

      if (!release) return FALLBACK_PRESS.find((p) => p.slug === slug) || null;
      return release;
    } catch (err) {
      return FALLBACK_PRESS.find((p) => p.slug === slug) || null;
    }
  }

  async createPressRelease(data: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    category?: string;
    author?: string;
    mediaAssetsUrl?: string;
  }) {
    try {
      return await prisma.pressRelease.create({ data });
    } catch (err) {
      return { id: 'new-press', ...data, publishedAt: new Date() };
    }
  }

  getMediaKit() {
    return {
      companyName: 'Aneevarp Solutions Private Limited',
      foundedYear: '2026',
      tagline: 'Building the Next Generation of AI Productivity, Document & Career Systems',
      brandAssets: {
        logoPrimaryJpg: 'https://aneevarpsolutions.vercel.app/images/brand-logo.jpg',
        logoZenResumePng: 'https://aneevarpsolutions.vercel.app/images/zenresume-logo.png',
        pressContactEmail: 'support@zenresume.com',
      },
      pressContact: {
        email: 'support@zenresume.com',
        founderEmail: 'aneevarpsolutions@gmail.com',
        mediaInquiriesPhone: '+91 (040) 4859-2026',
      },
      portfolioSummary: [
        { name: 'ZenResume', url: 'https://zenresume.online', metric: '125,000+ Resumes Generated' },
        { name: 'ZenScout AI', url: 'https://ai-job-search-agent-chi.vercel.app/', metric: '850,000+ Jobs Indexed' },
        { name: 'ZenDoc AI', url: 'https://pdf-analizing-and-answering-bot.vercel.app/', metric: '95,000+ PDFs Analyzed' },
      ],
    };
  }
}
