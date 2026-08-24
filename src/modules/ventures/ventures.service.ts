import { prisma } from '../../database/client';

export type VentureStageType = 'LIVE' | 'BETA' | 'INCUBATING';

export class VenturesService {
  async getAllVentures(stage?: VentureStageType, featuredOnly?: boolean) {
    const where: any = {};
    if (stage) where.stage = stage;
    if (featuredOnly) where.isFeatured = true;

    const ventures = await prisma.venture.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return ventures.map((v) => ({
      ...v,
      techStack: JSON.parse(v.techStackJson || '[]'),
      metrics: JSON.parse(v.metricsJson || '{}'),
    }));
  }

  async getVentureBySlug(slug: string) {
    const venture = await prisma.venture.findUnique({
      where: { slug },
      include: {
        careers: {
          where: { isActive: true },
        },
      },
    });

    if (!venture) return null;

    return {
      ...venture,
      techStack: JSON.parse(venture.techStackJson || '[]'),
      metrics: JSON.parse(venture.metricsJson || '{}'),
    };
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
  }
}
