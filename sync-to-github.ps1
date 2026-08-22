$GitHubToken = ""
$RepoOwner = "jamil8655"
$RepoName = "learnhub"
$Branch = "main"

$tokenFile = Join-Path $PSScriptRoot ".github_token"
if (Test-Path $tokenFile) {
    $GitHubToken = (Get-Content $tokenFile -Raw).Trim()
}

if (-not $GitHubToken) {
    Write-Host "Token not found"
    exit 1
}

$headers = @{
    "Authorization" = "token $GitHubToken"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "LearnHub-Sync"
}

$files = Get-ChildItem -Path $PSScriptRoot -Recurse -File | Where-Object {
    $_.FullName -notmatch '\\\.git($|\\)' -and 
    $_.FullName -notmatch '\\\.system_generated' -and
    $_.Name -ne '.github_token' -and
    $_.Name -ne 'check-gh.ps1' -and
    $_.Name -ne 'fetch-workflows.ps1' -and
    $_.Name -ne 'fetch-run-details.ps1' -and
    $_.Name -ne 'fetch-job-logs.ps1' -and
    $_.Name -notmatch '^\.env(\..+)?$' -and
    $_.Extension -ne '.pem' -and
    $_.Extension -ne '.key' -and
    $_.Extension -ne '.log' -and
    $_.Extension -ne '.zip'
}

Write-Host "Syncing $($files.Count) files to GitHub..."

$success = 0
foreach ($f in $files) {
    $rel = $f.FullName.Substring($PSScriptRoot.Length + 1).Replace('\', '/')
    $url = "https://api.github.com/repos/$RepoOwner/$RepoName/contents/$rel"

    $sha = $null
    $getResp = $null
    try {
        $getResp = Invoke-RestMethod -Uri "$url`?ref=$Branch" -Headers $headers -Method Get -ErrorAction Stop
        if ($getResp -and $getResp.sha) {
            $sha = $getResp.sha
        }
    } catch {
        $sha = $null
    }

    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $b64 = [Convert]::ToBase64String($bytes)

    # Skip if content is already identical on GitHub
    if ($getResp -and $getResp.content) {
        $remoteB64 = $getResp.content.Replace("`n", "").Replace("`r", "").Trim()
        if ($remoteB64 -eq $b64.Trim()) {
            Write-Host "Unchanged: $rel"
            $success++
            continue
        }
    }

    $payload = @{
        message = "Auto-Sync: update $rel"
        content = $b64
        branch  = $Branch
    }
    if ($sha) {
        $payload["sha"] = $sha
    }

    $json = $payload | ConvertTo-Json -Compress

    $uploaded = $false
    for ($attempt = 1; $attempt -le 3; $attempt++) {
        try {
            $putResp = Invoke-RestMethod -Uri $url -Headers $headers -Method Put -Body $json -ContentType "application/json; charset=utf-8" -ErrorAction Stop
            Write-Host "Uploaded: $rel"
            $success++
            $uploaded = $true
            break
        } catch {
            Start-Sleep -Milliseconds 300
            try {
                $getResp = Invoke-RestMethod -Uri "$url`?ref=$Branch" -Headers $headers -Method Get -ErrorAction Stop
                if ($getResp -and $getResp.sha) {
                    $payload["sha"] = $getResp.sha
                    $json = $payload | ConvertTo-Json -Compress
                }
            } catch {}
        }
    }
    if (-not $uploaded) {
        Write-Host "Failed: $rel after retries"
    }
}

Write-Host "Finished! Successfully uploaded $success files to GitHub."
