import { prisma } from '../../database/client';

export type PolicyTypeCategory = 'PRIVACY' | 'TERMS' | 'AI_ETHICS' | 'ESG' | 'GOVERNANCE';

const FALLBACK_TEAM = [
  {
    id: '1',
    name: 'Executive Leadership Team',
    role: 'Chief Executive Office & Board',
    bio: 'Driving strategic vision, software innovation, and global expansion across all Aneevarp Solutions tech ventures.',
    displayOrder: 1,
  },
  {
    id: '2',
    name: 'Venture Engineering Group',
    role: 'Technology & Architecture Council',
    bio: 'Overseeing distributed architecture, AI agent development, enterprise security, and cloud scalability for ZenResume and AI Job Search Agent.',
    displayOrder: 2,
  },
];

const FALLBACK_POLICIES = [
  {
    id: '1',
    type: 'PRIVACY',
    title: 'Aneevarp Solutions Global Privacy Policy',
    content:
      'Aneevarp Solutions and its subsidiaries (including ZenResume and AI Job Search Agent) prioritize data privacy. We employ end-to-end encryption, strict user access controls, and zero unauthorized data selling to third parties.',
  },
  {
    id: '2',
    type: 'AI_ETHICS',
    title: 'Responsible Artificial Intelligence Charter',
    content:
      'We adhere to rigorous AI fairness standards. Our matching algorithms and resume generation systems are audited continuously to eliminate demographic bias, preserve candidate confidentiality, and ensure explainable AI outputs.',
  },
  {
    id: '3',
    type: 'TERMS',
    title: 'Aneevarp Corporate Terms of Service',
    content:
      'By utilizing Aneevarp Solutions platforms or APIs, users and corporate partners agree to comply with user safety rules, fair API consumption limits, and respect for intellectual property.',
  },
];

export class GovernanceService {
  async getOverview() {
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
        totalPortfolioVentures: 3,
        activeJobsOpen: 0,
        liveProducts: ['ZenResume (zenresume.online)', 'AI Job Search Agent (vercel.app)'],
      },
    };
  }

  async getExecutiveTeam() {
    try {
      const team = await prisma.teamMember.findMany({
        orderBy: { displayOrder: 'asc' },
      });
      if (!team || team.length === 0) return FALLBACK_TEAM;
      return team;
    } catch (err) {
      console.warn('[Prisma Fallback] Using in-memory team data:', err);
      return FALLBACK_TEAM;
    }
  }

  async getPolicies(type?: PolicyTypeCategory) {
    try {
      const where: any = {};
      if (type) where.type = type;

      const policies = await prisma.corporatePolicy.findMany({ where });
      if (!policies || policies.length === 0) return FALLBACK_POLICIES;
      return policies;
    } catch (err) {
      console.warn('[Prisma Fallback] Using in-memory policies:', err);
      return FALLBACK_POLICIES;
    }
  }
}
