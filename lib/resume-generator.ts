import { getOpenAIClient } from '@/lib/openai'

export async function generateResumeContent(jobListing: string, qualifications: string | undefined, existingCV: string): Promise<string> {
  if (!jobListing?.trim()) {
    throw new Error('Job listing is required')
  }

  if (!existingCV?.trim()) {
    throw new Error('Existing CV is required')
  }

  try {
    const openai = getOpenAIClient()
    
    const systemPrompt = `You are an expert resume writer and ATS optimization specialist. 
Your task is to create a tailored resume based on the provided job listing and existing CV.
Format the output in clean, professional Markdown.
Focus on matching keywords and skills from the job listing while maintaining authenticity.
Ensure the resume is ATS-friendly and highlights relevant experience.`

    const userPrompt = qualifications
      ? `Job Listing:\n${jobListing}\n\nApplicant Qualifications:\n${qualifications}\n\nExisting CV:\n${existingCV}`
      : `Job Listing:\n${jobListing}\n\nExisting CV:\n${existingCV}`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2048,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated')
    }

    return content
  } catch (error) {
    console.error('Resume generation error:', error)
    
    if (error instanceof Error) {
      // Handle specific OpenAI API errors
      const message = error.message.toLowerCase()
      if (message.includes('api key')) {
        throw new Error('Please add your OpenAI API key in settings')
      }
      if (message.includes('insufficient_quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your billing settings')
      }
      if (message.includes('invalid_api_key')) {
        throw new Error('Invalid OpenAI API key. Please check your settings')
      }
      throw error
    }
    
    throw new Error('An unexpected error occurred while generating the resume')
  }
}