# LearnHub Firestore Backup & Disaster Recovery Strategy

## 1. Automated Scheduled Backups (Google Cloud Firestore)
- Schedule daily backups using gcloud firestore export:
  gcloud firestore export gs://learnhub-backups-bucket/firestore-daily-$(date +%Y%m%d) --project=learnhub-prod
- Keep a 30-day rolling lifecycle retention policy on the GCS bucket.

## 2. Point-in-Time Recovery (PITR)
- PITR is enabled on learnhub-prod with a 7-day continuous backup window for instant rollback of accidental data deletions.

## 3. Restore Procedure
- To restore a backup snapshot to staging for verification:
  gcloud firestore import gs://learnhub-backups-bucket/firestore-daily-20260831 --project=learnhub-dev
