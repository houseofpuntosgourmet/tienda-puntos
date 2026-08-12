# Tienda Puntos Launcher - abre Obsidian + Claude Code (Opus) en el proyecto
# Uso: PowerShell -ExecutionPolicy Bypass -File launch-tienda-puntos.ps1

$ErrorActionPreference = 'Stop'
try {
    $projectPath = "C:\Users\Alejo Bales\tienda-puntos"
    $vaultPath   = "C:\Users\Alejo Bales\Documents\Tienda Puntos Vault"
    $obsidianExe = "C:\Users\Alejo Bales\AppData\Local\Programs\Obsidian\Obsidian.exe"

    Write-Host "Iniciando Tienda Puntos..." -ForegroundColor Cyan

    if ((Test-Path $obsidianExe) -and (Test-Path $vaultPath)) {
        Write-Host "Abriendo Obsidian (Tienda Puntos Vault)..." -ForegroundColor Yellow
        Start-Process $obsidianExe -ArgumentList "`"$vaultPath`""
    } else {
        Write-Host "Obsidian o el vault no se encontraron; se omite." -ForegroundColor DarkYellow
    }

    # --dangerously-skip-permissions: Claude no pide confirmacion para nada.
    # Elegido por Alejo el 11/08/2026. Para volver atras, borrar el flag.
    Write-Host "Abriendo Claude Code (Opus, sin confirmaciones)..." -ForegroundColor Yellow
    Start-Process "cmd.exe" -ArgumentList '/k', 'claude --model opus --dangerously-skip-permissions' -WorkingDirectory $projectPath

    Write-Host "Listo. Tienda Puntos abierta en su propia ventana." -ForegroundColor Green
    Start-Sleep -Seconds 2
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Presiona Enter para cerrar..." -ForegroundColor Gray
    Read-Host
}
