import { ResumeBuilder } from "@/components/resume-builder"
import { SettingsDialog } from "@/components/settings-dialog"
import "./animations.css"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-12 px-4 lg:px-8">
        <div className="relative flex flex-col items-center mb-12">
          <div className="absolute right-0 top-0">
            <SettingsDialog />
          </div>
          <div className="text-center space-y-2 mb-8">
            <div className="relative float-animation">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-50 glow-animation" />
              <h1 className="relative text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary lg:text-6xl gradient-text">
                CV in the Shell
              </h1>
            </div>
            <span className="inline-block text-sm font-medium text-muted-foreground/80 tracking-wider uppercase">
              AI-Powered Resume Builder
            </span>
          </div>
          <div className="w-full max-w-2xl space-y-4 text-left">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Paste your current resume and the job description you&apos;re applying for. The AI will analyze both and generate a tailored version of your resume that matches the job requirements.
            </p>
            <div className="text-sm text-muted-foreground/80 space-y-2">
              <p>To use this tool, you&apos;ll need either:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  OpenAI API key (<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">get it here</a>)
                </li>
                <li>
                  Anthropic Claude API key (<a href="https://console.anthropic.com/account/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">get it here</a>)
                </li>
              </ul>
              <p>Add your API key in the settings (gear icon) before starting.</p>
            </div>
          </div>
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent my-6" />
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 blur-3xl -z-10 glow-animation" />
          <ResumeBuilder />
        </div>
      </div>
    </main>
  )
}