import OpenAI from 'openai'

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey?.startsWith('sk-') || apiKey.length < 40) {
    return false
  }

  try {
    const openai = new OpenAI({ 
      apiKey, 
      dangerouslyAllowBrowser: true 
    })
    
    // Make a minimal API call to validate the key
    await openai.models.list()
    return true
  } catch (error) {
    return false
  }
}

export function getOpenAIClient() {
  const apiKey = typeof window !== 'undefined' 
    ? localStorage.getItem('openai_key') 
    : process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('Please add your OpenAI API key in settings to generate resumes.')
  }

  if (!apiKey.startsWith('sk-')) {
    throw new Error('Invalid API key format. Please check your OpenAI API key in settings.')
  }

  return new OpenAI({ 
    apiKey, 
    dangerouslyAllowBrowser: true 
  })
}

export async function generateResumeWithOpenAI(
  jobDescription: string,
  existingResume: string,
  qualifications?: string,
  apiKey?: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  const prompt = `
You are a professional resume writer. Please help tailor this resume for the job description provided.
Format the resume with clear sections like:

PROFESSIONAL SUMMARY
WORK EXPERIENCE
EDUCATION
SKILLS
CERTIFICATIONS (if applicable)

Use bullet points for experiences and achievements. Make it ATS-friendly while maintaining readability.

Job Description:
${jobDescription}

Current Resume:
${existingResume}

${qualifications ? `Additional Qualifications:\n${qualifications}` : ''}

Please rewrite the resume to better match the job description, highlighting relevant experience and skills. Format each section clearly with titles in capital letters.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate resume with OpenAI API');
  }
}