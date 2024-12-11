# match-my-job

## Version
0.0.0

## Last Updated
2024-12-11

## Description
AI-powered resume and cover letter optimization tool.

## Features
- Resume parsing (PDF/TXT)
- Job description analysis
- AI-powered resume tailoring
- Cover letter generation
- ATS compatibility scoring
- Multi-region AI processing

## Prerequisites
- Node.js (Latest LTS version)
- npm or yarn
- API keys for:
  - OpenAI
  - Anthropic
  - Google Gemini

## Setup Instructions
1. Clone the repository:
```bash
git clone [repository-url]
cd match-my-job
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

4. Start development server:
```bash
npm run dev
```

## Build Instructions
```bash
npm run build
npm run preview
```

## Dependencies
- @anthropic-ai/sdk: ^0.14.1
- @google/generative-ai: ^0.2.0
- lucide-react: ^0.344.0
- openai: ^4.28.0
- pdfjs-dist: ^4.9.155
- react: ^18.3.1
- react-dom: ^18.3.1
- react-dropzone: ^14.2.3
- react-markdown: ^9.0.1

## Development Dependencies
- @eslint/js: ^9.9.1
- @tailwindcss/forms: ^0.5.7
- @tailwindcss/typography: ^0.5.10
- @types/pdfjs-dist: ^2.10.377
- @types/react: ^18.3.5
- @types/react-dom: ^18.3.0
- @vitejs/plugin-react: ^4.3.1
- autoprefixer: ^10.4.18
- eslint: ^9.9.1
- eslint-plugin-react-hooks: ^5.1.0-rc.0
- eslint-plugin-react-refresh: ^0.4.11
- globals: ^15.9.0
- postcss: ^8.4.35
- tailwindcss: ^3.4.1
- typescript: ^5.5.3
- typescript-eslint: ^8.3.0
- vite: ^5.4.2

## Project Structure
- `src/components/`: React components
- `src/services/`: Core services
- `src/types/`: TypeScript definitions
- `src/lib/`: External libraries

## License
Private
