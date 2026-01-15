#!/bin/bash

# Start the server in background
echo "Starting Next.js server..."
npm start > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to be ready..."
max_retries=30
count=0
while ! curl -s http://localhost:3000 > /dev/null; do
    sleep 1
    count=$((count+1))
    if [ $count -ge $max_retries ]; then
        echo "Server failed to start within 30 seconds."
        cat server.log
        kill $SERVER_PID
        exit 1
    fi
done

echo "Server is up! Checking routes..."

routes=(
    "/"
    "/about"
    "/contact"
    "/login"
    "/cart"
    "/wishlist"
    "/products"
    "/terms"
    "/privacy"
    "/return-policy"
    "/shipping"
    "/sales"
)

failed=0

for route in "${routes[@]}"; do
    url="http://localhost:3000$route"
    status=$(curl -o /dev/null -s -w "%{http_code}" "$url")
    if [ "$status" -eq 200 ]; then
        echo "✅ $route - 200 OK"
    else
        echo "❌ $route - $status"
        failed=1
    fi
done

# Cleanup
kill $SERVER_PID
echo "Server stopped."

if [ $failed -eq 1 ]; then
    echo "Some routes failed check."
    exit 1
else
    echo "All routes passed check."
    exit 0
fi
