$file = 'frontend/src/app.ts'
$text = [IO.File]::ReadAllText($file, [Text.Encoding]::UTF8)

$replacements = @{
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCh8KCLsKk")) = "ä"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCh8KCLsK2")) = "ö"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCh8KCLsK8")) = "ü"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCh8KCLsK+")) = "Ä"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCh8KCLsKO")) = "Ö"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCh8KCLsKc")) = "Ü"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCh8KCLsK4")) = "ß"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCosKiwrLCrMKiwqwKk")) = "–"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCosKiwrLCrMKiwqwK")) = "-"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCo8KiwqwKtw")) = "·"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCosKiwqwKtwKiwqwK")) = "▬"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCosKiwqwKuwKiwqwKMg")) = "▲"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCosKiwqwKuwKiwqwKPA")) = "▼"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCosKiwqwKw6DCosKqwqwK")) = "↑"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCosKiwqwKw6DCosKqwqwL")) = "↓"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("w4PCh8KiwqwKw4Q")) = "×"
}

$matchCount = 0
foreach ($bad in $replacements.Keys) {
    $good = $replacements[$bad]
    $count = ([regex]::Matches($text, [regex]::Escape($bad))).Count
    if ($count -gt 0) {
        $matchCount += $count
        $text = $text.Replace($bad, $good)
        Write-Output "Replaced $count of $good"
    }
}

[IO.File]::WriteAllText($file, $text, [Text.Encoding]::UTF8)
Write-Output "Total: $matchCount"