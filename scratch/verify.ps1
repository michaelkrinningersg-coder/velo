Add-Type -AssemblyName System.Drawing

# 1. Verify CSV content
$csvLine = Get-Content c:\velo-1\velo-1\data\csv\teams.csv | Select-String '21,'
Write-Output "CSV line: $csvLine"

# 2. Verify public image dimensions
$i1 = [System.Drawing.Image]::FromFile('c:\velo-1\velo-1\frontend\public\jersey\Jer_21.png')
Write-Output "Public mini jersey dimensions: $($i1.Width)x$($i1.Height)"
$i1.Dispose()

# 3. Verify dist image dimensions
$i2 = [System.Drawing.Image]::FromFile('c:\velo-1\velo-1\frontend\dist\jersey\Jer_21.png')
Write-Output "Dist mini jersey dimensions: $($i2.Width)x$($i2.Height)"
$i2.Dispose()
