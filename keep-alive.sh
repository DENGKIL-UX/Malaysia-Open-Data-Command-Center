#!/bin/bash
cd /home/z/my-project
while true; do
  # Check if server is already running
  if ! curl -s -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
    npx next dev -p 3000 >> dev.log 2>&1 &
    NEXT_PID=$!
    echo "[$(date)] Started Next.js PID=$NEXT_PID" >> dev.log
    # Wait for it to be ready
    for i in $(seq 1 30); do
      if curl -s -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
        break
      fi
      sleep 1
    done
  fi
  sleep 5
done
