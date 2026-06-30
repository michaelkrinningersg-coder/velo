Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('c:\velo-1\velo-1\frontend\public\jersey\Jer_1.png')
Write-Output "Jer_1.png dimensions: $($img.Width)x$($img.Height)"
$img.Dispose()

$img2 = [System.Drawing.Image]::FromFile('c:\velo-1\velo-1\data\Jersey\Jer_21.png')
Write-Output "New Jer_21.png dimensions: $($img2.Width)x$($img2.Height)"
$img2.Dispose()
