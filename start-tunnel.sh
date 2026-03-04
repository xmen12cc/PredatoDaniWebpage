#!/bin/bash

# start-tunnel.sh
# Robust script to start a Cloudflare Tunnel for multi-app VPS deployment.
# This script uses the 'trycloudflare.com' feature for zero-config deployment.

# --- Configuration ---
LOCAL_PORT=3050
LOG_FILE="tunnel.log"
ACTIVITY_LOG="logs/activity.log"
# ---------------------

# Ensure logs directory exists
mkdir -p logs

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

# Run the tunnel in the background and redirect output to tunnel.log
nohup cloudflared tunnel --url http://localhost:$LOCAL_PORT > $LOG_FILE 2>&1 &

echo "Waiting for tunnel URL..."
# Wait for the URL to appear in the log file (max 30 seconds)
MAX_WAIT=30
COUNTER=0
TUNNEL_URL=""

while [ $COUNTER -lt $MAX_WAIT ]; do
    TUNNEL_URL=$(grep -o 'https://[a-zA-Z0-9-]\+\.trycloudflare\.com' $LOG_FILE | head -n 1)
    if [ ! -z "$TUNNEL_URL" ]; then
        break
    fi
    sleep 1
    COUNTER=$((COUNTER+1))
done

if [ ! -z "$TUNNEL_URL" ]; then
    echo "--------------------------------------------------"
    echo "Tunnel is live at: $TUNNEL_URL"
    echo "--------------------------------------------------"
    
    # Log to activity.log
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "[$TIMESTAMP] Cloudflare Tunnel started: $TUNNEL_URL" >> $ACTIVITY_LOG
else
    echo "Error: Could not retrieve tunnel URL. Check $LOG_FILE for details."
fi
