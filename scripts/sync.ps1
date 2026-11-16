<#
.SYNOPSIS
  Copies or updates the kit (.claude/) in a project, without overwriting locally adapted files.

.EXAMPLE
  .\scripts\sync.ps1 -Target "D:\_FREELANCE\2026-11_agence_client" -DryRun
  .\scripts\sync.ps1 -Target "D:\_FREELANCE\2026-11_agence_client"
#>
param(
  [Parameter(Mandatory = $true)][string]$Target,
  [switch]$DryRun,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

$kitRoot  = Split-Path $PSScriptRoot -Parent
$source   = Join-Path $kitRoot '.claude'
$destRoot = Join-Path (Resolve-Path $Target).Path '.claude'
$syncFile = Join-Path $destRoot '.kit-sync.json'
$ignoreFile = Join-Path $destRoot '.kit-ignore'

if (-not (Test-Path $source)) { throw "No .claude folder found in the kit: $source" }

# Kit version (Git commit if available)
$kitVersion = $null
try { $kitVersion = (git -C $kitRoot rev-parse --short HEAD 2>$null) } catch {}
if (-not $kitVersion) { $kitVersion = 'no-git' }

# Paths ignored by the project
$ignored = @()
if (Test-Path $ignoreFile) {
  $ignored = Get-Content $ignoreFile |
    ForEach-Object { $_.Trim() -replace '\\', '/' } |
    Where-Object { $_ -and -not $_.StartsWith('#') } |
    ForEach-Object { $_.TrimEnd('/') }
}

# Hashes from the last sync
$lastHashes = @{}
if (Test-Path $syncFile) {
  $previous = Get-Content $syncFile -Raw | ConvertFrom-Json
  if ($previous.files) {
    foreach ($p in $previous.files.PSObject.Properties) { $lastHashes[$p.Name] = $p.Value }
  }
}

function Get-Hash([string]$path) { (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash }

function Test-Ignored([string]$rel) {
  foreach ($pattern in $ignored) {
    if ($rel -eq $pattern -or $rel.StartsWith("$pattern/")) { return $true }
  }
  return $false
}

$newHashes = @{}
$counts = @{ added = 0; updated = 0; unchanged = 0; skipped = 0; adapted = 0 }

Get-ChildItem -Path $source -Recurse -File | Sort-Object FullName | ForEach-Object {
  $rel = $_.FullName.Substring($source.Length).TrimStart('\', '/') -replace '\\', '/'
  $dest = Join-Path $destRoot $rel
  $srcHash = Get-Hash $_.FullName

  if (Test-Ignored $rel) {
    Write-Host "  skipped     $rel" -ForegroundColor DarkGray
    $counts.skipped++
    if ($lastHashes.ContainsKey($rel)) { $newHashes[$rel] = $lastHashes[$rel] }
    return
  }

  $action = $null
  if (-not (Test-Path $dest)) {
    $action = 'added'
  } else {
    $destHash = Get-Hash $dest
    if ($destHash -eq $srcHash) {
      $counts.unchanged++
      $newHashes[$rel] = $srcHash
      return
    }
    $modifiedLocally = (-not $lastHashes.ContainsKey($rel)) -or ($lastHashes[$rel] -ne $destHash)
    if ($modifiedLocally -and -not $Force) {
      Write-Host "  adapted     $rel (modified in the project, not replaced; use -Force to overwrite)" -ForegroundColor Yellow
      $counts.adapted++
      if ($lastHashes.ContainsKey($rel)) { $newHashes[$rel] = $lastHashes[$rel] }
      return
    }
    $action = 'updated'
  }

  $label = if ($action -eq 'added') { 'added     ' } else { 'updated   ' }
  Write-Host "  $label  $rel" -ForegroundColor Green
  $counts[$action]++
  $newHashes[$rel] = $srcHash

  if (-not $DryRun) {
    $dir = Split-Path $dest -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    Copy-Item -LiteralPath $_.FullName -Destination $dest -Force
  }
}

if (-not $DryRun) {
  if (-not (Test-Path $destRoot)) { New-Item -ItemType Directory -Path $destRoot -Force | Out-Null }
  [ordered]@{
    kit     = 'agentic-dev-kit'
    version = $kitVersion
    date    = (Get-Date).ToString('yyyy-MM-dd HH:mm')
    files   = $newHashes
  } | ConvertTo-Json -Depth 5 | Set-Content -Path $syncFile -Encoding UTF8
}

Write-Host ''
$mode = if ($DryRun) { ' (preview, nothing was changed)' } else { '' }
Write-Host ("Kit {0}: {1} added, {2} updated, {3} unchanged, {4} locally adapted, {5} skipped{6}" -f `
  $kitVersion, $counts.added, $counts.updated, $counts.unchanged, $counts.adapted, $counts.skipped, $mode)
