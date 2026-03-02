# Sentinel's Journal

## 2024-05-22 - Missing Input Validation on Alert Endpoint
**Vulnerability:** The `POST /api/alert` endpoint accepted any JSON payload without validation. This could allow attackers to store arbitrary data in the in-memory `alerts` array, potentially leading to memory exhaustion (DoS) or polluting the alert data with unexpected fields.
**Learning:** Even internal or prototype endpoints need validation to define the data contract and protect the application state. Implicit trust in the frontend client is a common security pitfall.
**Prevention:** Implement strict input validation on all API endpoints. Use allow-lists (whitelisting) to only accept expected fields and types.
