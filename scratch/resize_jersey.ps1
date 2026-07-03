Add-Type -AssemblyName System.Drawing
$sourcePath = 'c:\velo-1\velo-1\data\Jersey\Jer_21.png'
$destPathPublic = 'c:\velo-1\velo-1\frontend\public\jersey\Jer_21.png'
$destPathDist = 'c:\velo-1\velo-1\frontend\dist\jersey\Jer_21.png'

Write-Output "Loading source image from $sourcePath"
$source = [System.Drawing.Image]::FromFile($sourcePath)

Write-Output "Resizing to 128x128..."
$target = New-Object System.Drawing.Bitmap(128, 128)
$graph = [System.Drawing.Graphics]::FromImage($target)
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$graph.DrawImage($source, 0, 0, 128, 128)

Write-Output "Saving to $destPathPublic"
$target.Save($destPathPublic, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Output "Saving to $destPathDist"
$target.Save($destPathDist, [System.Drawing.Imaging.ImageFormat]::Png)

$graph.Dispose()
$target.Dispose()
$source.Dispose()
Write-Output "Resize completed successfully!"
