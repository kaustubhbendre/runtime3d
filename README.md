# Runtime3D - Universal 3D Runtime Architecture & Live Data Flow Simulator
> **A Company-Grade Developer Platform**: Upload any project folder, drag-and-drop codebases, or input a GitHub repository to automatically generate an interactive 3D/2D runtime architecture diagram with trust boundaries, live data packet simulations, and database telemetry.

---

## 1. Product Mission & Vision

**Runtime3D** is a universal developer platform designed for software teams, architects, and engineers. Instead of creating static, quickly outdated architectural boxes, Runtime3D allows anyone to upload their project directory and witness a living, interactive 3D model of their runtime system:
- **Automatic Codebase Synthesis**: Parses `package.json`, frameworks (React, Next.js, FastAPI, Express), database adapters, and external SaaS services to detect 8–12 core components.
- **Trust Boundary Demarcation**: Automatically isolates Untrusted Client Browsers, Private Subnets, Edge CDNs, and Managed Cloud Databases.
- **Real-Time Simulation Engine**: Click **START SIMULATION** to watch real data packets travel between nodes along conduits into the database.
- **Dual View Modes**: Switch seamlessly between a 3D Cyber Isometric Matrix and a flat 2D Blueprint diagram.
- **Card-Based Inspection**: Supporting details (source paths, trust zone, protocols, code behavior) are displayed in slide-over inspector cards to keep the diagram clean and readable.

---

## 2. Built-in Architecture Profiles

Runtime3D includes pre-loaded profiles as reference blueprints:

1. **Full-Stack SPA + Managed DB (React 18 + Supabase RLS)**:
   - *Reference Blueprint*: Based on real-world decoupled applications (like the Oro Care Dental reference repository).
   - *Components*: Client User, Clinic Admin, Static CDN Host, Public React App, Admin Portal, Data Abstraction Layer (`supabase.js`), localStorage Fallback Store, EmailJS Notification Cloud, Supabase Auth Gateway, and Supabase PostgreSQL with Row-Level Security.
   - *Primary Path*: User → Edge CDN → React UI → Data Layer → PostgreSQL DB.

2. **E-Commerce Microservices Cloud**:
   - *Components*: Shopper Client, VPN Ops Admin, Cloudflare WAF, Fastify Order Service, Kong API Gateway, Prisma ORM, Redis Distributed Lock, Stripe Payment Gateway, Auth0 OIDC, and PostgreSQL Database.
   - *Primary Path*: Shopper → WAF → Order Service → Prisma → PostgreSQL.

3. **Autonomous AI Agent Platform**:
   - *Components*: API Consumer, FastAPI Gateway, LangChain Orchestrator, Redis Task Queue, Celery Background Workers, Pinecone Vector Store, and PostgreSQL State DB.

4. **Custom Uploaded Project (Dynamic Parser)**:
   - Drag and drop your project folder or `package.json` to immediately generate a custom 3D architecture for your own project!

---

## 3. Advanced Platform Capabilities

- **User Authentication & Registration System**: Complete login and registration modal with username, email, password, and role (`System Administrator`, `Lead Architect`, `DevOps Engineer`, `Viewer`). Includes quick-fill demo buttons for instant testing.
- **Architecture History & Recovery Vault**: Every created or modified architecture snapshot is versioned and stored with timestamps and metadata. If an architecture is accidentally deleted or altered, users can **1-Click Restore** or **Download JSON Backup** directly to their machine for disaster recovery.
- **Admin Governance & Audit Portal**: Real-time admin dashboard displaying all registered users, active sessions, and an immutable live audit log tracking who logged in, who initiated simulations, and who created or restored architecture snapshots.
- **Universal Multi-Quadrant Flow Engine**: 
  - Supports end-to-end full network traversal across all quadrants (top-left, center, top-right, bottom-left, bottom-right).
  - Includes a dedicated **⚡ TEST ALL AREAS** button that concurrently pulses packets across all 10 nodes and 10 conduits to verify live network connectivity.
  - Directionally correct orthogonal wiring, including the dedicated `Admin UI -> Data Layer` conduit (`admin ops`) with forward flow indicators.

---

## 4. How to Run & Use Runtime3D

### Step 1: Open in VS Code
Open VS Code and navigate to the project directory:
```bash
code C:\Users\User\.gemini\antigravity\scratch\architecture-3d-visualizer
```
Or use **File > Open Folder** in VS Code and select:
`C:\Users\User\.gemini\antigravity\scratch\architecture-3d-visualizer`

### Step 2: Run in Terminal
Open the integrated terminal in VS Code (`Ctrl + ~`) and run:
```bash
npm start
```
*(or `node server.js`)*

### Step 3: Launch in Browser
Open your browser and navigate to:
```
http://localhost:3000
```
> **Standalone Mode**: You can also double-click or open `public/index.html` directly in any web browser without running the server; all interactive 3D graphics, local auth state, and the recovery vault will function using built-in offline local storage.

---

## 5. Quick CLI Repository Scanner
To analyze any project directory directly from the command line:
```bash
node cli.js C:\path\to\any\project
```

---

## 6. How to Publish Online & Show on Google Search

### Step 1: Deploy to the Web (Free in 2 Minutes)
The project comes pre-configured with `vercel.json`, `robots.txt`, `sitemap.xml`, and Google Structured Data.

#### Method A: Deploy via Vercel CLI (Instant)
In your terminal inside the project directory, run:
```bash
npx vercel
```
1. Accept defaults by pressing **Enter**.
2. Within 60 seconds, you will receive your live public URL:
   `https://your-project.vercel.app`

#### Method B: Deploy via GitHub & Vercel
1. Create a GitHub repository and push your project:
   ```bash
   git init
   git add .
   git commit -m "feat: Runtime3D platform"
   git remote add origin https://github.com/YOUR_USERNAME/runtime3d.git
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com) using your GitHub account.
3. Click **Add New Project** ➔ Select your `runtime3d` repo ➔ Click **Deploy**.

---

### Step 2: Show Your Website on Google Search

Once your website has a live public URL:

1. **Open Google Search Console**:
   Visit [search.google.com/search-console](https://search.google.com/search-console) and sign in with your Google account.
2. **Add Property**:
   Choose **URL prefix** and paste your live URL (e.g. `https://your-project.vercel.app/`).
3. **Submit Sitemap**:
   In the left sidebar, click **Sitemaps** ➔ Enter `sitemap.xml` ➔ Click **Submit**.
4. **Request Instant Indexing**:
   Paste your live website URL into the top search bar (URL Inspection) and click **"Request Indexing"**.
   Googlebot will crawl your page within 24–48 hours, and your website will start appearing in Google search results with rich cards!
