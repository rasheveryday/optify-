import axios from 'axios';

interface ApolloLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  organization_name: string;
  title: string;
  linkedin_url: string;
  technologies?: string[];
}

interface ApolloSearchParams {
  location: string;
  role: string;
  companyType?: string;
}

const APOLLO_BASE_URL = 'https://api.apollo.io/v1';
const APOLLO_API_KEY = process.env.APOLLO_IO_API_KEY!;

const locationMap: Record<string, { countries: string[]; city: string }> = {
  SF: { countries: ['United States'], city: 'San Francisco' },
  NYC: { countries: ['United States'], city: 'New York' },
  Seattle: { countries: ['United States'], city: 'Seattle' },
};

const roleTitleMap: Record<string, string[]> = {
  SWE: ['Software Engineer', 'Engineer', 'Developer'],
  Backend: ['Backend Engineer', 'Backend Developer'],
  Frontend: ['Frontend Engineer', 'Frontend Developer'],
  PM: ['Product Manager', 'PM'],
};

export async function findLeadsByLocation(
  params: ApolloSearchParams
): Promise<ApolloLead[]> {
  try {
    const locationConfig = locationMap[params.location];
    if (!locationConfig) {
      throw new Error(`Unknown location: ${params.location}`);
    }

    const titles = roleTitleMap[params.role] || [params.role];
    const searchTitles = [
      'Engineering Manager',
      'Tech Lead',
      'Engineering Lead',
      'CTO',
      'VP Engineering',
      ...titles,
    ];

    const response = await axios.post(
      `${APOLLO_BASE_URL}/mixed_companies/search`,
      {
        q_organization_locations: locationConfig.countries,
        q_organization_funding_stage: [
          'Series B',
          'Series C',
          'Series D',
          'Series E',
        ],
        person_titles: searchTitles,
        limit: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        params: {
          api_key: APOLLO_API_KEY,
        },
      }
    );

    const leads: ApolloLead[] = (response.data.organizations || [])
      .flatMap((org: any) =>
        (org.people || []).map((person: any) => ({
          id: person.id,
          first_name: person.first_name,
          last_name: person.last_name,
          email: person.email || person.email_status || null,
          organization_name: org.name,
          title: person.title,
          linkedin_url: person.linkedin_url,
          technologies: org.technology_names || [],
        }))
      )
      .filter((lead: any) => lead.email)
      .slice(0, 50);

    console.log(`Found ${leads.length} leads for ${params.location} - ${params.role}`);
    return leads;
  } catch (error: any) {
    console.error('Apollo search error:', error.message);
    throw new Error(`Failed to find leads: ${error.message}`);
  }
}

export async function verifyEmail(email: string): Promise<boolean> {
  try {
    const response = await axios.post(
      `${APOLLO_BASE_URL}/email_verifications`,
      { email },
      {
        params: {
          api_key: APOLLO_API_KEY,
        },
      }
    );

    return response.data.verified;
  } catch (error) {
    console.error('Email verification error:', error);
    return true;
  }
}
