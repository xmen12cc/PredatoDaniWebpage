#!/bin/bash

# start-tunnel.sh
# Robust script to start a Cloudflare Tunnel for multi-app VPS deployment.
# This script uses the 'trycloudflare.com' feature for zero-config deployment.

# --- Configuration ---
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

echo "Mapping to local port: $LOCAL_PORT"
echo "A random .trycloudflare.com URL will be generated."

# Run the tunnel using the zero-config 'trycloudflare' feature
cloudflared tunnel --url http://localhost:$LOCAL_PORT
