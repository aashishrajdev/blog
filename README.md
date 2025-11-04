# Blog - Article Sharing Platform

A modern, glassmorphism-styled blogging platform built with Next.js, PostgreSQL, and NextAuth.

## Features

- 📝 Create and publish articles with rich text content
- 🖼️ Add cover images to your articles
- 💬 Comment on articles (authentication required)
- 👤 User authentication and profiles
- 🎨 Beautiful Apple-inspired glassmorphism UI
- 📱 Fully responsive design
- 🔒 Secure user sessions with NextAuth

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **Styling**: Custom glassmorphism CSS with Manrope font
- **Image Hosting**: ImageKit (optional)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables in `.env.local`:

```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

3. Run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog!

## Database Schema

### Articles

- Title, content, description
- Cover image URL
- Author information
- Timestamps

### Comments

- Article reference
- User information
- Comment content
- Timestamps

### Users

- Email, password (hashed)
- User metadata
- Timestamps

## Features in Detail

### Articles

- Users must be logged in to create articles
- Each article includes:
  - Title (max 200 characters)
  - Content (unlimited)
  - Description (max 500 characters)
  - Optional cover image
  - Author attribution

### Comments

- Only authenticated users can comment
- Users can delete their own comments
- Comments are displayed in chronological order
- Real-time comment count display

## License

MIT

A modern video sharing platform built with Next.js, featuring secure user authentication, video uploads, and a responsive interface.

## Features

### Video Management

- Upload videos with custom thumbnails
- Personal dashboard for video management
- Delete videos with ownership verification
- Public video gallery accessible to all users

### Authentication & Security

- Multiple authentication providers (Google, GitHub, Email/Password)
- JWT-based sessions with 30-day expiration
- Password hashing with bcrypt
- Input validation and security headers
- Route protection with middleware

### User Interface

- Responsive design for all devices
- Clean, modern interface
- Real-time upload progress tracking
- Intuitive navigation and user experience

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js v4
- **File Storage**: ImageKit
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+
- PostgreSQL database
- ImageKit account
- Google/GitHub OAuth credentials (optional)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nextjs-poject
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env.local` file:

   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name

   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret_key
   NEXTAUTH_URL=http://localhost:3000

   # ImageKit
   NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

   # OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   ```

4. **Database setup**

   ```bash
   # Generate and run migrations
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
nextjs-poject/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── components/        # Reusable components
│   ├── dashboard/         # User dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── profile/          # User profile
├── db/                   # Drizzle database schemas
│   └── schema.ts         # Database schema definitions
├── utils/                # Utility functions
├── middleware.ts         # NextAuth middleware
├── drizzle.config.ts     # Drizzle configuration
└── next.config.ts       # Next.js configuration
```

## Configuration

### PostgreSQL Setup

1. Create a PostgreSQL database (local or cloud provider like Supabase, Neon, etc.)
2. Update `DATABASE_URL` in your environment variables
3. Run migrations to create the database schema:
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

### ImageKit Setup

1. Sign up at [ImageKit.io](https://imagekit.io)
2. Get your public key, private key, and URL endpoint
3. Update the ImageKit environment variables

### OAuth Setup

1. **Google OAuth**: Create credentials in Google Cloud Console
2. **GitHub OAuth**: Create OAuth App in GitHub Developer Settings
3. Add appropriate callback URLs for each provider

## Usage

### For Users

1. Browse videos on the homepage
2. Register or login to upload videos
3. Use the dashboard to manage your videos
4. Upload videos with titles, descriptions, and thumbnails
5. Delete your own videos when needed

### For Developers

- API routes are located in `app/api/`
- Database schemas are in `db/schema.ts`
- Components are in `app/components/`
- Add new pages in the `app/` directory

## API Endpoints

- `GET /api/video` - Fetch all videos or filter by user email
- `POST /api/video` - Upload a new video (authenticated)
- `DELETE /api/video?id=<videoId>` - Delete a video (authenticated, owner only)
- `GET /api/imageKit-auth` - Get ImageKit authentication tokens

## Security Features

- JWT-based authentication with NextAuth.js
- Password hashing with bcrypt
- Input validation and sanitization
- Security headers (XSS protection, clickjacking prevention)
- Route protection with middleware
- Ownership verification for video operations

## Database Schema

The database schema is defined using Drizzle ORM in `db/schema.ts`. The schema includes:

- **users** table: Stores user authentication data

  - id (UUID)
  - email (unique)
  - password (hashed)
  - createdAt, updatedAt timestamps

- **videos** table: Stores video metadata
  - id (UUID)
  - title, description
  - videoUrl, thumbnailUrl
  - controllers (boolean)
  - ownerId, ownerName, ownerEmail
  - transformation (height, width, quality)
  - createdAt, updatedAt timestamps

Run `npx drizzle-kit studio` to view and manage your database schema visually.

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Production Environment Variables

```env
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=your_production_postgresql_connection_string
NEXTAUTH_SECRET=your_production_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

1. Check existing issues
2. Create a new issue with detailed information
3. Include error messages and reproduction steps

---

Built with Next.js, NextAuth.js, PostgreSQL, Drizzle ORM, and ImageKit.
