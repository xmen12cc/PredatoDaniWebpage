# ArchGen Web: 2D to 3D Architectural Pipeline

An AI-powered web application that transforms 2D architectural sketches into 3D visualizations using the Gemini API.

## Features
- **2D to 3D Pipeline**: Seamlessly convert architectural floor plans or sketches into 3D conceptual models.
- **AI Integration**: Leverages Google Gemini for intelligent image processing and generation.
- **Real-time Processing**: Fast feedback loop for architectural design iterations.
- **Modern Web Interface**: Clean, responsive UI for architects and designers.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

### Local Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/arch-gen-web.git
    cd arch-gen-web
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure environment variables**:
    Create a `.env` file in the root directory:
    ```env
    PORT=3050
    GEMINI_API_KEY=your_api_key_here
    ```
4.  **Start the application**:
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:3000`.

## VPS Deployment (Ubuntu)

### Using PM2
For a multi-app VPS environment, we use PM2 for process management.

1.  **Install PM2**:
    ```bash
    sudo npm install -g pm2
    ```
2.  **Start the app**:
    ```bash
    pm2 start ecosystem.config.js
    ```
3.  **Save PM2 state**:
    ```bash
    pm2 save
    pm2 startup
    ```

### Cloudflare Tunnel Setup
To expose the app securely without opening ports:

1.  **Install Cloudflared**:
    Follow [Cloudflare's official guide](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-run/installation/) to install `cloudflared` on your VPS.
2.  **Authenticate**:
    ```bash
    cloudflared tunnel login
    ```
3.  **Create a Tunnel**:
    ```bash
    cloudflared tunnel create arch-gen-tunnel
    ```
4.  **Configure DNS**:
    Route your domain (e.g., `arch.yourdomain.com`) to the tunnel.
5.  **Run the Tunnel**:
    You can use the provided `start-tunnel.sh` script or configure it as a service.

## Project Structure
- `server.js`: Express server and Gemini API integration.
- `public/`: Frontend assets (HTML, CSS, JS).
- `ecosystem.config.js`: PM2 configuration for deployment.
- `logs/`: Application activity and error logs.
