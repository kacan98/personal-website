# Next.js Portfolio Website 
bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), 
utilizing [Sanity](https://www.sanity.io/) as a CMS, styled with [MUI](https://mui.com/), 
and written in TypeScript.

# Features
- [x] Display CV
- [x] Chatbot based on OpenAI's GPT-3 that learns from the CV
- [x] Display and filter projects 
- [x] Dark Mode
- [x] Responsive Design
- [x] Mobile Friendly

# Future Features
- [ ] Optional Pages from each project


# Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#.env needs to be created with the following variables
- OPENAI_API_KEY
- NEXT_PUBLIC_SANITY_PROJECT_ID
- NEXT_PUBLIC_SANITY_DATASET
