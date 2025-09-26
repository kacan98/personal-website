"use client";

import { Container } from '@mui/material';
import { getContainerSx } from '@/app/spacing';
import { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { MetricsLayout } from '@/components/pages/case-studies/layouts';

interface BlogPost {
  slug: string;
  title: string;
  tags: string[];
  category: string;
  metrics?: {
    impact?: string;
    timeframe?: string;
    usersAffected?: string;
  };
  excerpt: string;
}

// This function needs to be moved to a separate file for SSR compatibility
// For now, we'll use a simple client-side approach
function getBlogPosts(): BlogPost[] {
  // This would normally be called server-side, but for the layout toggle we need client-side rendering
  // In a real implementation, this data would be passed as props from a server component
  return [
    {
      slug: "10x-performance-improvement",
      title: "10x Performance Improvement: SQL Optimization",
      tags: [".NET", "SQL Server", "TypeScript", "Angular", "X++", "IndexedDB", "performance optimization", "pagination"],
      category: "performance",
      metrics: {
        impact: "Reduced sync time from 20+ minutes to minutes",
        timeframe: "Backend optimization project",
        usersAffected: "1000+ technicians across 100+ companies"
      },
      excerpt: "When I started as a frontend developer at Dynaway, our mobile app had a sync problem that everyone just accepted as normal. The app was designed for maintenance technicians who needed to work offline..."
    },
    {
      slug: "ai-job-application-platform",
      title: "AI Job Application Platform",
      tags: ["TypeScript", "React", "Next.js", "OpenAI", "Drizzle", "PostgreSQL", "Vercel", "authentication"],
      category: "fullstack",
      metrics: {
        impact: "Streamlined job application process with AI",
        timeframe: "Personal project",
      },
      excerpt: "This portfolio website showcases my approach to building modern web applications. It demonstrates full-stack development skills, AI integration, and thoughtful user experience design..."
    },
    {
      slug: "git-jira-bridge",
      title: "Git-Jira Time Tracking Bridge",
      tags: ["automation", "Git", "Jira", "time tracking", "productivity", "developer tools"],
      category: "automation",
      metrics: {
        impact: "Automated time tracking for development team",
        timeframe: "Internal tool development"
      },
      excerpt: "Manual time tracking was eating into our development time, so I built a bridge between Git commits and Jira to automate the process. This tool saved hours of manual work each week..."
    },
    {
      slug: "playwright-job-scraper",
      title: "LinkedIn Job Filtering with Playwright",
      tags: ["automation", "Playwright", "web scraping", "job search", "TypeScript", "filtering"],
      category: "automation",
      metrics: {
        impact: "Automated job filtering and application tracking",
        timeframe: "Job search automation project"
      },
      excerpt: "During my job search, I was overwhelmed by the volume of job postings on LinkedIn. I built an automated scraper using Playwright to filter and track relevant positions..."
    },
    {
      slug: "property-investment-calculator",
      title: "Real-Time Property Investment Calculator",
      tags: ["React", "TypeScript", "real estate", "financial modeling", "calculator", "investment analysis"],
      category: "fullstack",
      metrics: {
        impact: "Real-time investment analysis tool",
        timeframe: "Side project for real estate analysis"
      },
      excerpt: "Real estate investment requires complex calculations considering multiple factors. I built a real-time calculator that helps investors analyze property deals with instant feedback..."
    },
    {
      slug: "ankerimdia-startup",
      title: "AnkeriMedia B2B Sales Experience",
      tags: ["business development", "B2B sales", "startup", "real estate", "marketing", "Czech Republic"],
      category: "business",
      metrics: {
        impact: "5 paying customers from 50+ meetings",
        timeframe: "8-month startup experience",
        usersAffected: "Real estate agencies in Czech Republic"
      },
      excerpt: "Co-founding a marketing startup taught me the fundamentals of B2B sales and business development. This experience shaped my understanding of customer needs and market validation..."
    }
  ];
}

export default function CaseStudiesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Load posts on client side
    setPosts(getBlogPosts());
  }, []);

  return (
    <Container sx={{ ...getContainerSx(), py: 6 }}>
      {/* Header */}
      <SectionHeader
        title="Project Stories"
        description="Real projects, technical challenges, and lessons learned from building software that matters"
        size="large"
      />

      {/* Metrics Layout */}
      <MetricsLayout posts={posts} />
    </Container>
  );
}

