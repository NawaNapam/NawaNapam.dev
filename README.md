# NawaNapam.dev 💕

A modern, anonymous chat platform designed to bring people together through meaningful connections. NawaNapam allows users to engage in anonymous conversations with real-time matching based on shared interests, while maintaining a safe and moderated environment.

## ✨ Features

### 🎭 Anonymous Chat System

- **Anonymous by Default**: Chat without revealing your identity
- **Interest-Based Matching**: Connect with people who share your interests
- **Real-time Messaging**: Instant communication powered by Socket.IO
- **Topic Tags**: Organize conversations around specific topics

### 🔐 Authentication & Safety

- **NextAuth Integration**: Secure authentication system
- **Multiple Auth Providers**: Support for various login methods
- **User Moderation**: Comprehensive reporting and moderation system
- **Content Filtering**: Automatic flagging of inappropriate content

### 💬 Chat Features

- **Multiple Message Types**: Text, images, and video support
- **Room Management**: Dynamic chat room creation and management
- **Participant Tracking**: Real-time user presence
- **Message History**: Persistent chat history with database storage

### 🛡️ Moderation & Safety

- **Report System**: Users can report inappropriate behavior
- **Automated Moderation**: AI-powered content moderation
- **Moderator Tools**: Administrative controls for community management
- **Ban System**: Temporary and permanent user restrictions

## 🏗️ Architecture

### Frontend (Next.js 15)

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with custom styling
- **Authentication**: NextAuth.js v4
- **Database**: Prisma ORM with PostgreSQL
- **Real-time**: Socket.IO client integration

### Backend (Node.js + TypeScript)

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Real-time**: Socket.IO server
- **Architecture**: Singleton pattern for socket management

### Database

- **Primary**: PostgreSQL with Prisma ORM
- **Features**:
  - User management and authentication
  - Chat rooms and messaging
  - Interest-based matching
  - Reporting and moderation system
  - Analytics and logging

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pandarudra/NawaNapam.dev.git
   cd NawaNapam.dev
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd fe
   npm install
   ```

3. **Install Backend Dependencies**

   ```bash
   cd ../be
   npm install
   ```

4. **Environment Setup**

   **Frontend** (`fe/.env.local`):

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/nawanapatam"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

   **Backend** (`be/.env`):

   ```env
   PORT=3001
   ```

5. **Database Setup**

   ```bash
   cd fe
   npx prisma generate
   npx prisma db push
   ```

6. **Run Development Servers**

   **Frontend** (in `fe` directory):

   ```bash
   npm run dev
   ```

   **Backend** (in `be` directory):

   ```bash
   npm run dev
   ```

The application will be available at:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## 📁 Project Structure

```
NawaNapam.dev/
├── fe/                          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── (routes)/        # Route groups
│   │   │   │   ├── (auth)/      # Authentication routes
│   │   │   │   └── (insider)/   # Protected routes
│   │   │   └── api/             # API routes
│   │   ├── components/          # React components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── custom/          # Custom app components
│   │   │   └── ui/              # Reusable UI components
│   │   ├── lib/                 # Utility libraries
│   │   ├── hooks/               # Custom React hooks
│   │   ├── constants/           # App constants
│   │   └── types/               # TypeScript types
│   ├── prisma/                  # Database schema & migrations
│   └── public/                  # Static assets
└── be/                          # Backend (Node.js + Express)
    └── src/
        ├── services/            # Business logic services
        ├── app.ts              # Express app configuration
        └── index.ts            # Entry point
```

## 🛠️ Built With

### Frontend Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **NextAuth.js** - Authentication library
- **Prisma** - Database ORM and toolkit
- **Socket.IO Client** - Real-time communication
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **Socket.IO** - Real-time bidirectional communication
- **JSON Web Tokens** - Secure token-based authentication

### Database & Infrastructure

- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit and query builder

## 🎯 Key Features Explained

### Anonymous Chat System

Users can join chat rooms without revealing their identity. The system matches users based on their selected interests and topic preferences, creating meaningful connections while maintaining privacy.

### Interest-Based Matching

The platform uses a sophisticated matching algorithm that pairs users based on shared interests, hobbies, and conversation topics, ensuring more engaging and relevant conversations.

### Comprehensive Moderation

A multi-layered moderation system including automated content filtering, user reporting, and administrative controls ensures a safe and welcoming environment for all users.

### Real-Time Communication

Powered by Socket.IO, the platform provides instant messaging capabilities with support for various message types including text, images, and video content.

## 📸 Screenshots

_Add screenshots of your application here when available_

## 🤝 Contributing

We welcome contributions to NawaNapam.dev! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain code coverage above 80%
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [@pandarudra](https://github.com/pandarudra) , [@OmPrasad1433](https://github.com/OmPrasad1433)

## 🔗 Links

- **Repository**: [https://github.com/pandarudra/NawaNapam.dev](https://github.com/pandarudra/NawaNapam.dev)
- **Issues**: [Report a Bug](https://github.com/pandarudra/NawaNapam.dev/issues)
- **Discussions**: [Join the Discussion](https://github.com/pandarudra/NawaNapam.dev/discussions)

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/pandarudra/NawaNapam.dev/issues) page
2. Create a new issue if your problem isn't already reported
3. Join our community discussions

---

<div align="center">
  <sub>Built with ❤️ by the NawaNapam team</sub>
</div>
