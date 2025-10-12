---
title: Universal Environment Bookmarklets
tags:
  - React
  - TypeScript
  - Vite
  - CSS Modules
  - Developer Tools
category: technical
date: 2025-11-01
metrics:
  impact: 'Streamlines navigation across development environments'
  timeframe: '5-hour rapid development'
---

# One Bookmark for All Your Environments

As developers, we constantly switch between environments - staging, production, dev, QA. Each time you want to check the same page across environments, you have to manually edit the URL or navigate through the site again.

I built Magic Bookmarks in about 5 hours with Claude to solve this exact problem. It's a simple tool that generates universal bookmarklets - bookmarks that work across all your environments.

## The Problem

Let's say you're testing a feature on `staging.myapp.com/settings/profile`. You want to check how it looks on production. You could:
- Manually type `production.myapp.com/settings/profile`
- Navigate through the production site to find the same page
- Keep separate bookmarks for each environment (which becomes unmanageable)

None of these options are great when you're doing rapid cross-environment testing.

## The Solution

Magic Bookmarks lets you create a single bookmarklet that captures the path structure of your current page and opens it on any configured domain. You define your environments once (like `staging.myapp.com`, `production.myapp.com`, `dev.myapp.com`), and the bookmarklet intelligently switches between them.

Click the bookmark on any environment, and you get instant navigation options to the same page on your other environments.

## Building It Fast

The whole project took about 5 hours to build with Claude:
- React 19 for the UI
- TypeScript for type safety
- Vite for lightning-fast development
- CSS Modules for scoped styling

The bookmarklet generation includes safety checks to prevent usage on incorrect domains, and the tool preserves path segments and query parameters when switching environments.

## Real-World Impact

For development teams managing multiple environments, this tool eliminates the friction of cross-environment testing. Instead of context switching and manual URL editing, you get instant environment navigation with a single click.

**Live demo:** [https://magic-bookmarks.vercel.app/](https://magic-bookmarks.vercel.app/)

**Source code:** [https://github.com/kacan98/magic-bookmarks](https://github.com/kacan98/magic-bookmarks)

**Tech used:** React 19, TypeScript, Vite, CSS Modules
