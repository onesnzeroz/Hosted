param(
  [string]$SiteName = "OnesandzerosEnterprise",
  [string]$AppPoolName = "OnesandzerosEnterprisePool",
  [string]$PhysicalPath = "C:\inetpub\wwwroot\OnesandzerosEnterprise",
  [int]$Port = 8080
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Deploying Onesandzeros Enterprise Solutions site..." -ForegroundColor Cyan

if (-not (Test-Path $PhysicalPath)) {
  New-Item -Path $PhysicalPath -ItemType Directory -Force | Out-Null
}

$sourceItems = @("index.html", "css", "js", "pages", "assets")
foreach ($item in $sourceItems) {
  $source = Join-Path $scriptRoot $item
  if (-not (Test-Path $source)) {
    throw "Required deployment item missing: $item"
  }

  $destination = Join-Path $PhysicalPath $item
  if (Test-Path $destination) {
    Remove-Item -Path $destination -Recurse -Force
  }

  Copy-Item -Path $source -Destination $destination -Recurse -Force
}

Import-Module WebAdministration

if (-not (Test-Path "IIS:\AppPools\$AppPoolName")) {
  New-WebAppPool -Name $AppPoolName | Out-Null
}
Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name managedRuntimeVersion -Value ""

if (-not (Test-Path "IIS:\Sites\$SiteName")) {
  New-Website -Name $SiteName -Port $Port -PhysicalPath $PhysicalPath -ApplicationPool $AppPoolName | Out-Null
} else {
  Set-ItemProperty "IIS:\Sites\$SiteName" -Name applicationPool -Value $AppPoolName
  Set-ItemProperty "IIS:\Sites\$SiteName" -Name physicalPath -Value $PhysicalPath

  $binding = Get-WebBinding -Name $SiteName -Protocol http -ErrorAction SilentlyContinue | Where-Object { $_.bindingInformation -match ":$Port:" }
  if (-not $binding) {
    Get-WebBinding -Name $SiteName -Protocol http -ErrorAction SilentlyContinue | Remove-WebBinding
    New-WebBinding -Name $SiteName -Protocol http -Port $Port -IPAddress "*" | Out-Null
  }
}

Start-Website -Name $SiteName
Write-Host "Deployment complete. Site: http://localhost:$Port" -ForegroundColor Green
