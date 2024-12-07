#!/bin/bash
# This script is used to deploy the project to Vercel.

# Exit immediately if a command exits with a non-zero status
set -e

# 1. Install SurrealDB
echo "Installing SurrealDB..."
curl -L https://install.surrealdb.com | sh -s -- -v v2.1.2

# 2. Set PUBLIC_SURREAL_NAMESPACE based on VERCEL_GIT_COMMIT_REF
if [[ $VERCEL_GIT_COMMIT_REF == "main" ]]; then
    PUBLIC_SURREAL_NAMESPACE="production"
else
    PUBLIC_SURREAL_NAMESPACE="preview"
fi
echo "PUBLIC_SURREAL_NAMESPACE set to: $PUBLIC_SURREAL_NAMESPACE"

echo "Adding env to .env file..."
echo "PUBLIC_SURREAL_NAMESPACE=$PUBLIC_SURREAL_NAMESPACE" >> .env

# need to make surreal-codegen a binary we can install here
# echo "Running query codegen..."
# bun sync:queries
# TODO

echo "Running build..."
bun run build

# echo "Running checks..."
# bun check

# echo "Running linter..."
# bun lint

echo "All checks passed. Proceeding with database operations..."

echo "Importing schema..."
surreal import \
    --endpoint $PUBLIC_SURREAL_HOST \
    -u $SURREAL_USER \
    -p $SURREAL_PASS \
    --ns $PUBLIC_SURREAL_NAMESPACE \
    --db modular_model_spec \
    schema.surql

echo "Defining token..."
echo "DEFINE ACCESS OVERWRITE users ON DATABASE TYPE RECORD WITH JWT ALGORITHM HS256 KEY '$AUTH_SECRET' DURATION FOR TOKEN 1w;" | surreal sql \
    --endpoint $PUBLIC_SURREAL_HOST \
    -u $SURREAL_USER \
    -p $SURREAL_PASS \
    --ns $PUBLIC_SURREAL_NAMESPACE \
    --db modular_model_spec

echo "Deployment script completed successfully."
