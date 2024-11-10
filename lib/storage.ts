export interface StoredResume {
  id: number
  content: string
  createdAt: string
}

export const storage = {
  getResumes(userId: string): StoredResume[] {
    if (typeof window === 'undefined') return []
    try {
      const storageKey = `user:${userId}:resumes`
      const data = window.localStorage.getItem(storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading resumes:', error)
      return []
    }
  },

  saveResume(userId: string, content: string): StoredResume {
    if (typeof window === 'undefined') {
      throw new Error('Cannot save resume in server context')
    }

    try {
      const storageKey = `user:${userId}:resumes`
      const resumes = this.getResumes(userId)
      const newResume = {
        id: Date.now(),
        content,
        createdAt: new Date().toISOString()
      }
      resumes.push(newResume)
      window.localStorage.setItem(storageKey, JSON.stringify(resumes))
      return newResume
    } catch (error) {
      throw new Error('Failed to save resume. Please try again.')
    }
  }
}