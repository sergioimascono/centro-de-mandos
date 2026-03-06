$WshShell = New-Object -ComObject WScript.Shell
$StartupPath = [Environment]::GetFolderPath('Startup')
$ShortcutPath = Join-Path $StartupPath "Centro de Mando.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = Join-Path $PSScriptRoot "start-server-silent.vbs"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Centro de Mando - Servidor Kanban"
$Shortcut.Save()

Write-Host "Acceso directo creado en: $ShortcutPath"
Write-Host ""
Write-Host "El servidor se iniciara automaticamente con Windows."
Write-Host "Para desactivar, elimina el acceso directo de: $StartupPath"
