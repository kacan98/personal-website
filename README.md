# Personal Portfolio

A multilingual portfolio and CV site built with Next.js and TypeScript.

The project combines a public-facing portfolio with a few practical tools around CV tailoring, translation, and application workflows. The strongest parts are the project presentation, multilingual content, and the focus on real product and internal-tooling work rather than generic portfolio filler.

## Highlights

- Project-focused portfolio with curated work and longer project stories
- Public CV with print support and multilingual content
- Private CV tooling for tailoring, translation, and application prep
- Chrome extension support for moving job-posting context into the workflow

## Tech Stack

- Next.js
- React
- TypeScript
- Material UI
- OpenAI API
- Redux Toolkit

## Local Development

```bash
git clone https://github.com/kacan98/personal-website.git
cd personal-website
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm start
```

## Environment Notes

Some features require environment variables to be configured before they can be used:

- `OPENAI_API_KEY` for AI-powered routes
- `JWT_SECRET` and `CV_ADMIN_PASSWORD` for protected CV tooling
- `NEXT_PUBLIC_SITE_URL` for the canonical public site URL
