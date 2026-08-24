import { prisma } from '../../database/client';

export type PolicyTypeCategory = 'PRIVACY' | 'TERMS' | 'AI_ETHICS' | 'ESG' | 'GOVERNANCE';

export class GovernanceService {
  async getOverview() {
    const venturesCount = await prisma.venture.count();
    const activeJobsCount = await prisma.careerPosting.count({ where: { isActive: true } });

    return {
      companyName: 'Aneevarp Solutions',
      headquarters: 'Hyderabad & Global Virtual Operations',
      foundedYear: '2026',
      missionStatement:
        'To pioneer autonomous AI productivity frameworks and empower job seekers, professionals, and enterprise software ecosystems through intelligent career & document technologies.',
      corporatePillars: [
        {
          title: 'Autonomous AI Innovation',
          description:
            'Building cutting-edge AI multi-agent orchestration for job hunting, resume creation, and document synthesis.',
        },
        {
          title: 'Privacy & User Sovereignty',
          description:
            'Ensuring candidate personal details, application materials, and career history remain secure, encrypted, and private.',
        },
        {
          title: 'Inclusive Global Access',
          description:
            'Democratizing career advancement tools globally with free and affordable AI access for job seekers across continents.',
        },
      ],
      quickStats: {
        totalPortfolioVentures: venturesCount,
        activeJobsOpen: activeJobsCount,
        liveProducts: ['ZenResume (zenresume.online)', 'AI Job Search Agent (vercel.app)'],
      },
    };
  }

  async getExecutiveTeam() {
    return prisma.teamMember.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getPolicies(type?: PolicyTypeCategory) {
    const where: any = {};
    if (type) where.type = type;

    return prisma.corporatePolicy.findMany({
      where,
    });
  }
}
