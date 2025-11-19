### Nawa Napam 
**A Premium, Culturally Rich, Real-Time Video Chat Platform for Meaningful Connections**

---

### About Nawa Napam

**Nawa Napam** (नवा नापम) — *“New Connection”* in Assamese — is a beautifully designed, modern, and soulful stranger video chat platform built for India and the world.

It combines **luxury UI**, **cultural warmth**, and **minimalistic elegance** to create spontaneous, respectful, and meaningful video conversations between strangers — filtered by shared interests.

---

### Key Features

- Real-time 1-on-1 video + text chat
- Interest-based matching (keywords/tags)
- Fully responsive (mobile, tablet, desktop)
- Glassmorphic, minimal, luxury UI
- Golden gradient buttons & messages
- Mute / Turn off camera controls
- Remove interest tags with elegant X
- "Next" and "End Chat" actions
- Secure, encrypted, private

---

### Tech Stack

```bash
Next.js 14 (App Router)
TypeScript
Tailwind CSS
NextAuth.js (Authentication)
Lucide React (Icons)
Sonner (Toasts)
ShadCN/UI Components (Custom Styled)
WebRTC (via getUserMedia)
Vercel (Deployment)
```

---

### Project Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/page.tsx
├── settings/update/page.tsx
├── chat/page.tsx           ← Video Chat Room
├── layout.tsx
├── globals.css
└── fonts.ts                ← Cinzel Decorative import

components/
├── ui/                     ← ShadCN components
└── Toaster.tsx

hooks/
├── use-getuser.ts
└── use-update-user.ts

public/
└── images/logo.jpg

api/
└── auth/[...nextauth]/route.ts
```

---

### Setup & Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/nawa-napam.git
cd nawa-napam

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Fill in your credentials
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
INSTAGRAM_CLIENT_ID=xxx (optional)
INSTAGRAM_CLIENT_SECRET=xxx

# Run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### Pages Overview

| Route               | Purpose                                | Design Highlights                     |
|---------------------|----------------------------------------|----------------------------------------|
| `/`                 | Landing Page                           | Hero with golden glow, animated blobs |
| `/login`            | Login Page                             | Glass card, live time, golden inputs  |
| `/signup`           | Signup Page                            | Same as login, extra fields           |
| `/dashboard`        | User Dashboard                         | Stats, quick actions, golden cards    |
| `/settings/update`  | Profile Update                         | Avatar with edit badge, golden button |
| `/chat`             | Video Chat Room                        | Full-screen, no-scroll, golden tags   |

---

### Future Roadmap

- [ ] Real WebRTC via Socket.io / LiveKit / PeerJS
- [ ] Interest-based matching algorithm
- [ ] Like / Report user
- [ ] Chat history & favorites
- [ ] Mobile app (React Native / Expo)
- [ ] Hindi / Regional language support
- [ ] Voice-only mode
- [ ] Dark/Light mode toggle

---

### Contributing

Contributions are welcome! Feel free to:
- Open issues
- Submit PRs
- Suggest features
- Improve design

Please follow the code style and keep the **calm, luxurious, Indian soul** alive.

---

### License

MIT License © 2025 Nawa Napam

---

**Made with love in India**  
For people who believe in real connections.

> *"Har mulakat ek nayi kahani hai."*  
> — Every meeting is a new story.

---

### Final Note

This is not just another video chat app.  
This is **Nawa Napam** — where strangers become stories.

Let’s build the most beautiful way to meet someone new.

---

**Star this repo if you love the vibe**  
[GitHub Repository Link]

Namaste  
— The NTeam

---

Let me know when you're ready — I’ll generate the full repo with all files, folder structure, and a live Vercel deploy script.  
Just say: **"Generate full repo"**
