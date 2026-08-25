# LearnHub Production Disaster Recovery & Emergency Operations Manual

**Document Version:** 1.0.0 (August 2026)  
**Production Origin:** `https://learnhubplatform.com/`  
**GCP Project:** `studio-5305763939-bdcf7`  
**Repository:** `jamil8655/learnhub`  

---

## 1. Emergency Escalation Hierarchy

| Level | Severity | Incident Examples | Action Timeframe |
|---|---|---|---|
| **P0 (Critical Outage)** | Entire site inaccessible / DB corruption | Complete frontend 404, Firestore rules lockout | **< 15 minutes** |
| **P1 (High Impact)** | Key feature failure | Google Auth failure, course player broken | **< 1 hour** |
| **P2 (Moderate)** | Non-blocking issues | Icon rendering bug, search latency | **< 24 hours** |

---

## 2. GitHub Pages & Frontend Instant Rollback

If a newly deployed commit introduces an unexpected frontend error:

### Option A: Local Rollback & Fast-Forward Sync
```powershell
cd C:\Users\jrahm\.gemini\antigravity\scratch\learnhub

# 1. Check recent commit history
git log -n 5 --oneline

# 2. Revert to previous stable commit
git revert HEAD --no-edit

# 3. Deploy immediately
powershell -ExecutionPolicy Bypass -File .\sync-to-github.ps1
```

---

## 3. Firestore Database Backup & Restore Procedures

### Automated On-Demand Firestore Export (via GCP CLI)
```bash
# Export all production Firestore collections to Cloud Storage bucket
gcloud firestore export gs://studio-5305763939-bdcf7-backups/$(date +%Y-%m-%d) \
    --project=studio-5305763939-bdcf7
```

### Firestore Restore Procedure
```bash
# Import collection data from a known good backup timestamp
gcloud firestore import gs://studio-5305763939-bdcf7-backups/YYYY-MM-DD \
    --project=studio-5305763939-bdcf7
```

---

## 4. DNS & Domain Recovery (Hostinger)

If DNS records are accidentally modified or deleted:

| Record Type | Host | Target / IP | Notes |
|---|---|---|---|
| **A Record** | `@` | `185.199.108.153` | GitHub Pages IP 1 |
| **A Record** | `@` | `185.199.109.153` | GitHub Pages IP 2 |
| **A Record** | `@` | `185.199.110.153` | GitHub Pages IP 3 |
| **A Record** | `@` | `185.199.111.153` | GitHub Pages IP 4 |
| **CNAME** | `www` | `jamil8655.github.io` | Subdomain redirect |

---

## 5. Security & Compromise Protocol

If an administrator account or API key is suspected of being compromised:

1. **Firebase Console Session Revocation**:
   - Navigate to [Firebase Console Auth](https://console.firebase.google.com/project/studio-5305763939-bdcf7/authentication/users).
   - Reset the affected administrator's password immediately.
2. **Rotate Firebase API Keys / OAuth**:
   - In Google Cloud Console Credentials, restrict API key referrers strictly to `https://learnhubplatform.com/*` and `https://*.firebaseapp.com/*`.
3. **Audit Log Inspection**:
   - Inspect the `securityEvents` and `auditLogs` Firestore collections for unauthorized modifications.
