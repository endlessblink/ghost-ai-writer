import { ResumeBuilder } from "@/components/resume-builder"
import { SettingsDialog } from "@/components/settings-dialog"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold">Ghost AI Writer</h1>
          <SettingsDialog />
        </div>
        <ResumeBuilder />
      </div>
    </main>
  )
}