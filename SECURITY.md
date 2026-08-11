# Security policy

## Supported version

Security updates are applied to the latest release on `main`.

## Reporting a vulnerability

Please use GitHub's **Report a vulnerability** form in the repository Security tab. Do not disclose suspected vulnerabilities in a public issue.

Include the affected route or component, reproduction steps, impact, and any suggested mitigation. Reports will be acknowledged as soon as practical. Please allow time for investigation and a coordinated fix before public disclosure.

## Security model

LeadForge has no authentication system or central customer database. Saved leads and search history remain in the user's browser. Server routes validate bounded inputs, apply per-instance rate limits, restrict outbound contact discovery to public network destinations, and return restrictive browser security headers.
