import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface EmailGenerationInput {
  candidateName: string;
  candidateRole: string;
  candidateTechStack: string[];
  candidateExperience: string;
  leadName: string;
  leadTitle: string;
  leadCompany: string;
  leadTechStack: string[];
  sharedTechnologies: string[];
}

interface GeneratedEmail {
  subject: string;
  body: string;
}

export async function generateColdEmail(
  input: EmailGenerationInput
): Promise<GeneratedEmail> {
  try {
    const sharedTechContext =
      input.sharedTechnologies.length > 0
        ? `You both share expertise in: ${input.sharedTechnologies.join(', ')}.`
        : '';

    const prompt = `You are an expert at writing high-value cold emails to tech leaders.

CANDIDATE INFO:
- Name: ${input.candidateName}
- Looking for: ${input.candidateRole}
- Tech stack: ${input.candidateTechStack.join(', ')}
- Experience: ${input.candidateExperience}

TARGET RECIPIENT:
- Name: ${input.leadName}
- Title: ${input.leadTitle}
- Company: ${input.leadCompany}
- Known tech stack: ${input.leadTechStack.join(', ')}
${sharedTechContext}

INSTRUCTIONS:
Write a CRISP, HIGH-VALUE cold email from ${input.candidateName} to ${input.leadName}.

REQUIREMENTS:
1. NO FLUFF. No "I hope this email finds you well" or generic openings.
2. NO BEGGING. This isn't "please hire me". This is "here's specific value I can provide".
3. TECHNICAL FOCUS. Show you understand their engineering challenges. Reference their tech stack.
4. MAXIMUM 150 words in body.
5. Subject line: Under 60 characters, compelling but not clickbait.
6. Personal touch: Show you've done research.

OUTPUT FORMAT:
Subject: [subject line]

[email body - crisp, no fluff, technical]

Remember: You're writing as ${input.candidateName}, and the goal is to get ${input.leadName} interested in a conversation about ${input.candidateRole} opportunities.`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const subjectMatch = responseText.match(/Subject:\s*(.+)/);
    const bodyMatch = responseText.match(/Subject:.*?\n\n([\s\S]+)/);

    const subject = subjectMatch
      ? subjectMatch[1].trim()
      : 'Quick question about your engineering stack';
    const body = bodyMatch
      ? bodyMatch[1].trim()
      : responseText.replace(/Subject:.*?\n\n/, '').trim();

    return {
      subject,
      body,
    };
  } catch (error: any) {
    console.error('Claude email generation error:', error.message);
    throw new Error(`Failed to generate email: ${error.message}`);
  }
}

export async function parseCV(cvText: string): Promise<{
  name?: string;
  experience?: string;
  skills?: string[];
  targetRole?: string;
}> {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Extract key info from this CV/resume. Return JSON with: name, years_of_experience, top_skills (array), and inferred target_role.

CV TEXT:
${cvText}

Return ONLY valid JSON, no markdown.`,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '{}';

    try {
      const parsed = JSON.parse(responseText);
      return {
        name: parsed.name,
        experience: `${parsed.years_of_experience || 0} years`,
        skills: parsed.top_skills || [],
        targetRole: parsed.target_role,
      };
    } catch {
      return { experience: 'N/A', skills: [] };
    }
  } catch (error: any) {
    console.error('CV parsing error:', error.message);
    return { experience: 'N/A', skills: [] };
  }
}
