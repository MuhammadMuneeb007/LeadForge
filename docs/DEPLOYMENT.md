# Deployment

Deploy as a standard Next.js Node application on Vercel or another Node 20.9+ host. Copy the variables from `.env.example`; no secret keys are required.

The included rate limiter is deliberately small and per-process. On a horizontally scaled public deployment, add a distributed limiter or WAF rule for `/api/search` and `/api/contacts`. Keep the existing application limits as defense in depth.

The query cache coalesces identical work within an instance. Serverless instances are ephemeral, so configure platform/CDN caching or a shared cache if sustained traffic warrants it. Do not remove the Overpass timeouts or result limits.

Public Overpass and OpenFreeMap services have fair-use policies. For a product with meaningful traffic, review those policies and operate or contract suitable compatible infrastructure.
