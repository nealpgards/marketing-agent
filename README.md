# nealy.ai

Neal's AI marketing assistant - your personal marketing strategist and operator. Built with modern web technologies and designed for professional marketing workflows.

## Overview

nealy.ai is Neal's personal AI marketing assistant that combines strategic thinking with tactical execution. Think of it as having a senior marketing strategist available 24/7 to help with everything from campaign planning to performance analysis.

## Core Capabilities

1. **Growth Strategy & Budget Allocation** - Strategic planning and ROI optimization
2. **Brand Positioning & Messaging** - Brand strategy and value proposition development  
3. **Content Marketing & Copywriting** - Content strategy, creation, and optimization
4. **SEO / SEM** - Technical SEO, keyword strategy, and Google Ads management
5. **Paid Social & Display** - Meta, LinkedIn, and programmatic advertising
6. **Marketing Automation & CRM** - Workflow automation and lead nurturing
7. **Analytics & Experimentation** - Data analysis, A/B testing, and performance measurement
8. **Product-Led Growth** - PLG strategy and user onboarding optimization
9. **Partner & Channel Marketing** - Partnership development and co-marketing
10. **Customer Success & Advocacy** - Retention strategy and loyalty programs

## Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions)
- **Hosting**: Vercel (Production branch auto-deploy, preview URLs on PRs)
- **Runtime**: Edge-optimized serverless functions
- **Styling**: Geist font + custom CSS
- **Language**: TypeScript
- **AI**: OpenAI GPT-4 Turbo

## Features

### 🤖 **Intelligent Chat Interface**
- ChatGPT-style interface with conversation history
- Smart task detection and response formatting
- Context-aware responses with marketing expertise

### 💬 **Conversation Management**
- Persistent conversation history
- Auto-generated conversation titles
- Easy switching between past conversations
- Local storage with 50 conversation limit

### 🔗 **Connected Apps**
- **Slack Integration** - Send insights directly to channels
- **Notion Integration** - Create reports and campaign plans
- **Google Drive Integration** - Save marketing assets and reports
- Step-by-step setup instructions for each integration

### 🛡️ **Safety & Security**
- Built-in safety guardrails and content validation
- Confirmation required for bulk actions
- API key protection and PII sanitization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- OpenAI API key

### Installation

```bash
git clone https://github.com/nealpgards/nealy-ai.git
cd nealy-ai
npm install
```

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Add your OpenAI API key to `.env.local`:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting with nealy.ai.

## Deployment

### Vercel Deployment (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login and deploy:
```bash
vercel login
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add `OPENAI_API_KEY` with your OpenAI API key
   - Deploy automatically triggers on main branch pushes

## API Routes

- `/api/agent` - Core chat inference endpoint with GPT-4 Turbo
- `/api/data/airtable` - Airtable integration (mock data)
- `/api/data/analytics` - Analytics data connector (mock data)
- `/api/data/crm` - CRM integration (mock data)

## Response Formats

nealy.ai automatically detects task types and formats responses accordingly:

| Task Type | Format |
|-----------|--------|
| Strategy | Markdown outline with action items |
| Copy/Creative | Table with versions, hooks, and CTAs |
| Data Analysis | Bulleted insights with visualizations |
| Roadmap | Nested checklists with priorities |
| Audit | Prioritized findings with impact estimates |

## Usage Examples

**"Audit my website's SEO and find quick wins"**
- Returns prioritized SEO improvements with estimated traffic impact

**"Draft LinkedIn ads for B2B lead generation"**
- Creates ad variations in table format with hooks and CTAs

**"Analyze our funnel metrics and suggest improvements"**
- Provides data insights with conversion optimization recommendations

**"Create a content calendar for product launch"**
- Generates structured campaign timeline with deliverables

## Operating Philosophy

nealy.ai follows a **Think → Plan → Execute → Report** methodology:

- **Direct, data-driven approach** - No hype, just results
- **ROI-focused recommendations** - Every suggestion includes impact estimates  
- **Engineering-friendly communication** - Clear, functional, modern tone
- **Safety-first design** - Built-in guardrails and confirmation flows

## Connected Integrations

### Slack
- Send marketing insights and reports to team channels
- Real-time campaign performance updates
- Automated alert system for key metrics

### Notion  
- Create comprehensive marketing reports and campaign plans
- Build content calendars and editorial workflows
- Document strategic decisions and learnings

### Google Drive
- Save marketing assets, creative files, and campaign materials
- Organize reports and analytics in structured folders
- Share deliverables with team and stakeholders

## Contributing

nealy.ai is Neal's personal marketing assistant, but the codebase demonstrates modern AI application architecture with:

- Clean separation of concerns
- Type-safe interfaces
- Modular component design
- Comprehensive error handling
- Professional UI/UX patterns

## License

ISC License - Built by Neal Gardner