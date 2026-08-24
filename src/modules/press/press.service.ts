import { prisma } from '../../database/client';

export class PressService {
  async getAllPressReleases(category?: string) {
    const where: any = {};
    if (category) where.category = category;

    return prisma.pressRelease.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async getPressReleaseBySlug(slug: string) {
    return prisma.pressRelease.findUnique({
      where: { slug },
    });
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
    return prisma.pressRelease.create({
      data,
    });
  }

  getMediaKit() {
    return {
      companyName: 'Aneevarp Solutions',
      foundedYear: '2026',
      tagline: 'Building the Next Generation of AI Productivity & Career Systems',
      brandAssets: {
        logoPrimarySvg: 'https://aneevarp.com/assets/press/logo-primary.svg',
        logoWhitePng: 'https://aneevarp.com/assets/press/logo-white.png',
        brandGuidelinesPdf: 'https://aneevarp.com/assets/press/brand-guidelines.pdf',
      },
      pressContact: {
        email: 'support@zenresume.com',
        mediaInquiriesPhone: '+91 (040) ANEEVARP',
      },
      portfolioSummary: [
        { name: 'ZenResume', url: 'https://zenresume.online', metric: '125,000+ Resumes Generated' },
        { name: 'AI Job Search Agent', url: 'https://ai-job-search-agent-chi.vercel.app/', metric: '850,000+ Jobs Indexed' },
      ],
    };
  }
}
