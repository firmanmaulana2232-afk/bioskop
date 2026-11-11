Add-Type -AssemblyName System.Drawing

$srcPath = "D:\Tugas-Bioskop\2-Aplikasi\kode-web\assets\splash.jpg"
$outPath = "D:\Tugas-Bioskop\2-Aplikasi\kode-web\assets\splash_test.jpg"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$newBmp = New-Object System.Drawing.Bitmap 1920, 1080
$g = [System.Drawing.Graphics]::FromImage($newBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Background fill with the dark red from top center (R=34, G=4, B=5)
$bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(34, 4, 5))
$g.FillRectangle($bgBrush, 0, 0, 1920, 1080)

# In original: center of sign is at X = 1260.
# To center it at X = 960, we shift by -295 pixels.
$g.DrawImage($src, -295, 0, 1920, 1080)

# Now on the right side: mirror the curtain to create a balanced theater stage!
# Crop curtain from left (X=0 to 380)
$curtainRect = New-Object System.Drawing.Rectangle 0, 0, 380, 1080
$curtainBmp = $src.Clone($curtainRect, $src.PixelFormat)
$curtainBmp.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)

# Draw mirrored curtain on the right side (from X=1540 to 1920)
$g.DrawImage($curtainBmp, 1540, 0, 380, 1080)

# Draw spotlights at the top center if needed or soft blend
$curtainBmp.Dispose()
$bgBrush.Dispose()
$g.Dispose()
$src.Dispose()

$newBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$newBmp.Dispose()
Write-Host "SUCCESS: Saved centered splash image"
