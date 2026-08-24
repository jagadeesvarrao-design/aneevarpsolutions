import { prisma } from '../../database/client';

export class MetricsService {
  async getLiveMetrics() {
    const metrics = await prisma.ecosystemMetric.findMany();
    const ventures = await prisma.venture.findMany({ select: { slug: true, name: true, stage: true } });

    // Calculate aggregated totals
    let totalResumesGenerated = 0;
    let totalActiveUsers = 0;
    let totalJobsIndexed = 0;
    let totalMatchesMade = 0;

    metrics.forEach((m) => {
      if (m.metricKey === 'resumes_generated') totalResumesGenerated += m.metricValue;
      if (m.metricKey === 'active_users') totalActiveUsers += m.metricValue;
      if (m.metricKey === 'jobs_indexed') totalJobsIndexed += m.metricValue;
      if (m.metricKey === 'matches_made') totalMatchesMade += m.metricValue;
    });

    return {
      timestamp: new Date().toISOString(),
      parentCompany: 'Aneevarp Solutions',
      totals: {
        resumesGenerated: totalResumesGenerated,
        activeUsers: totalActiveUsers,
        jobsIndexed: totalJobsIndexed,
        matchesMade: totalMatchesMade,
        totalVenturesCount: ventures.length,
      },
      venturesBreakdown: ventures.map((v) => ({
        name: v.name,
        slug: v.slug,
        stage: v.stage,
        metrics: metrics.filter((m) => m.ventureSlug === v.slug),
      })),
    };
  }

  async syncMetric(ventureSlug: string, metricKey: string, metricValue: number, metricLabel: string, unit?: string) {
    return prisma.ecosystemMetric.upsert({
      where: {
        ventureSlug_metricKey: { ventureSlug, metricKey },
      },
      update: {
        metricValue,
        metricLabel,
        unit,
        lastSyncedAt: new Date(),
      },
      create: {
        ventureSlug,
        metricKey,
        metricValue,
        metricLabel,
        unit,
      },
    });
  }
}
