import { getOpenAIClient } from '@/lib/openai'
import Anthropic from '@anthropic-ai/sdk'

export async function generateResumeContent(
  jobListing: string, 
  qualifications: string | undefined, 
  existingCV: string,
  apiKey: string,
  apiType: 'openai' | 'anthropic' = 'openai'
): Promise<string> {
  if (!jobListing?.trim()) {
    throw new Error('Job listing is required')
  }

  if (!existingCV?.trim()) {
    throw new Error('Existing CV is required')
  }

  try {
    const systemPrompt = `You are an expert resume writer and ATS optimization specialist. 
Your task is to create a tailored resume based on the provided job listing and existing CV.
Format the output in clean, professional Markdown.
Focus on matching keywords and skills from the job listing while maintaining authenticity.
Ensure the resume is ATS-friendly and highlights relevant experience.`

    const userPrompt = qualifications
      ? `Job Listing:\n${jobListing}\n\nApplicant Qualifications:\n${qualifications}\n\nExisting CV:\n${existingCV}`
      : `Job Listing:\n${jobListing}\n\nExisting CV:\n${existingCV}`

    let content: string | undefined

    if (apiType === 'anthropic') {
      const anthropic = new Anthropic({
        apiKey: apiKey,
      })

      console.log('Sending request to Anthropic with prompt lengths:', {
        systemPrompt: systemPrompt.length,
        userPrompt: userPrompt.length
      })

      const completion = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      })

      console.log('Anthropic response received:', {
        status: completion.stop_reason,
        modelUsed: completion.model,
        usage: completion.usage
      })

      content = completion.content[0].text
    } else {
      const openai = getOpenAIClient(apiKey)
      
      console.log('Sending request to OpenAI with prompt lengths:', {
        systemPrompt: systemPrompt.length,
        userPrompt: userPrompt.length
      })
      
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

      console.log('OpenAI response received:', {
        status: completion.choices[0]?.finish_reason,
        modelUsed: completion.model,
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens
      })

      content = completion.choices[0]?.message?.content
    }
    if (!content) {
      throw new Error('No content generated')
    }

    console.log('Generated content length:', content.length)
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
      if (message.includes('rate limit')) {
        throw new Error('OpenAI API rate limit reached. Please try again in a moment')
      }
      // Return the original error message for other cases
      throw new Error(error.message)
    }
    
    // For non-Error objects, provide a generic message
    throw new Error('An unexpected error occurred while generating the resume')
  }
}
