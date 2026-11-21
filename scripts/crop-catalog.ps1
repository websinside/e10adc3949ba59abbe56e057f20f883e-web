# Extract independent images from the supplied posters, preserving their pixels.
Add-Type -AssemblyName System.Drawing
$assetDirectory = Join-Path $PSScriptRoot '..\originals\assets'
$crops = @(
    @{ Source='uniformes-nathy-chica.png'; Output='modelo-chica.png'; X=200; Y=250; Width=290; Height=585 },
    @{ Source='uniformes-nathy.png'; Output='modelo-chico.png'; X=200; Y=250; Width=290; Height=585 },
    @{ Source='buzo-san-ignacio.png'; Output='buzo-completo.png'; X=145; Y=340; Width=920; Height=630 },
    @{ Source='uniformes-nathy.png'; Output='polera-blanca.png'; X=705; Y=250; Width=305; Height=250 },
    @{ Source='uniformes-nathy.png'; Output='polera-deportiva.png'; X=696; Y=561; Width=320; Height=250 },
    @{ Source='uniformes-nathy.png'; Output='poleron-azul-marino.png'; X=396; Y=885; Width=300; Height=285 },
    @{ Source='uniformes-nathy.png'; Output='jockey-escolar.png'; X=744; Y=920; Width=305; Height=245 }
)
foreach ($crop in $crops) {
    $source = [System.Drawing.Bitmap]::new((Join-Path $assetDirectory $crop.Source))
    try {
        $rectangle = [System.Drawing.Rectangle]::new($crop.X, $crop.Y, $crop.Width, $crop.Height)
        $result = $source.Clone($rectangle, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        try { $result.Save((Join-Path $assetDirectory $crop.Output), [System.Drawing.Imaging.ImageFormat]::Png) }
        finally { $result.Dispose() }
    }
    finally { $source.Dispose() }
}
