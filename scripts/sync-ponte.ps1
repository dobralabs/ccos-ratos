# Sincroniza .agents\skills (ponte pro Codex) com .claude\skills (fonte), no Windows.
# Tenta junction (não precisa de Admin); se não der, cópia. Idempotente.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
New-Item -ItemType Directory -Force .agents | Out-Null
$bridge = ".agents\skills"

$item = Get-Item $bridge -ErrorAction SilentlyContinue
if ($item -and $item.LinkType) { Write-Output "ponte ok (junction)"; exit 0 }

if (-not $item) {
  try {
    New-Item -ItemType Junction -Path $bridge -Target ".claude\skills" | Out-Null
    Write-Output "ponte criada (junction)"; exit 0
  } catch { }
}

# Cópia (fallback)
if (Test-Path $bridge) { Remove-Item -Recurse -Force $bridge }
Copy-Item -Recurse ".claude\skills" $bridge
Write-Output "ponte sincronizada (copia)"
