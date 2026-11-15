$ErrorActionPreference = "Stop"
$base = "http://127.0.0.1:5000"
Write-Host "1/4 API health"
Invoke-RestMethod "$base/health" | ConvertTo-Json -Compress
Write-Host "2/4 Database health"
$db = Invoke-RestMethod "$base/health/db"
if ($db.database -ne "connected") { throw "Database is not connected" }
Write-Host "3/4 Admin portal expected at http://localhost:3000"
try { (Invoke-WebRequest "http://localhost:3000" -UseBasicParsing).StatusCode } catch { throw "Admin portal is not running on port 3000" }
Write-Host "4/4 Agent portal expected at http://localhost:3200"
try { (Invoke-WebRequest "http://localhost:3200" -UseBasicParsing).StatusCode } catch { throw "Agent portal is not running on port 3200" }
Write-Host "STAGE 3.4 BASIC SMOKE TEST: PASS" -ForegroundColor Green
