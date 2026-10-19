#!/bin/sh
cd "$(dirname "$0")" || exit 1
if [ ! -f sito/index.html ]; then
  echo "Estrai prima tutto lo ZIP."
  exit 1
fi
if command -v python3 >/dev/null 2>&1; then
  exec python3 ./avvia_python.py
fi
echo "Serve Python 3 per avviare MATITA su macOS/Linux."
exit 1
