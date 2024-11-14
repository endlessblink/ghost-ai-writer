# CV in the Shell

A developer-focused CV generator powered by AI that helps tailor your resume for technical job descriptions. Built with modern web technologies and powered by both OpenAI GPT-4 and Anthropic Claude.

## Features

- **Multiple AI Models**: Switch between OpenAI GPT-4 and Anthropic Claude
- **Developer-Focused**: Optimized for technical and developer job descriptions
- **ATS-Friendly**: Generates resumes that pass Applicant Tracking Systems
- **Real-time Generation**: Instant resume updates based on job requirements
- **PDF Export**: Professional PDF formatting with proper styling
- **Secure**: Local API key management with no server storage
- **Markdown Support**: Clean, formatted output in markdown
- **Dark Mode**: Built-in dark mode support for late night job hunting

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

1. Configure your preferred AI model in settings (gear icon)
2. Add your API key(s)
3. Paste the technical job description
4. Add your current resume/CV
5. Add any additional qualifications (optional)
6. Click "Generate Resume"
7. Export to PDF or copy the markdown

## Technologies Used

- Next.js 13 with App Router
- TypeScript
- Tailwind CSS
- Radix UI Components
- OpenAI GPT-4 API
- Anthropic Claude API
- Puppeteer for PDF generation
- Markdown parsing

## Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.