<div align="center">

<img src="https://github.com/user-attachments/assets/9d644f48-eb8a-4a0d-b4de-f89cb41ba58d" alt="BoxTrack Logo" width="120" height="120">

# BoxTrack

**Self-Hosted Inventory and Storage Management System**

*A self-hosted web application for tracking physical items across rooms, bins, and storage containers.*

[![GitHub Stars](https://img.shields.io/github/stars/netpersona/boxtrack?style=social)](https://github.com/netpersona/boxtrack/stargazers)
[![Docker Pulls](https://img.shields.io/docker/pulls/netpersona/boxtrack?style=flat&logo=docker&color=2496ED)](https://hub.docker.com/r/netpersona/boxtrack)
[![Sponsor](https://img.shields.io/badge/Sponsor-❤-ff69b4?style=flat&logo=github-sponsors)](https://github.com/sponsors/netpersona)

![Version](https://img.shields.io/badge/version-1.0.0-orange?style=flat)
![Docker](https://img.shields.io/badge/docker-ready-2496ED?style=flat&logo=docker)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

</div>

---

## Features

- **Zero Configuration** — Just run and start organizing
- **Hierarchical Organization** — Zones → Containers → Items
- **QR Code Generation** — Print labels for quick mobile scanning
- **Photo Attachments** — Capture images directly from your device camera
- **Color-Coded Zones** — Visually organize different areas
- **Print Manifests** — Generate detailed inventory lists for each container
- **Global Search** — Find any item instantly across all locations
- **Dark/Light Mode** — Easy on the eyes, day or night
- **Responsive Design** — Works on desktop, tablet, and mobile


---

## Quick Start

### Docker (Recommended)

```bash
docker run -d \
  --name boxtrack \
  -p 5001:5001 \
  -v boxtrack_data:/data \
  --restart unless-stopped \
  netpersona/boxtrack:latest
```

Open **`http://localhost:5001`** in your browser.

### Docker Compose

```yaml
services:
  boxtrack:
    image: netpersona/boxtrack:latest
    container_name: boxtrack
    restart: unless-stopped
    ports:
      - "5001:5001"
    volumes:
      - boxtrack_data:/data

volumes:
  boxtrack_data:
```

```bash
docker compose up -d
```

---

## Data Persistence

Your inventory data is stored in a SQLite database inside the `/data` directory. Mount this as a volume to preserve data across updates:

- **Docker volume**: `-v boxtrack_data:/data`
- **Host path**: `-v /path/on/host:/data`

---

## Updating

```bash
docker pull netpersona/boxtrack:latest
docker rm -f boxtrack
docker run -d \
  --name boxtrack \
  -p 5001:5001 \
  -v boxtrack_data:/data \
  --restart unless-stopped \
  netpersona/boxtrack:latest
```

Your data remains safe in the mounted volume.

---

## Unraid Installation

1. Go to **Docker** tab → **Add Container**
2. Set Repository: `netpersona/boxtrack:latest`
3. Add Port: Host `5001` → Container `5001`
4. Add Path: Host `/mnt/user/appdata/boxtrack` → Container `/data`
5. Click **Apply**

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5001` | Application port |
| `BOXTRACK_DATA_DIR` | `/data` | Database storage location |
| `TZ` | `UTC` | Timezone |

---

## Tech Stack

- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: SQLite with WAL mode
- **Build**: Vite, esbuild

---

## Screenshots

### Command Center
Overview dashboard with zone statistics and recent activity.

### Container View
Detailed inventory list with photos, quantities, and values.

### QR Labels
Print-ready labels with scannable codes for quick access.

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - Use it, modify it, self-host it.

See [LICENSE](LICENSE) for more information.

---

<div align="center">

**Built for people who want to find their stuff.**

Star us on GitHub — it helps!

</div>
