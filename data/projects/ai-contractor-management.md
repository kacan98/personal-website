---
title: "AI Contractor Management for D365 F&O"
slug: "ai-contractor-management"
description: "AI-powered email integration that lets contractors interact with D365 Finance & Operations using natural language, with strict permission controls and transparent audit trails."
image: "/images/projects/ai-contractor-management.jpg"
imageAlt: "AI Contractor Management system showing email workflow and agent processing"
tech: ["AI", "AI Agents", "D365 F&O", "Enterprise Systems"]
featured: true
listed: true
order: 2
date: 2026-06-17
---

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="100%" height="450" src="https://embed.figma.com/board/ZGq40iH5ncosiXILccQRhQ/Dynaway-Contractor-Management-AI-Agent?embed-host=share" allowfullscreen></iframe>

## The Problem

Contractors do maintenance work on industrial equipment. When they finish a job, someone needs to update the work order in D365. Before this, that meant phone calls, manual data entry, or waiting for contractors to fill out forms. Annoying for the contractor, time-consuming for the office, and slow updates for everyone tracking the work.

## The Solution

When a contractor gets assigned to a work order, they receive an email with all the details - what needs doing, where the equipment is located, any relevant purchase orders. They reply when done:

*"Replaced the pump seal on line 2, all good."*

An AI agent reads that, updates the work order status in D365, adds their message to the job notes, and sends back a confirmation. The whole thing takes 15 seconds instead of phone tag and data entry.

## How It Works

The agent has exactly three capabilities:

1. Update work order lifecycle states (only to allowed states like "In Progress" or "Completed")
2. Add contractor remarks to specific job lines
3. Save and attach files from email (photos, PDFs, whatever they send)

That's it. Can't delete anything, can't touch pricing, can't see other work orders. If the email is ambiguous or requests something outside these three actions, it gets flagged for human review.

Every conversation gets logged - turn by turn, every decision the AI makes, every action it takes. If an email fails processing, you can reprocess it and see both the original attempt and the new one. Full audit trail for compliance.

## What I Learned About AI in Production

Building this taught me what actually matters when putting AI into enterprise systems:

**Transparency is non-negotiable.** Every step the agent takes gets logged - what it read, what it decided, what action it took. When something goes wrong (and it will), you need to see exactly what the AI was thinking. We built a conversation viewer that shows turn-by-turn reasoning so customers can audit any decision.

**Start with zero permissions.** Don't give the agent access to everything and hope it behaves. Start with nothing and only add specific capabilities one at a time. This agent can't even read most of the work order fields - just what it needs to understand context and take the three allowed actions.

**Customers need control.** We let customers configure which lifecycle states contractors can request. Some want contractors to mark work "Completed", others don't. The AI respects those rules because they're baked into the permission system, not just prompt engineering.

**Develop it with customers, not for them.** We didn't build this in isolation and ship it. Started with a prototype, showed it to customers, listened to their concerns about what could go wrong, and built safeguards for those scenarios. The review queue exists because customers said "what if the AI misunderstands?" Fair question. Now ambiguous emails get flagged for human review.

The result is something people actually trust to run in production. Not because the AI is perfect, but because the system around it handles the imperfect parts safely.
