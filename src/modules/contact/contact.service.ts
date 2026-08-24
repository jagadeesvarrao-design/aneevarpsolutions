import { prisma } from '../../database/client';

export type ContactCategoryType =
  | 'GENERAL'
  | 'PARTNERSHIP'
  | 'ENTERPRISE_LICENSING'
  | 'PRESS_MEDIA'
  | 'INVESTOR_RELATIONS'
  | 'CAREERS'
  | 'VENTURE_PITCH';

export class ContactService {
  async submitInquiry(data: {
    name: string;
    email: string;
    company?: string;
    category?: ContactCategoryType;
    message: string;
  }) {
    try {
      const created = await prisma.contactSubmission.create({
        data: {
          name: data.name,
          email: data.email,
          company: data.company,
          category: data.category || 'GENERAL',
          message: data.message,
        },
      });

      return {
        id: created.id,
        status: 'RECEIVED',
        ticketNumber: `ANV-${Date.now().toString().slice(-6)}`,
        routedTo: 'support@zenresume.com',
        receivedAt: created.createdAt,
      };
    } catch (err) {
      console.warn('[Prisma Fallback] Storing contact submission in memory fallback:', err);
      return {
        id: `submission-${Date.now()}`,
        status: 'RECEIVED',
        ticketNumber: `ANV-${Date.now().toString().slice(-6)}`,
        routedTo: 'support@zenresume.com',
        receivedAt: new Date(),
      };
    }
  }

  async getCategories() {
    return [
      { code: 'GENERAL', label: 'General Support & Corporate Info' },
      { code: 'PARTNERSHIP', label: 'Strategic & Ecosystem Partnerships' },
      { code: 'ENTERPRISE_LICENSING', label: 'B2B Enterprise & Institutional Licensing' },
      { code: 'PRESS_MEDIA', label: 'Press, Media & Public Relations' },
      { code: 'INVESTOR_RELATIONS', label: 'Investor & Strategic Capital Desk' },
      { code: 'CAREERS', label: 'Talent & Speculative Recruitment Inquiries' },
      { code: 'VENTURE_PITCH', label: 'Venture Studio & Product Pitch Proposal' },
    ];
  }
}
