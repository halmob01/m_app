#!/usr/bin/env python3
"""Local-only MATITA server, no network access required."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import mimetypes
import os
import webbrowser

ROOT=Path(__file__).resolve().parent/"sito"
mimetypes.add_type("text/javascript", ".mjs")
mimetypes.add_type("audio/mpeg", ".mp3")
mimetypes.add_type("application/manifest+json", ".webmanifest")
if __name__ == "__main__":
    if not (ROOT/"index.html").exists():
        raise SystemExit("Estrai prima tutti i file ZIP.")
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self,*a,**k):
            super().__init__(*a,directory=str(ROOT),**k)
        def end_headers(self):
            self.send_header("Cache-Control","no-cache")
            super().end_headers()
    server=ThreadingHTTPServer(("127.0.0.1",0),Handler)
    url=f"http://127.0.0.1:{server.server_port}/"
    print(f"MATITA offline: {url} - Ctrl+C per fermare")
    webbrowser.open(url)
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()
