# Personal Portfolio & AI Job Application Platform

**Live Site:** [https://kcancara.vercel.app/](https://kcancara.vercel.app/)

My personal portfolio website built with Next.js and TypeScript. This full-stack application combines a professional showcase with AI-powered job application tools.

## Project Overview

**Portfolio & Showcase**
- Interactive project gallery with filtering
- Printable CV display
- Multi-language content (EN/DA/SV)
- Mobile-responsive design

**AI-Powered Tools**
- Job description analysis and CV optimization
- Automated cover letter generation using GPT-5
- Position-specific content suggestions
- Translation between supported languages

**Browser Integration**
- Chrome extension for job site integration
- One-click job description extraction
- Seamless workflow from job posting to personalized application

**Technical Features**
- Authentication system for secure CV management
- Full internationalization support
- Print-optimized layouts

## AI Job Application Workflow

```
                    Job Application Workflow
                            │
                ┌───────────┴───────────┐
                │                       │
          Job Description          CV Tailor Extension
          (text selection)         (extract & open tool)
                │                       │
                └───────────┬───────────┘
                            │
                    Portfolio Website
                            │
                    GPT-5 AI Analysis
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   CV Analysis         Position            Cover Letter
   ├─ Personalize      Summary             Generation
   ├─ Refine          ├─ Requirements      ├─ Job-specific
   └─ Optimize        └─ Matching          └─ Professional
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                    Translation Engine
                    (EN / DA / SV)
                            │
                    Document Download
```


## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Material-UI (MUI), Emotion
- **AI Integration**: OpenAI GPT-5 API
- **State Management**: Redux Toolkit
- **Deployment**: Vercel
- **Authentication**: JWT-based auth system

## Quick Start

1. **Clone and install dependencies:**
```bash
git clone https://github.com/your-username/personal-website
cd personal-website
npm install
```

2. **Set up environment variables:**
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Fill in the required variables as shown in `.env.example`.

3. **Run the application:**
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
