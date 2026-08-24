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
    return prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        category: data.category || 'GENERAL',
        message: data.message,
      },
    });
  }

  getCategories() {
    return [
      { id: 'GENERAL', label: 'General Information & Support' },
      { id: 'PARTNERSHIP', label: 'Strategic & Ecosystem Partnerships' },
      { id: 'ENTERPRISE_LICENSING', label: 'B2B Enterprise & Institutional Licensing' },
      { id: 'PRESS_MEDIA', label: 'Press, Media & Public Relations' },
      { id: 'INVESTOR_RELATIONS', label: 'Investor Relations & Capital Allocation' },
      { id: 'CAREERS', label: 'Talent Acquisition & Executive Careers' },
      { id: 'VENTURE_PITCH', label: 'Incubate / Pitch Your Product to Aneevarp Studio' },
    ];
  }
}
