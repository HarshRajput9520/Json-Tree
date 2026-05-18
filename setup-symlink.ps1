# Setup script for IIS Blue-Green Symlink configuration
# MUST BE RUN AS ADMINISTRATOR

# Check for Administrator privileges
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Error "CRITICAL: This script must be run as Administrator! Please right-click PowerShell, select 'Run as Administrator', and run this script again."
    Exit
}

$deployRoot = "D:\deployed-apps\json-tree-converter"
$blueFolder = "$deployRoot\blue"
$greenFolder = "$deployRoot\green"
$symlinkPath = "$deployRoot\current"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "    IIS Blue-Green Symlink Initializer       " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Create Directories if they don't exist
Write-Host "[1/4] Ensuring deployment directories exist..." -ForegroundColor Yellow
if (!(Test-Path $blueFolder)) {
    New-Item -ItemType Directory -Path $blueFolder -Force | Out-Null
    Write-Host "  Created: $blueFolder" -ForegroundColor Gray
}
if (!(Test-Path $greenFolder)) {
    New-Item -ItemType Directory -Path $greenFolder -Force | Out-Null
    Write-Host "  Created: $greenFolder" -ForegroundColor Gray
}

# 2. Write Test HTML files
Write-Host "[2/4] Creating test HTML pages for Blue and Green environments..." -ForegroundColor Yellow
$blueHtml = "<h1>BLUE ENVIRONMENT (V1)</h1>`n<p>Deployed successfully on slot: BLUE</p>"
$greenHtml = "<h1>GREEN ENVIRONMENT (V2)</h1>`n<p>Deployed successfully on slot: GREEN</p>"

$blueHtml | Out-File -FilePath "$blueFolder\index.html" -Encoding utf8
$greenHtml | Out-File -FilePath "$greenFolder\index.html" -Encoding utf8
Write-Host "  Created test files index.html in both blue/ and green/ slots." -ForegroundColor Gray

# 3. Create/Reset Symlink
Write-Host "[3/4] Creating/resetting symbolic link..." -ForegroundColor Yellow
if (Test-Path $symlinkPath) {
    # Check if current is a symbolic link or a normal directory
    $item = Get-Item $symlinkPath
    if ($item.Attributes -match "ReparsePoint") {
        Write-Host "  Existing symbolic link found. Removing it..." -ForegroundColor Gray
        Remove-Item $symlinkPath -Force
    } else {
        Write-Host "  WARNING: '$symlinkPath' exists as a real folder! Moving to backup to avoid deleting your files..." -ForegroundColor Magenta
        $backupPath = "$deployRoot\current_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        Rename-Item -Path $symlinkPath -NewName $backupPath -Force
        Write-Host "  Backed up to: $backupPath" -ForegroundColor Gray
    }
}

# Create the symlink
New-Item -ItemType SymbolicLink -Path $symlinkPath -Target $blueFolder | Out-Null
Write-Host "  Successfully created Symbolic Link:" -ForegroundColor Gray
Write-Host "  $symlinkPath ===> $blueFolder" -ForegroundColor Green

# 4. Verify Symlink
Write-Host "[4/4] Verifying the symbolic link status..." -ForegroundColor Yellow
$verification = Get-Item $symlinkPath
if ($verification.Attributes -match "ReparsePoint") {
    Write-Host "  Link Type: SymbolicLink" -ForegroundColor Gray
    Write-Host "  Link Target: $($verification.Target)" -ForegroundColor Gray
    Write-Host "`nSUCCESS: Symlink setup completed!" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Point your IIS site physical path to: $symlinkPath" -ForegroundColor White
    Write-Host "2. Browse to http://localhost:5003 and verify you see 'BLUE ENVIRONMENT'" -ForegroundColor White
    Write-Host "3. Run 'rollback.ps1' to test switching instantly to GREEN!" -ForegroundColor White
} else {
    Write-Error "Verification failed: '$symlinkPath' is not a symbolic link!"
}
