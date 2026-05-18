$symlinkPath = "D:\deployed-apps\json-tree-converter\current"

if (Test-Path $symlinkPath) {
    $target = (Get-Item $symlinkPath).Target

    if ($target -like "*blue*") {
        $rollback = "green"
    }
    else {
        $rollback = "blue"
    }

    Remove-Item $symlinkPath -Force

    New-Item -ItemType SymbolicLink `
      -Path $symlinkPath `
      -Target "D:\deployed-apps\json-tree-converter\$rollback"

    Write-Host "Rollback completed successfully to $rollback" -ForegroundColor Green
}
else {
    Write-Error "Current symbolic link not found"
}
