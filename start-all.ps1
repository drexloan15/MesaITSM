$root = "C:\Users\Jean Puccio\Desktop\MesaITSM"

$services = @(
  @{ name = "auth-service";      dir = "$root\services\auth-service";      port = 3001 },
  @{ name = "incidents-service"; dir = "$root\services\incidents-service";  port = 3002 },
  @{ name = "problems-service";  dir = "$root\services\problems-service";   port = 3003 },
  @{ name = "changes-service";   dir = "$root\services\changes-service";    port = 3004 },
  @{ name = "frontend";          dir = "$root\frontend";                    port = 3000 }
)

foreach ($svc in $services) {
  Write-Host "Starting $($svc.name) on port $($svc.port)..." -ForegroundColor Cyan
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = "cmd.exe"
  $psi.Arguments = "/c cd /d `"$($svc.dir)`" && npm run dev"
  $psi.UseShellExecute = $true
  $psi.CreateNoWindow = $false
  [System.Diagnostics.Process]::Start($psi) | Out-Null
  Start-Sleep -Seconds 2
}

Write-Host "All services starting. Check individual windows for status." -ForegroundColor Green
