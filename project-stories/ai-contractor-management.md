---
title: 'AI-Powered Contractor Communication for D365 F&O'
tags:
  - D365 Finance & Operations
  - X++
  - AI Agents
  - Azure OpenAI
  - Email Integration
  - Enterprise Systems
  - Automation
category: automation
date: 2025-06-16
metrics:
  impact:
    en: Enabled contractors to update work orders via email using AI agents with transparent audit trails
    da: Gjorde det muligt for entreprenører at opdatere arbejdsordrer via e-mail ved hjælp af AI-agenter med transparente revisionsspor
    sv: Möjliggjorde för entreprenörer att uppdatera arbetsorder via e-post med AI-agenter med transparenta revisionsspår
  timeframe: Active enterprise development project
embedding:
  - 0.0
---

# AI-Powered Contractor Communication for D365 F&O

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/board/ZGq40iH5ncosiXILccQRhQ/Dynaway-Contractor-Management-AI-Agent?embed-host=share" allowfullscreen></iframe>

At work, I built an AI agent system that lets contractors interact with our D365 Finance & Operations system through natural language emails. The system automatically processes contractor responses, updates work orders, and maintains a complete audit trail - all while keeping tight control over what the AI can actually do.

## The Problem

Contractors working on maintenance jobs need to communicate with our enterprise system, but forcing them to learn D365 F&O or use complex interfaces creates friction. They need a simple way to report work completion, attach photos, and update remarks without accessing the full system.

## The Solution: Email-Driven AI Agent

The system works through a natural email workflow:

**Work Order Assignment**: D365 F&O creates a work order and automatically assigns it to contractors based on the type of work. The system sends a nicely formatted email with clear instructions on what the contractor can do via reply.

**Natural Language Response**: Contractors reply in plain language: "Look ma, I am done with the work order. Here is a picture of the thing before and now!" They can attach images and write freely without worrying about system syntax or specific formats.

**AI Processing**: The AI agent reads the email, extracts intent, validates attachments, and performs only the specific actions it's been granted permission to do:
- Update work order lifecycle states
- Add worker remarks to the work order
- Save and attach images to the work order record

**Transparent Audit Trail**: Every step the AI agent takes is logged in a transparent form where all actions can be traced and reviewed. Any operation that needs human validation is flagged for review before execution.

## Safety First: Limited Permissions

The key to making this work in an enterprise environment is strict permission control. The AI agent doesn't have broad access to the system - it can only perform three specific skills:

1. Update lifecycle state on work orders
2. Update worker remarks
3. Send in and attach files

This limited scope means the AI can't accidentally modify pricing, delete records, or access sensitive data. It's powerful enough to be useful but constrained enough to be safe.

## Technical Implementation

The system integrates Azure OpenAI with D365 F&O's email processing framework. Email parsing happens through X++ code that extracts attachments and message content, then passes them to the AI agent for natural language understanding. The agent uses structured outputs to determine actions, which are then validated against the permission system before execution.

All agent decisions and actions are stored in dedicated audit tables in D365, creating a complete paper trail for compliance and debugging. Human review queues catch any ambiguous situations where the AI isn't confident in its interpretation.

**Impact**: Contractors can now complete the work order update cycle in minutes via email instead of phone calls, portal logins, or paper forms. The system handles routine updates automatically while flagging edge cases for human review.

**Tech used**: D365 Finance & Operations, X++, Azure OpenAI, Email Integration, Structured AI Outputs
