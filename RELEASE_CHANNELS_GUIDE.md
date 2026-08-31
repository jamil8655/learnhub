# LearnHub Multi-Channel Release Pipeline & Git Strategy

## 1. Git Branch Hierarchy
feature/my-feature
   ↓
develop (learnhub-dev)
   ↓
staging / preview
   ↓
main (Production: learnhubplatform.com)

## 2. Release Channels
1. Development Channel: Local builds and dev.learnhubplatform.com connected to learnhub-dev Firebase.
2. Staging / Internal Testing: Firebase App Distribution & Google Play Internal Testing for scholars/auditors.
3. Production Channel: learnhubplatform.com with 256-bit SSL, App Check, and production Firestore.
