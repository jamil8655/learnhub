const fs = require('fs');
const https = require('https');

const token = fs.readFileSync('.github_token', 'utf8').trim();

function tryEnforceHttps() {
  const payload = JSON.stringify({
    cname: 'learnhubplatform.com',
    https_enforced: true
  });

  const req = https.request({
    hostname: 'api.github.com',
    path: '/repos/jamil8655/learnhub/pages',
    method: 'PUT',
    headers: {
      'Authorization': 'token ' + token,
      'User-Agent': 'LearnHub-Sync',
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 204 || (res.statusCode >= 200 && res.statusCode < 300)) {
        console.log('🎉 SUCCESS! HTTPS Enforced automatically on learnhubplatform.com!');
        process.exit(0);
      } else {
        console.log(`[Status ${res.statusCode}] Certificate provisioning in progress... retrying in 30s.`);
      }
    });
  });

  req.on('error', (err) => {
    console.log('Request error:', err.message);
  });

  req.write(payload);
  req.end();
}

console.log('Auto-Enforce HTTPS daemon started for learnhubplatform.com...');
tryEnforceHttps();
const interval = setInterval(tryEnforceHttps, 30000);
