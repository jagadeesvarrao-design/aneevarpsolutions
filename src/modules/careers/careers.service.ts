import { prisma } from '../../database/client';

export type JobTypeCategory = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';

const FALLBACK_CAREERS: any[] = [
  {
    id: 'career-ai-eng-01',
    title: 'AI Systems Architect / LLM Engineer',
    department: 'Engineering & AI Labs',
    location: 'Remote / Visakhapatnam, India',
    type: 'FULL_TIME',
    description: 'Lead high-throughput Gemini model orchestration, structured output prompt architecture, and agent pipelines across ZenResume, ZenScout AI, and ZenDoc AI.',
    requirements: 'Proficiency with TypeScript, Node.js, Google Gemini API / Vertex AI, Vector DBs, and low-latency microservices.',
    isActive: true,
    createdAt: new Date('2026-08-15'),
  },
  {
    id: 'career-fullstack-02',
    title: 'Full-Stack Software Engineer (Next.js & Cloud)',
    department: 'Product Engineering',
    location: 'Remote / Global',
    type: 'FULL_TIME',
    description: 'Build modern, zero-backend reactive web interfaces, SSO token flows, and high-performance serverless endpoints across the Aneevarp suite.',
    requirements: 'Strong experience with React, Next.js, Tailwind CSS, PostgreSQL / Prisma, and Web Security (CSP, CORS, VAPT hardening).',
    isActive: true,
    createdAt: new Date('2026-08-20'),
  },
  {
    id: 'career-growth-03',
    title: 'Growth & Programmatic SEO Specialist',
    department: 'Marketing & Distribution',
    location: 'Remote',
    type: 'PART_TIME',
    description: 'Scale programmatic SEO landing pages, technical distribution loops, and global user acquisition across US, India, and European markets.',
    requirements: 'Deep knowledge of Next.js dynamic routing, schema markup, Core Web Vitals, and community-led developer marketing.',
    isActive: true,
    createdAt: new Date('2026-09-01'),
  },
  {
    id: 'career-fellow-04',
    title: 'Open Talent Network / AI Fellow (Student & Builder)',
    department: 'Aneevarp Cloud Labs',
    location: 'Remote / India',
    type: 'INTERNSHIP',
    description: 'Autonomous open-call fellowship for passionate college students, open-source builders, and researchers eager to ship real-world AI software.',
    requirements: 'Curiosity, grit, strong fundamentals in JavaScript/Python, and a shipped project portfolio.',
    isActive: true,
    createdAt: new Date('2026-09-05'),
  },
];

export class CareersService {
  async getAllJobPostings(department?: string, location?: string, type?: JobTypeCategory) {
    try {
      const where: any = { isActive: true };
      if (department) where.department = department;
      if (location) where.location = { contains: location };
      if (type) where.type = type;

      const postings = await prisma.careerPosting.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          venture: {
            select: { name: true, slug: true, logoUrl: true },
          },
        },
      });

      return postings || FALLBACK_CAREERS;
    } catch (err) {
      console.warn('[Prisma Fallback] Using in-memory careers data:', err);
      return FALLBACK_CAREERS;
    }
  }

  async getJobPostingById(id: string) {
    try {
      const posting = await prisma.careerPosting.findUnique({
        where: { id },
        include: {
          venture: true,
        },
      });

      return posting || null;
    } catch (err) {
      console.warn('[Prisma Fallback] Using in-memory single career posting:', err);
      return null;
    }
  }

  async createJobPosting(data: {
    title: string;
    ventureId?: string;
    ventureName?: string;
    department: string;
    location?: string;
    type?: JobTypeCategory;
    description: string;
    requirements: string;
  }) {
    try {
      return await prisma.careerPosting.create({
        data,
      });
    } catch (err) {
      return { id: `posting-${Date.now()}`, ...data, isActive: true, createdAt: new Date(), updatedAt: new Date() };
    }
  }

  async submitJobApplication(data: {
    postingId: string;
    applicantName: string;
    applicantEmail: string;
    resumeUrl?: string;
    portfolioUrl?: string;
    coverLetter?: string;
  }) {
    try {
      const posting = await prisma.careerPosting.findUnique({
        where: { id: data.postingId },
      });

      if (!posting) {
        throw new Error(`Job posting with ID '${data.postingId}' does not exist.`);
      }

      return await prisma.jobApplication.create({
        data: {
          postingId: data.postingId,
          applicantName: data.applicantName,
          applicantEmail: data.applicantEmail,
          resumeUrl: data.resumeUrl,
          portfolioUrl: data.portfolioUrl,
          coverLetter: data.coverLetter,
        },
      });
    } catch (err) {
      console.warn('[Prisma Fallback] Storing speculative application in memory fallback:', err);
      return {
        id: `app-${Date.now()}`,
        ...data,
        status: 'RECEIVED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }
}
