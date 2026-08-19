Add-Type -AssemblyName System.Drawing

$iconsDir = Join-Path $PSScriptRoot "icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
}

function Generate-Icon {
    param(
        [int]$size,
        [string]$filename,
        [bool]$isMaskable = $false
    )

    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Background gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $cTop = [System.Drawing.ColorTranslator]::FromHtml("#064e3b")
    $cBottom = [System.Drawing.ColorTranslator]::FromHtml("#0b0f19")
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $cTop, $cBottom, [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
    $g.FillRectangle($bgBrush, $rect)
    $bgBrush.Dispose()

    # Inner circular decorative halo
    $padFraction = if ($isMaskable) { 0.16 } else { 0.08 }
    $padding = [float]($size * $padFraction)
    $innerSize = [float]($size - (2.0 * $padding))
    $innerRect = New-Object System.Drawing.RectangleF($padding, $padding, $innerSize, $innerSize)

    $haloColor1 = [System.Drawing.Color]::FromArgb(45, 5, 150, 105)
    $haloColor2 = [System.Drawing.Color]::FromArgb(15, 16, 185, 129)
    $haloBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($innerRect, $haloColor1, $haloColor2, 45.0)
    $g.FillEllipse($haloBrush, $innerRect)
    $haloBrush.Dispose()

    # Outer decorative ring
    $ringPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#10b981"), [float]($size * 0.015))
    $g.DrawEllipse($ringPen, $innerRect)
    $ringPen.Dispose()

    # Center coordinates
    $centerX = [float]($size / 2.0)
    $centerY = [float]($size / 2.0)
    $starRadius = [float]($innerSize * 0.42)

    # Gold geometric square rotated
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#fbbf24"), [float]($size * 0.014))
    $g.TranslateTransform($centerX, $centerY)
    
    $sqSize = [float]($starRadius * 1.25)
    $halfSq = [float]($sqSize / 2.0)
    $sqRect = New-Object System.Drawing.RectangleF(-$halfSq, -$halfSq, $sqSize, $sqSize)
    $g.DrawRectangle($goldPen, $sqRect.X, $sqRect.Y, $sqRect.Width, $sqRect.Height)
    $g.RotateTransform(45.0)
    $g.DrawRectangle($goldPen, $sqRect.X, $sqRect.Y, $sqRect.Width, $sqRect.Height)
    $g.ResetTransform()
    $goldPen.Dispose()

    # Brushes
    $capBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#ffffff"))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#34d399"))
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f59e0b"))

    # Cap diamond
    $topY = [float]($centerY - ($innerSize * 0.08))
    $p1 = New-Object System.Drawing.PointF($centerX, [float]($topY - ($innerSize * 0.16)))
    $p2 = New-Object System.Drawing.PointF([float]($centerX + ($innerSize * 0.30)), $topY)
    $p3 = New-Object System.Drawing.PointF($centerX, [float]($topY + ($innerSize * 0.16)))
    $p4 = New-Object System.Drawing.PointF([float]($centerX - ($innerSize * 0.30)), $topY)
    [System.Drawing.PointF[]]$ptsDiamond = @($p1, $p2, $p3, $p4)
    $g.FillPolygon($capBrush, $ptsDiamond)

    # Cap base arc/pie
    $capW = [float]($innerSize * 0.34)
    $capH = [float]($innerSize * 0.16)
    $capBaseRect = New-Object System.Drawing.RectangleF([float]($centerX - ($capW / 2.0)), $topY, $capW, $capH)
    $g.FillPie($accentBrush, $capBaseRect.X, $capBaseRect.Y, $capBaseRect.Width, $capBaseRect.Height, 0, 180)

    # Gold Tassel
    $tasselPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#f59e0b"), [float]($size * 0.018))
    $g.DrawLine($tasselPen, $centerX, $topY, [float]($centerX + ($innerSize * 0.32)), [float]($topY + ($innerSize * 0.18)))
    $dotSize = [float]($size * 0.045)
    $g.FillEllipse($goldBrush, [float]($centerX + ($innerSize * 0.30)), [float]($topY + ($innerSize * 0.16)), $dotSize, $dotSize)
    $tasselPen.Dispose()

    # Open Book / Quran Pages Below Cap
    $bookY = [float]($centerY + ($innerSize * 0.14))
    $bookWidth = [float]($innerSize * 0.26)
    $bookHeight = [float]($innerSize * 0.14)
    
    $bookPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#10b981"), [float]($size * 0.022))
    
    # Left page curve
    $g.DrawArc($bookPen, [float]($centerX - $bookWidth), $bookY, $bookWidth, $bookHeight, 180, 180)
    # Right page curve
    $g.DrawArc($bookPen, $centerX, $bookY, $bookWidth, $bookHeight, 180, 180)
    $bookPen.Dispose()

    $capBrush.Dispose()
    $accentBrush.Dispose()
    $goldBrush.Dispose()

    $g.Dispose()

    $outPath = Join-Path $iconsDir $filename
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated $outPath successfully."
}

Generate-Icon -size 192 -filename "icon-192.png" -isMaskable $false
Generate-Icon -size 512 -filename "icon-512.png" -isMaskable $false
Generate-Icon -size 192 -filename "icon-maskable-192.png" -isMaskable $true
Generate-Icon -size 512 -filename "icon-maskable-512.png" -isMaskable $true
