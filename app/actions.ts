"use server"

import { getOpenAIClient } from '@/lib/openai'
import { sampleJobListing, sampleQualifications, sampleCV } from '@/lib/sample-data'
import { generateResumeContent } from '@/lib/resume-generator'
import { storage } from '@/lib/storage'

export async function generateResume(jobListing: string, qualifications: string | undefined, existingCV: string) {
  try {
    // Test mode - return mock data if using sample inputs
    if (
      jobListing === sampleJobListing &&
      existingCV === sampleCV &&
      (!qualifications || qualifications === sampleQualifications)
    ) {
      return `# John Doe
Senior Frontend Developer

## Professional Summary
Experienced Frontend Developer with 6+ years of expertise in React, TypeScript, and modern web technologies. Proven track record of leading development teams and delivering high-performance web applications.

## Experience
**Lead Frontend Developer | ABC Tech | 2020-Present**
- Led a team of 5 developers in building and maintaining a large-scale e-commerce platform
- Implemented a comprehensive design system using React and Tailwind CSS
- Achieved 40% improvement in page load times through performance optimization
- Mentored junior developers and established best practices

**Frontend Developer | StartupXYZ | 2018-2020**
- Developed responsive web applications using React and TypeScript
- Integrated REST and GraphQL APIs for seamless data management
- Contributed to team growth through mentorship initiatives

## Skills
- Frontend: React, TypeScript, Next.js, HTML5, CSS3
- Styling: Tailwind CSS, Responsive Design
- Performance: Web Vitals Optimization, Lazy Loading
- APIs: REST, GraphQL
- Tools: Git, Modern Build Tools

## Education
Bachelor of Science in Computer Science
Tech University, Class of 2018

## Certifications
- Web Performance Optimization
- Advanced React Patterns
- TypeScript Development`
    }

    return await generateResumeContent(jobListing, qualifications, existingCV)
  } catch (error) {
    console.error('Error generating resume:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to generate resume. Please try again.')
  }
}

export async function saveResume(userId: string, resumeData: string) {
  try {
    return storage.saveResume(userId, resumeData)
  } catch (error) {
    console.error('Error saving resume:', error)
    throw error
  }
}