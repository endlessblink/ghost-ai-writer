# CV in the Shell

An intelligent AI-powered resume builder that helps tailor your CV for specific job descriptions.

## Features

- OpenAI GPT-4 and Anthropic Claude integration
- Real-time resume generation
- ATS-friendly formatting
- PDF export capability
- Multiple API provider support
- Secure API key management

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/cv-in-the-shell.git
cd cv-in-the-shell
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file and add your API keys:
```bash
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

4. Run the development server
```bash
npm run dev
```

## Usage

1. Add your API keys in the settings (gear icon)
2. Paste the job description
3. Add your current resume
4. Add any additional qualifications (optional)
5. Click "Generate Resume"
6. Download or copy the tailored resume

## Technologies Used

- Next.js 13
- TypeScript
- Tailwind CSS
- Radix UI
- OpenAI API
- Anthropic API

## License

MIT