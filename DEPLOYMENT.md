# Jellyfin Wrapped 2025 - Deployment Guide

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The app will be available at `http://localhost:3000`

### Manual Docker Build

```bash
# Build the image
docker build -t jellyfin-wrapped .

# Run the container
docker run -d \
  --name jellyfin-wrapped \
  -p 3000:80 \
  --restart unless-stopped \
  jellyfin-wrapped
```

### Custom Port

To use a different port, change the port mapping:

```bash
# Use port 8080 instead
docker run -d -p 8080:80 jellyfin-wrapped
```

Or in docker-compose.yml:
```yaml
ports:
  - "8080:80"
```

## Environment Variables

Currently, the app connects to your Jellyfin server dynamically through the login page, so no environment variables are needed at build time.

## Nginx Configuration

The included `nginx.conf` provides:
- SPA routing (all routes serve index.html)
- Gzip compression for assets
- Static asset caching (1 year)
- Security headers
- Health check endpoint at `/health`

## Production Considerations

### Reverse Proxy Setup

If running behind a reverse proxy (like Traefik, Nginx, Caddy), you can use labels or additional configuration:

**Example with Traefik:**
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.jellyfin-wrapped.rule=Host(`wrapped.yourdomain.com`)"
  - "traefik.http.routers.jellyfin-wrapped.entrypoints=websecure"
  - "traefik.http.routers.jellyfin-wrapped.tls.certresolver=letsencrypt"
```

**Example with Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name wrapped.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Health Checks

The container includes a health check endpoint:
```bash
curl http://localhost:3000/health
```

Should return: `healthy`

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs jellyfin-wrapped

# Verify the build completed successfully
docker images | grep jellyfin-wrapped
```

### Can't connect to Jellyfin server
- Ensure your Jellyfin server URL is accessible from your browser
- Check CORS settings on your Jellyfin server
- Verify the Jellyfin Playback Reporting plugin is installed

### Build fails
```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache
```

## Updating

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```
