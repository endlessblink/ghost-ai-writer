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
Example:
Senior Motion Designer with 10+ years of experience in post-production and gaming. Led teams delivering 200+ projects with 
98% client satisfaction rate. Expert in Adobe Creative Suite, managing $1M+ production budgets while reducing delivery 
time by 40%.

3. Technical Skills Section
Group related skills by category with proficiency levels:
TECHNICAL SKILLS
• Motion Design: After Effects, Spine (Expert)
• Video Editing: Premiere Pro, DaVinci Resolve (Advanced)
• 3D & Graphics: Blender, Photoshop, Illustrator (Advanced)
• Project Management: Asset Management, Team Leadership

4. Professional Experience
Format each entry as:
Company Name
Primary Job Title
City, Country
MM/YYYY - MM/YYYY

• Achieved [specific result] by [specific action] resulting in [quantifiable impact]
• Begin each bullet with action verbs (Developed, Implemented, Led, etc.)
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
- No tables, columns, text boxes, graphics, logos, headers/footers, or special characters

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
- Use both full terms and acronyms: "Adobe After Effects (AE)"
- Place keywords in context of achievements
- Include relevant industry-standard certifications
- Avoid keyword stuffing and complex formatting

Format the output using markdown with these markers:
# for name (centered)
## for main sections (left-aligned, all caps)
#### for job entries
- for bullet points
| for contact information separators

Ensure all content is factual and based on the provided information.
Focus on quantifiable achievements and metrics where possible.
Maintain consistent formatting throughout the document.`

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

      const completion = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      })

      console.log('Anthropic response received:', {
        status: completion.stop_reason,
        modelUsed: completion.model,
        usage: completion.usage
      })

      content = completion.content[0]?.text || undefined
    } else {
      const openai = getOpenAIClient()
      
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

      content = completion.choices[0]?.message?.content || undefined
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
