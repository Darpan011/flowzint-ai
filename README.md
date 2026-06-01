# FlowZint AI

AI-powered B2B lead intelligence and sales automation platform.

## Architecture

```
flowzint-ai/
├── service-1-lead/     → Lead Intelligence Engine  (port 5001)
├── service-2-agent/    → AI Sales Agent            (port 5002)
├── service-3-crm/      → CRM Engine                (port 5003)
└── frontend/           → React + Vite UI
```

### Service 1 — Lead Intelligence (port 5001)
- Lead intake (domain, LinkedIn URL, or company name)
- Enrichment via Serper (real-time web search)
- ICP scoring via Ollama (AI-powered)
- Outreach email draft generation
- Bulk CSV processing
- Auto-notifies Service 2 on new leads

### Service 2 — AI Agent (port 5002)
- Receives lead webhooks from Service 1 & 3
- Builds multi-touch outreach sequences (HOT/WARM/COLD)
- Sends Day-1 emails via Resend
- Drafts LinkedIn & WhatsApp messages
- Objection handling via Ollama
- Syncs outcomes back to CRM

### Service 3 — CRM Engine (port 5003)
- Full lead lifecycle management
- Status transitions with activity logging
- Lead assignment to team members
- Notes and timeline tracking
- Analytics summary dashboard
- Auto-notifies Service 2 on new leads

## Prerequisites

- Node.js 18+
- [Ollama](https://ollama.ai) running locally: `ollama serve`
- Ollama model: `ollama pull qwen2.5:3b`
- Supabase project (credentials in `.env` files)
- Serper API key (for web enrichment)

## Getting Started

```bash
# Start Service 1 — Lead Intelligence
cd service-1-lead
npm install
npm run dev

# Start Service 2 — AI Agent (new terminal)
cd service-2-agent
npm install
npm run dev

# Start Service 3 — CRM (new terminal)
cd service-3-crm
npm install
npm run dev

# Start Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Environment Variables

Each service has a `.env` file pre-configured. Update these keys:
- `ANTHROPIC_API_KEY` — in `service-2-agent/.env` (optional, for Claude fallback)
- `SERPER_API_KEY` — in `service-1-lead/.env` and `service-3-crm/.env`
- `SUPABASE_URL` + `SUPABASE_KEY` — all services (already set)

## API Reference

### Service 1 — Lead Intelligence (5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /lead/analyze | Enrich + score a lead |
| POST | /lead/process | Process a domain |
| GET | /lead | List all leads |
| GET | /lead/search?company= | Search leads |
| GET | /lead/stats | Lead statistics |
| GET | /lead/:id | Fetch lead by ID |
| DELETE | /lead/:id | Delete a lead |
| POST | /leads/bulk | Upload CSV for bulk processing |

### Service 2 — AI Agent (5002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| POST | /webhook/lead | Receive lead + trigger sequence |
| POST | /objection/handle | Handle a sales objection |

### Service 3 — CRM (5003)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Health check |
| POST | /lead/create | Create a lead manually |
| POST | /lead/analyze | Enrich + score a lead |
| GET | /lead | List all leads |
| GET | /lead/search?company= | Search leads |
| GET | /lead/stats | Lead statistics |
| GET | /lead/:id | Fetch lead by ID |
| GET | /lead/:id/timeline | Fetch activity timeline |
| PATCH | /lead/:id/status | Update lead status |
| PATCH | /lead/:id/assign | Assign lead to team member |
| POST | /lead/:id/note | Add a note |
| DELETE | /lead/:id | Delete a lead |
| GET | /analytics/summary | Analytics dashboard data |

## Data Flow

```
User Input
   ↓
Service 1: Enrich → Score → Generate Outreach → Save to DB
   ↓ (webhook)
Service 2: Build Sequence → Send Day-1 Email → Update CRM
   ↑
Service 3: CRM operations (status changes, notes) also trigger Service 2
```

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Database**: Supabase (PostgreSQL)
- **AI**: Ollama (local) + Claude (Anthropic SDK)
- **Email**: Resend
- **Search**: Serper API
- **Frontend**: React + Vite + Tailwind CSS
