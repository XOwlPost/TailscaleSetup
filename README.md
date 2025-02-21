# Tailscale Infrastructure Manager

A comprehensive Tailscale infrastructure management system with real-time node monitoring, role-based access control, and intelligent network management capabilities.

## Features

- 🖥️ **Real-time Node Monitoring**: Live tracking of CPU, memory, and network metrics
- 🎯 **Health Scoring System**: Dynamic health scoring with celebratory animations for excellent performance
- 🔐 **Role-based Access Control**: Granular permission management for infrastructure access
- 📊 **Dynamic Dashboard**: Customizable widget system with drag-and-drop interface
- 📱 **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- 🤖 **Self-Healing Agent**: Automated system recovery and optimization

## Agent0 Self-Healing Features

The system includes an intelligent self-healing agent that automatically:
- 🔄 Restarts problematic services when issues are detected
- 🧹 Clears memory cache when usage is high
- 🌐 Optimizes network settings when packet loss occurs
- 📊 Monitors system health and takes proactive actions

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query, Zustand
- **UI Components**: shadcn/ui
- **Real-time Updates**: WebSocket

## Prerequisites

- Node.js 18+
- PostgreSQL
- Tailscale CLI

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/tailscale-infrastructure-manager.git
cd tailscale-infrastructure-manager
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create a .env file and add:
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

4. Start the development server
```bash
npm run dev
```

## Development

- Run `npm run db:push` to sync database schema changes
- Run `npm run dev` to start the development server
- Run `npm run build` to create a production build

## Latest Updates

- Added auto-scroll toggle for system logs
- Improved dashboard widget responsiveness
- Enhanced drag-and-drop functionality

## Server Logs

The system provides detailed logging of all healing actions:
- Service restart events
- Memory optimization actions
- Network configuration changes
- Health check results

You can view these logs in real-time when running the development server.

## License

MIT License - see the [LICENSE](LICENSE) file for details