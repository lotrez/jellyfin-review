# Jellyfin Wrapped 2025

A year-in-review experience for Jellyfin, inspired by Spotify Wrapped. See your watching stats in a beautiful, story-based interface with swipe navigation.

## Features

- 📊 **Viewing Statistics**: Total hours watched, number of plays, average session length
- 🏆 **Rankings**: See how you rank among other users
- 🎬 **Top Shows**: Your most-watched series with beautiful visuals
- 💯 **Binge Score**: Calculated from your average session length
- ❤️ **Loyalty Badge**: Awarded for dedication to your favorite shows
- 📱 **Story Interface**: Instagram-style stories with swipe navigation
- 📸 **Shareable Cards**: Export your stats as images
- 🐳 **Docker Support**: Easy deployment with Docker

## Prerequisites

- [Bun](https://bun.sh) runtime
- A Jellyfin server with the [Playback Reporting plugin](https://github.com/jellyfin/jellyfin-plugin-playbackreporting) installed

## Development

### Install dependencies

```bash
bun install
```

### Run development server

```bash
bun run dev
```

The app will be available at `http://localhost:5173`

### Build for production

```bash
bun run build
```

### Preview production build

```bash
bun run preview
```

### Lint code

```bash
bun run lint
```

## Deployment

### Docker (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Docker deployment instructions.

**Quick start:**

```bash
# Using docker-compose
docker-compose up -d

# Manual build and run
docker build -t jellyfin-wrapped .
docker run -d -p 3000:80 --name jellyfin-wrapped jellyfin-wrapped
```

### Cloudflare Pages

```bash
# Login to Cloudflare (first time only)
bun run cf:login

# Build and deploy
bun run build
bun run deploy
```

## Usage

1. Navigate to the app in your browser
2. Enter your Jellyfin server URL
3. Login with your credentials
4. View your 2025 Wrapped experience!

## Tech Stack

- **Frontend**: React 19, React Router 7, TailwindCSS 4
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **Build Tool**: Vite with Rolldown
- **Runtime**: Bun
- **Deployment**: Docker + Nginx, Cloudflare Pages

## License

MIT

## Credits

Built with [Bun](https://bun.sh) and [React](https://react.dev)
