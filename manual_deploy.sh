#!/bin/bash
echo "Starting Manual Deployment..."

# 1. Push to Git
echo "Step 1: Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Git push successful."
else
    echo "❌ Git push failed. Please check your internet connection or git credentials."
    exit 1
fi

# 2. Run Deployment Script
echo "Step 2: Deploying to VPS..."
./scripts/deploy_full_env.exp

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful! Website is live with Production keys."
else
    echo "❌ Deployment failed."
    exit 1
fi
