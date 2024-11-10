import Anthropic from '@anthropic-ai/sdk';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ANTHROPIC_API_KEY: string;
    }
  }
}

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateResumeWithAnthropic(
  jobDescription: string,
  existingResume: string,
  qualifications?: string,
  apiKey?: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('Anthropic API key is required');
  }

  const anthropic = new Anthropic({
    apiKey
  });

  const prompt = `
You are a professional resume writer. Please help tailor this resume for the job description provided.

Job Description:
${jobDescription}

Current Resume:
${existingResume}

${qualifications ? `Additional Qualifications:\n${qualifications}` : ''}

Please rewrite the resume to better match the job description, highlighting relevant experience and skills. Format the resume professionally.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.content[0].type === 'text') {
      return response.content[0].text;
    }
    
    throw new Error('Unexpected response format from Anthropic API');
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error('Failed to generate resume with Anthropic API');
  }
} 