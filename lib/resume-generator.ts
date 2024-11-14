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
    const systemPrompt = `You are a professional resume writer specializing in ATS-optimized resumes.
Create an ATS-optimized CV following these specific requirements:

1. Contact Header
Format as: FIRST LAST
City, State/Region, Country | Phone | Email
- No bullet points in contact information
- Single line format
- No social media links unless specifically relevant
- Optional: LinkedIn URL if professional

2. Professional Summary (3-4 lines)
- Start with years of experience and current title
- Include 1-2 key achievements with metrics
- Mention most relevant technical skills

3. Technical Skills Section
Group related skills by category with proficiency levels

4. Professional Experience
Format each entry as:
Company Name
Primary Job Title
City, Country
MM/YYYY - MM/YYYY

• Achieved [specific result] by [specific action] resulting in [quantifiable impact]
• Begin each bullet with action verbs
• 3-5 bullets per role
• Space between each bullet point
• Consistent punctuation throughout

5. Formatting Requirements
- Font: Arial
- Size: 10-12 points
- Margins: 1 inch all around
- Alignment: Left-aligned text
- Spacing: Single-spaced with extra space between sections
- Section Headers: ALL CAPS, bold

6. Content Guidelines
- Keep to 2 pages maximum
- Use reverse chronological order
- Include location for each role
- Spell out numbers under 10
- Use % symbol for percentages
- Use $ for monetary values
- Use consistent date format (MM/YYYY)

7. Keywords and ATS Optimization
- Mirror exact phrases from job description
- Use both full terms and acronyms
- Place keywords in context of achievements
- Include relevant industry-standard certifications

Format the output using markdown with these markers:
# for name (centered)
## for main sections (left-aligned, all caps)
#### for job entries
- for bullet points
| for contact information separators`

    const userPrompt = `Please rewrite this resume to be ATS-friendly while maintaining all factual information:

Job Description:
${jobListing}

Current Resume:
${existingCV}

Additional Qualifications:
${qualifications || 'None provided'}

Focus on highlighting relevant experience and skills that match the job requirements.`

    let content: string | undefined

    if (apiType === 'anthropic') {
      const anthropic = new Anthropic({
        apiKey: apiKey,
      })

      console.log('Sending request to Anthropic with prompt lengths:', {
        systemPrompt: systemPrompt.length,
        userPrompt: userPrompt.length
      })

      try {
        const completion = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [
            { role: 'user', content: userPrompt }
          ]
        })

        console.log('Anthropic response received:', {
          status: completion.stop_reason,
          modelUsed: completion.model,
          usage: completion.usage
        })

        content = completion.content[0].text.replace(/^Here is the ATS-optimized version of your resume:?\s*/i, '').trim()
      } catch (error) {
        console.error('Anthropic API error:', error)
        if (error instanceof Error) {
          throw new Error(`Anthropic API error: ${error.message}`)
        }
        throw new Error('Failed to generate resume with Anthropic')
      }
    } else {
      const openai = getOpenAIClient()
      
      console.log('Sending request to OpenAI with prompt lengths:', {
        systemPrompt: systemPrompt.length,
        userPrompt: userPrompt.length
      })
      
      try {
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
      } catch (error) {
        console.error('OpenAI API error:', error)
        if (error instanceof Error) {
          throw new Error(`OpenAI API error: ${error.message}`)
        }
        throw new Error('Failed to generate resume with OpenAI')
      }
    }

    if (!content) {
      throw new Error('No content generated')
    }

    console.log('Generated content length:', content.length)
    return content
  } catch (error) {
    console.error('Resume generation error:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred while generating the resume')
  }
}
