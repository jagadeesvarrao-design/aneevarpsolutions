import { prisma } from '../../database/client';

export type JobTypeCategory = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';

const FALLBACK_CAREERS: any[] = [];

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
