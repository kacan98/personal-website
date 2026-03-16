---
title: From Portfolio Site to AI Job Application Platform
tags:
  - Next.js
  - React
  - TypeScript
  - OpenAI GPT-5
  - Material-UI
  - Product Design
  - Chrome Extension
  - Recruiter UX
category: fullstack
date: 2026-03-16
metrics:
  impact: Turns a personal website into a practical workspace for tailored job applications and client-facing storytelling
  timeframe: Product built and iterated through real use
liveUrl: https://kcancara.vercel.app/en/cv
sourceUrl: https://github.com/openclaw/personal-website-3
---
# A portfolio that behaves like a product

Most personal websites stop at "here is my CV." I wanted something more useful.

This project started as a portfolio, but I kept pushing it until it became a real workflow tool: a place where a recruiter can quickly understand my background, a potential client can inspect how I think, and I can tailor a strong application without jumping between six different tools.

![Homepage showing the product framing and navigation across portfolio, CV, stories, and chat.](/images/project-stories/ai-job-application-platform/home-hero.png)

## What makes it different

The site combines several layers that usually live in separate products:

- A public portfolio and project gallery
- A recruiter-friendly CV page
- An authenticated inline CV editor
- Role-specific CV adjustment flows
- Translation support for multilingual applications
- A Chrome extension for capturing job descriptions
- A project stories section for deeper proof of work
- A chatbot trained on the portfolio content

That combination is what makes the project interesting. It is not just a design exercise and it is not just an AI demo. It is a practical product built around an actual recurring workflow.

## A strong first impression matters

The public-facing side of the site is intentionally simple to navigate. A visitor can move between portfolio pieces, the CV, project stories, and the chatbot without needing context first.

![Portfolio overview showing a browsable set of projects rather than a single long resume page.](/images/project-stories/ai-job-application-platform/portfolio-grid.png)

For recruiters, that means the site works as a fast screening tool. For potential customers, it means the work is framed as outcomes and capabilities, not just technology names.

## The CV is readable before it is editable

The CV page is designed to stand on its own as a polished public document. Even without logging in, the layout reads like a finished deliverable rather than a draft workspace.

![Public CV view with a clean two-column layout and link-rich contact and skills sections.](/images/project-stories/ai-job-application-platform/cv-public.png)

That distinction matters to me. Public visitors should see a calm, credible presentation first. Editing tools only appear when they are genuinely useful.

## The same page becomes a working editor

Once authenticated, the exact same CV becomes editable in place. That means I am not maintaining content in one screen and previewing it in another. I am editing the real output directly.

![Authenticated edit mode with inline editing controls and a compact action rail for tailoring workflows.](/images/project-stories/ai-job-application-platform/cv-edit-mode.png)

This is one of the parts I am happiest with. It shows how I like to build products: keep the workflow close to the final result, remove unnecessary context switching, and make advanced capabilities feel lightweight instead of intimidating.

The small action rail on the right turns the CV from a document into a workspace. It keeps the interface compact while still exposing the important actions.

## Tailoring starts with a clear brief

The position-adjustment flow is centered around one practical input: the job description. Instead of sending a user into a maze of settings, the workflow begins with the thing that matters most.

![Role-specific CV adjustment modal designed around a pasted job description and a focused call to action.](/images/project-stories/ai-job-application-platform/cv-manual-adjustment.png)

That decision reflects the product mindset behind the project. Good software should reduce decision fatigue. The interface should help the user focus on the few inputs that actually change the outcome.

## Translation is built into the application flow

For multilingual applications, I did not want translation to be an afterthought or an export step hidden somewhere else. It lives directly in the CV workflow.

![Translation workflow for converting the CV into another language without leaving the editing context.](/images/project-stories/ai-job-application-platform/cv-translation-modal.png)

This is a good example of the kind of end-to-end thinking I try to bring to my work. A lot of products handle the happy path, but the real quality shows up in the secondary workflows: translation, iteration, review, and reuse.

## Browser capture shortens the path from job post to tailored application

I also added a Chrome extension flow so a job posting can move straight into the tailoring workflow. That closes an important gap between finding an opportunity and acting on it.

![Chrome extension onboarding that connects live job postings to the CV tailoring workflow.](/images/project-stories/ai-job-application-platform/cv-extension-modal.png)

From a recruiter or client perspective, this matters because it shows the project is not just about generating text. It is about building a complete system around a real-world task.

## Proof matters more than claims

I do not want the site to rely only on summary bullets. The project stories section gives visitors a way to inspect how I work, what I built, and what the result was.

![Project stories page surfacing concrete examples, measurable outcomes, and implementation context.](/images/project-stories/ai-job-application-platform/project-stories-page.png)

That is valuable for hiring managers and customers alike. It turns the portfolio into evidence. Instead of saying that I can solve product and engineering problems, I can show the reader several concrete examples and let them judge the quality of the work.

## A conversational way to explore fit

The chatbot is another layer in the same idea. Some visitors want to browse. Others want to ask direct questions.

![Portfolio chatbot that lets visitors ask about background, projects, and areas of expertise.](/images/project-stories/ai-job-application-platform/chatbot-page.png)

Giving them a conversational interface makes the site more useful without replacing the structured pages. It is there to reduce friction, not to become the whole experience.

## What this project says about me as a developer

If I were evaluating an engineer through one side project, this is the kind of project I would want to see.

It shows product judgment, not just implementation speed. It shows I can connect UX, content, workflows, and engineering details into one coherent experience. It shows I think about real users, not just features. And it shows I can build something that is polished enough to present publicly while still being practical enough to use regularly.

The technical stack matters, but the more important signal is the shape of the solution:

- A public experience that feels credible and intentional
- Authenticated tools that stay close to the real output
- AI features used where they remove friction rather than create noise
- Multiple entry points for different audiences: recruiters, clients, and collaborators
- Clear proof of work through case studies and portfolio content

That is the standard I try to hold myself to when building software: useful, thoughtful, and finished enough that someone else can trust it.
