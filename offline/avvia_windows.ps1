param([int]$Port=8765)
# MATITA offline: Windows PowerShell 5.1; no installation or admin privileges.
# The server binds only to 127.0.0.1 and serves the extracted "sito" directory.
$ErrorActionPreference="Stop"
$crlf=[string][char]13 + [string][char]10
$root=[System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "sito"))
if (-not [System.IO.File]::Exists((Join-Path $root "index.html"))) {
  Write-Host "Estrai tutto lo ZIP prima di avviare MATITA." -ForegroundColor Red
  exit 1
}
$listener=New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback,$Port)
try { $listener.Start() } catch {
  Write-Host "Porta $Port gia' in uso. Chiudi l'altra finestra MATITA." -ForegroundColor Red
  exit 1
}
$siteUrl="http://127.0.0.1:$Port/"
Write-Host "MATITA - Leggere e scrivere (offline)" -ForegroundColor Cyan
Write-Host "Indirizzo: $siteUrl"
Write-Host "Lascia aperta questa finestra. Per fermare: Ctrl+C."
try { Start-Process $siteUrl } catch { Write-Host "Apri $siteUrl nel browser." }

function Send-Headers($stream,[int]$code,[string]$reason,[string]$type,[long]$length,[string]$extra) {
  $header = "HTTP/1.1 $code $reason" + $crlf +
    "Content-Type: $type" + $crlf +
    "Content-Length: $length" + $crlf +
    "Connection: close" + $crlf +
    "Cache-Control: no-cache" + $crlf +
    "X-Content-Type-Options: nosniff" + $crlf +
    $extra + $crlf
  $bytes=[System.Text.Encoding]::ASCII.GetBytes($header)
  $stream.Write($bytes,0,$bytes.Length)
}
try {
  while ($true) {
    $client=$null
    $reader=$null
    try {
      $client=$listener.AcceptTcpClient()
      $client.ReceiveTimeout=12000
      $client.SendTimeout=12000
      $stream=$client.GetStream()
      $reader=New-Object System.IO.StreamReader($stream,[System.Text.Encoding]::ASCII,$false,8192,$true)
      $first=$reader.ReadLine()
      if (-not $first) { continue }
      $parts=$first.Split(" ")
      if ($parts.Length -lt 2) { continue }
      $method=$parts[0].ToUpperInvariant()
      $rangeHeader=""
      while ($true) {
        $line=$reader.ReadLine()
        if ($null -eq $line -or $line.Length -eq 0) { break }
        if ($line.StartsWith("Range:",[System.StringComparison]::OrdinalIgnoreCase)) {
          $rangeHeader=$line.Substring(6).Trim()
        }
      }
      if ($method -ne "GET" -and $method -ne "HEAD") {
        Send-Headers $stream 405 "Method Not Allowed" "text/plain" 0 ""
        continue
      }
      $requestPath=$parts[1].Split("?")[0]
      $requestPath=[System.Uri]::UnescapeDataString($requestPath)
      if ($requestPath -eq "/") {$requestPath="/index.html"}
      $relative=$requestPath.TrimStart("/").Replace("/",[System.IO.Path]::DirectorySeparatorChar)
      $file=[System.IO.Path]::GetFullPath((Join-Path $root $relative))
      if (-not $file.StartsWith($root+[System.IO.Path]::DirectorySeparatorChar,[System.StringComparison]::OrdinalIgnoreCase)) {
        Send-Headers $stream 403 "Forbidden" "text/plain" 0 ""
        continue
      }
      if (-not [System.IO.File]::Exists($file)) {
        Send-Headers $stream 404 "Not Found" "text/plain" 0 ""
        continue
      }
      $type=switch ([System.IO.Path]::GetExtension($file).ToLowerInvariant()) {
        ".html" {"text/html; charset=utf-8"}
        ".css" {"text/css; charset=utf-8"}
        ".js" {"text/javascript; charset=utf-8"}
        ".mjs" {"text/javascript; charset=utf-8"}
        ".json" {"application/json; charset=utf-8"}
        ".webmanifest" {"application/manifest+json"}
        ".svg" {"image/svg+xml"}
        ".mp3" {"audio/mpeg"}
        ".png" {"image/png"}
        ".ico" {"image/x-icon"}
        default {"application/octet-stream"}
      }
      $f=[System.IO.File]::OpenRead($file)
      try {
        $start=[long]0
        $end=[long]($f.Length-1)
        $code=200
        $reason="OK"
        $extra="Accept-Ranges: bytes"+$crlf
        if ($rangeHeader -match '^bytes=(\d+)-(\d*)$') {
          $start=[long]::Parse($Matches[1])
          if ($Matches[2]) {$end=[long]::Parse($Matches[2])}
          if ($start -ge $f.Length -or $end -lt $start) {
            Send-Headers $stream 416 "Range Not Satisfiable" "text/plain" 0 ("Content-Range: bytes */"+$f.Length+$crlf)
            continue
          }
          if ($end -ge $f.Length) {$end=$f.Length-1}
          $code=206
          $reason="Partial Content"
          $extra += "Content-Range: bytes "+$start+"-"+$end+"/"+$f.Length+$crlf
        }
        $length=[long]($end-$start+1)
        Send-Headers $stream $code $reason $type $length $extra
        if ($method -eq "HEAD") {continue}
        $f.Position=$start
        $buffer=New-Object byte[] 65536
        $remaining=$length
        while ($remaining -gt 0) {
          $limit=[int][Math]::Min([long]$buffer.Length,$remaining)
          $read=$f.Read($buffer,0,$limit)
          if ($read -le 0) {break}
          $stream.Write($buffer,0,$read)
          $remaining -= $read
        }
      } finally {$f.Dispose()}
    } catch {
      Write-Host "Richiesta locale non completata: $($_.Exception.Message)"
    } finally {
      if ($reader) {$reader.Dispose()}
      if ($client) {$client.Close()}
    }
  }
} finally {$listener.Stop()}
