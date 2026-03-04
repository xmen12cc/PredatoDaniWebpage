#!/bin/bash

# start-tunnel.sh
# Robust script to start a Cloudflare Tunnel for multi-app VPS deployment.
# This script assumes you have already created a named tunnel and configured it.

# --- Configuration ---
TUNNEL_NAME="arch-gen-tunnel" # Change this to your tunnel name
LOCAL_PORT=3050
# ---------------------

echo "Starting Cloudflare Tunnel for arch-gen-web..."

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null
then
    echo "Error: 'cloudflared' could not be found. Please install it first."
    echo "Visit: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-run/installation/"
    exit 1
fi

# Note for multi-app environments:
# It is highly recommended to use a configuration file (usually ~/.cloudflared/config.yml)
# to map multiple hostnames to different local ports.
# Example:
# tunnel: <tunnel-id>
# credentials-file: /path/to/credentials.json
# ingress:
#   - hostname: arch.yourdomain.com
#     service: http://localhost:3000
#   - hostname: app2.yourdomain.com
#     service: http://localhost:4000
#   - service: http_status:404

echo "Running tunnel: $TUNNEL_NAME"
echo "Mapping to local port: $LOCAL_PORT"

# Option 1: Run with a named tunnel (Recommended for production)
# Make sure you have configured your tunnel via `cloudflared tunnel route dns`
cloudflared tunnel run "$TUNNEL_NAME"

# Option 2: Quick tunnel (Uncomment for testing ONLY)
# cloudflared tunnel --url http://localhost:$LOCAL_PORT
