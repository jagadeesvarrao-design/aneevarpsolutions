import { prisma } from '../../database/client';

export type JobTypeCategory = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';

export class CareersService {
  async getAllJobPostings(department?: string, location?: string, type?: JobTypeCategory) {
    const where: any = { isActive: true };
    if (department) where.department = department;
    if (location) where.location = { contains: location };
    if (type) where.type = type;

    return prisma.careerPosting.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        venture: {
          select: { name: true, slug: true, logoUrl: true },
        },
      },
    });
  }

  async getJobPostingById(id: string) {
    return prisma.careerPosting.findUnique({
      where: { id },
      include: {
        venture: true,
      },
    });
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
    return prisma.careerPosting.create({
      data,
    });
  }

  async submitJobApplication(data: {
    postingId: string;
    applicantName: string;
    applicantEmail: string;
    resumeUrl?: string;
    portfolioUrl?: string;
    coverLetter?: string;
  }) {
    const posting = await prisma.careerPosting.findUnique({
      where: { id: data.postingId },
    });

    if (!posting) {
      throw new Error(`Job posting with ID '${data.postingId}' does not exist.`);
    }

    return prisma.jobApplication.create({
      data: {
        postingId: data.postingId,
        applicantName: data.applicantName,
        applicantEmail: data.applicantEmail,
        resumeUrl: data.resumeUrl,
        portfolioUrl: data.portfolioUrl,
        coverLetter: data.coverLetter,
      },
    });
  }
}
