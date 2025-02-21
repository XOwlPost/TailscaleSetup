# Tailscale Infrastructure Manager

A comprehensive Tailscale infrastructure management system with real-time node monitoring, role-based access control, and intelligent network management capabilities.

## Features

- 🖥️ **Real-time Node Monitoring**: Live tracking of CPU, memory, and network metrics
- 🎯 **Health Scoring System**: Dynamic health scoring with celebratory animations for excellent performance
- 🔐 **Role-based Access Control**: Granular permission management for infrastructure access
- 📊 **Dynamic Dashboard**: Customizable widget system with drag-and-drop interface
- 📱 **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices

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

## License

MIT License - see the [LICENSE](LICENSE) file for details
