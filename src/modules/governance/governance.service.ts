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
    bio: 'Overseeing distributed architecture, AI agent development, enterprise security, and cloud scalability for ZenResume, AI Job Search Agent, and PDF Analyzing Bot.',
    displayOrder: 2,
  },
];

const FALLBACK_POLICIES = [
  {
    id: '1',
    type: 'PRIVACY',
    title: 'Aneevarp Solutions Global Privacy Policy (DPDP Act 2023)',
    content:
      'In compliance with the Digital Personal Data Protection Act, 2023 (Government of India), Aneevarp Solutions and its subsidiaries (including ZenResume, AI Job Search Agent, and PDF Analyzing Bot) prioritize data privacy. We employ end-to-end encryption, strict user access controls, and zero unauthorized data selling to third parties.',
  },
  {
    id: '2',
    type: 'AI_ETHICS',
    title: 'Responsible Artificial Intelligence Charter',
    content:
      'We adhere to rigorous AI fairness standards. Our matching algorithms, document analysis bots, and resume generation systems are audited continuously to eliminate demographic bias, preserve candidate confidentiality, and ensure explainable AI outputs.',
  },
  {
    id: '3',
    type: 'TERMS',
    title: 'Aneevarp Corporate Terms of Service & Intermediary Guidelines',
    content:
      'In compliance with Rule 3(1)(b) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, users agree to comply with user safety rules, fair API consumption limits, respect for intellectual property, and submission to the jurisdiction of Indian courts in Hyderabad, Telangana.',
  },
  {
    id: '4',
    type: 'GOVERNANCE',
    title: 'Statutory Grievance Redressal Mechanism (Rule 3(2) IT Rules 2021)',
    content:
      'A designated Grievance Redressal Officer is appointed for statutory dispute resolution with a mandatory SLA to acknowledge complaints within 24 hours and resolve within 15 days.',
  },
];

export class GovernanceService {
  async getOverview() {
    return {
      companyName: 'Aneevarp Solutions Private Limited',
      cin: 'U72900TG2026PTC184920',
      incorporationYear: '2026',
      rocJurisdiction: 'RoC Hyderabad, Ministry of Corporate Affairs (MCA), India',
      registeredOffice: 'Plot No. 42, Hitech City Main Rd, Madhapur, Hyderabad, Telangana — 500081, India',
      contactPhone: '+91 (040) 4859-2026',
      officialEmail: 'support@zenresume.com',
      grievanceOfficerEmail: 'grievance@aneevarp.com',
      securityPOC: 'security@aneevarp.com',
      countryOfOrigin: 'Republic of India',
      missionStatement:
        'To pioneer autonomous AI productivity frameworks and empower job seekers, professionals, and enterprise software ecosystems through intelligent career & document technologies in full compliance with Indian and global digital laws.',
      corporatePillars: [
        {
          title: 'Autonomous AI Innovation',
          description:
            'Building cutting-edge AI multi-agent orchestration for job hunting, resume creation, and document synthesis.',
        },
        {
          title: 'DPDP Privacy & User Sovereignty',
          description:
            'Ensuring candidate personal details, application materials, and career history remain secure, encrypted, and private under the DPDP Act 2023.',
        },
        {
          title: 'Inclusive Global Access',
          description:
            'Democratizing career advancement tools globally with free and affordable AI access for job seekers across continents.',
        },
      ],
      quickStats: {
        totalPortfolioVentures: 4,
        activeJobsOpen: 0,
        liveProducts: [
          'ZenResume (zenresume.online)',
          'AI Job Search Agent (vercel.app)',
          'PDF Analyzing & Answering Bot (vercel.app)',
        ],
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
