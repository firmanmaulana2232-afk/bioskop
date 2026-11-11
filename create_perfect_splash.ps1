Add-Type -AssemblyName System.Drawing

$srcPath = "D:\Tugas-Bioskop\2-Aplikasi\kode-web\assets\splash.jpg"
$outPath = "D:\Tugas-Bioskop\2-Aplikasi\kode-web\assets\splash_new.jpg"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$newBmp = New-Object System.Drawing.Bitmap 1920, 1080
$g = [System.Drawing.Graphics]::FromImage($newBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# 1. Fill base with the rich background color
$bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(34, 4, 5))
$g.FillRectangle($bgBrush, 0, 0, 1920, 1080)
$bgBrush.Dispose()

# 2. Draw the original splash image shifted left by 245 pixels
# Original CINEMA center: X = 1260 - 245 = 1015 (very close to dead center 960)
# Original MOVIE center: X = 1205 - 245 = 960 (EXACT DEAD CENTER OF SCREEN!)
$g.DrawImage($src, -245, 0, 1920, 1080)

# 3. Mirror the left curtain (X=0 to 300) to the right side (X=1620 to 1920)
$curtainRect = New-Object System.Drawing.Rectangle 0, 0, 300, 1080
$curtainBmp = $src.Clone($curtainRect, $src.PixelFormat)
$curtainBmp.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)

# Draw mirrored curtain on right
$g.DrawImage($curtainBmp, 1620, 0, 300, 1080)

$curtainBmp.Dispose()
$g.Dispose()
$src.Dispose()

$newBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$newBmp.Dispose()
Write-Host "SUCCESS: Generated balanced splash_new.jpg"
