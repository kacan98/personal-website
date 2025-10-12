---
title: "Git-to-Jira Bridge"
description: "Full-stack time tracking system that automatically syncs development hours from Git commits to Jira worklogs, eliminating manual time reporting."
image: "/images/projects/git-to-jira-bridge.png"
imageAlt: "Git-to-Jira Bridge dashboard showing time tracking interface"
tech: ["TypeScript", "React", "Node.js", "Express", "Git API", "Jira API", "Vercel", "CSV Processing"]
links:
  - title: "Deployment"
    url: "https://log-bridge.vercel.app"
    iconName: "externalLink"
  - title: "Repo"
    url: "https://github.com/kacan98/track-current-task"
    iconName: "gitHub"
featured: true
order: 1
---

## Overview

Git-to-Jira Bridge is a comprehensive time tracking solution that bridges the gap between actual development work and time reporting requirements. Built to solve the tedious task of manual time logging, this system automatically captures development hours from Git activity and seamlessly syncs them to Jira worklogs.

## The Problem

Manual time tracking is disruptive and time-consuming for developers. Traditional approaches interrupt the development flow and often result in inaccurate or forgotten time entries, making Jira time reporting a painful administrative burden.

## The Solution

A 3-step automated workflow:

1. **📊 Data Collection** - Multiple flexible input methods:
   - Background tracker that monitors Git repositories in real-time
   - GitHub commits integration for historical data generation
   - CSV upload for existing time tracking data
   - Manual entry with user-friendly web interface

2. **✏️ Smart Editing** - Intelligent time entry management:
   - Automatic task ID extraction from branch names using regex patterns
   - Auto-populated Jira task details when connected
   - Weekly/daily views with drag-and-drop editing
   - Bulk operations for recurring tasks

3. **🚀 One-Click Sync** - Seamless Jira integration:
   - Secure authentication with personal access tokens
   - Automatic worklog creation with proper task linking
   - Support for both Jira Cloud and Server instances

## Technical Architecture

**Frontend**: React-based web interface with TypeScript for type safety and modern UI patterns
**Backend**: Express.js API designed for serverless deployment on Vercel
**Background Tracker**: Standalone desktop application for continuous Git monitoring
**Data Flow**: Real-time Git monitoring → CSV generation → Web interface → Jira API integration

```
Data Sources → Web Interface → Jira
     ↓              ↓           ↓
Background      Edit/Review   Worklogs
GitHub API      Time Entries   API Sync
CSV Upload      Task Details   Cloud/Server
```

## Key Features

- **Privacy-First**: All data stored locally in browser or CSV files, no server-side data persistence
- **Flexible Input**: Multiple data sources accommodate different workflows
- **Smart Automation**: Automatic task ID extraction and Jira task detail population
- **Cross-Platform**: Desktop tracker works on Windows, Mac, and Linux
- **Real-Time Monitoring**: Detects file changes, commits, and branch checkouts
- **Secure Authentication**: HTTP-only cookies and secure token handling
- **Production-Ready**: 41 releases with automated CI/CD pipeline

## Business Impact

- **Time Savings**: Saves approximately 1 hour per month per developer
- **100% Accuracy**: Captures actual development time vs. estimates
- **Seamless Integration**: Works with existing Git and Jira workflows
- **Zero Disruption**: Background monitoring doesn't interrupt development flow

## Technical Highlights

- **Monorepo Architecture**: Organized packages for maintainability
- **Type-Safe APIs**: Full TypeScript implementation across stack
- **Serverless-Ready**: Optimized for Vercel deployment
- **Automated Releases**: CI/CD pipeline with semantic versioning
- **Cross-Platform Desktop**: Electron-based background tracker
- **RESTful Design**: Clean API interfaces for extensibility