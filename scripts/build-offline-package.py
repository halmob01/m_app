#!/usr/bin/env python3
"""Create a self-contained offline MATITA ZIP from a complete Pages staging directory.

The ZIP contains the same Piper MP3 clips as the hosted site. This is an
artifact packager: it never fetches dependencies or generates voice samples.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import zipfile
from pathlib import Path

REQUIRED = (
    "index.html", "sw.js", "manifest.webmanifest", "icon.svg",
    "src/app.mjs", "src/engine.mjs", "src/curriculum.mjs",
    "src/pictograms.mjs", "src/neural-audio.mjs", "src/styles.css",
    "audio/generated/manifest.json", "assets/pictograms/LICENSE",
)

LAUNCHERS = (
    "AVVIA_WINDOWS.bat",
    "avvia_windows.ps1",
    "AVVIA_MAC_LINUX.command",
    "avvia_python.py",
    "LEGGIMI.txt",
)


def verify_site(site: Path, inventory_file: Path) -> tuple[int, int]:
    """Reject missing SVG, missing MP3 or incomplete voice inventories."""
    errors: list[str] = []
    for path in REQUIRED:
        if not (site / path).is_file():
            errors.append(f"File obbligatorio assente: {path}")

    if errors:
        raise ValueError("\n".join(errors))

    inventory = json.loads(inventory_file.read_text(encoding="utf-8"))
    manifest = json.loads((site / "audio/generated/manifest.json").read_text(encoding="utf-8"))
    clips = manifest.get("clips")
    if manifest.get("schema") != 1 or not isinstance(clips, dict):
        raise ValueError("Manifest audio non valido.")

    wanted = {entry["key"] for entry in inventory["entries"]}
    present = set(clips)
    if wanted != present:
        missing = sorted(wanted - present)
        extra = sorted(present - wanted)
        raise ValueError(f"Audio incompleto: {len(missing)} mancanti, {len(extra)} inattesi."
                         + (f" Esempio assente: {missing[:3]}" if missing else ""))

    for key, filename in clips.items():
        if not isinstance(filename, str) or not re.fullmatch(r"[0-9a-f]{20}\.mp3", filename):
            errors.append(f"Nome MP3 non valido per {key}")
            continue
        file = site / "audio/generated" / filename
        if not file.is_file() or file.stat().st_size <= 300:
            errors.append(f"MP3 mancante/vuoto: {filename}")

    sw = (site / "sw.js").read_text(encoding="utf-8")
    match = re.search(r"const SHELL\s*=\s*(\[[^\n]+])\s*;", sw)
    if match is None:
        errors.append("Impossibile verificare l'elenco delle risorse del service worker.")
    else:
        cached = json.loads(match.group(1))
        for uri in cached:
            # All entries are relative to localhost, not to an external host.
            if not uri.startswith("./") or "://" in uri or ".." in uri:
                errors.append(f"Percorso cache non relativo: {uri}")
                continue
            file = "index.html" if uri == "./" else uri[2:]
            if not (site / file).is_file():
                errors.append(f"Risorsa della cache assente: {file}")

    if errors:
        raise ValueError("\n".join(errors[:20]))

    count_svg = len(list((site / "assets/pictograms").glob("*.svg")))
    if count_svg < 33:
        raise ValueError(f"Catalogo pittogrammi incompleto: {count_svg} su almeno 33.")

    return len(clips), count_svg


def build(site: Path, inventory: Path, launchers: Path, destination: Path) -> None:
    if not site.is_dir() or not launchers.is_dir():
        raise ValueError("Cartella sito o avviatori inesistente.")
    audio_count, svg_count = verify_site(site, inventory)
    for filename in LAUNCHERS:
        if not (launchers / filename).is_file():
            raise ValueError("Avviatore mancante: " + filename)
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and destination.is_file():
        destination.unlink()

    files = sorted(f for f in site.rglob("*") if f.is_file() and f.resolve() != destination.resolve())
    if not files:
        raise ValueError("Nessun file del sito.")
    with zipfile.ZipFile(destination, "w", allowZip64=True) as archive:
        for filename in LAUNCHERS:
            path = launchers / filename
            info = zipfile.ZipInfo("MATITA_OFFLINE/" + filename)
            info.compress_type = zipfile.ZIP_DEFLATED
            # The .command launcher is executable after extraction on Unix.
            info.external_attr = ((0o755 if filename.endswith(".command") else 0o644) << 16)
            archive.writestr(info, path.read_bytes())
        for file in files:
            relative = file.relative_to(site).as_posix()
            if relative == "MATITA_OFFLINE.zip":
                continue
            kind = zipfile.ZIP_STORED if file.suffix.lower() == ".mp3" else zipfile.ZIP_DEFLATED
            archive.write(file, "MATITA_OFFLINE/sito/" + relative, compress_type=kind)

    with zipfile.ZipFile(destination) as archive:
        corrupt = archive.testzip()
        if corrupt:
            raise ValueError("File danneggiato nello ZIP: " + corrupt)
        names = set(archive.namelist())
        for filename in REQUIRED:
            if "MATITA_OFFLINE/sito/" + filename not in names:
                raise ValueError("File assente dallo ZIP: " + filename)
        for filename in LAUNCHERS:
            if "MATITA_OFFLINE/" + filename not in names:
                raise ValueError("Avviatore assente dallo ZIP: " + filename)
        packaged = json.loads(archive.read("MATITA_OFFLINE/sito/audio/generated/manifest.json"))
        if len(packaged["clips"]) != audio_count:
            raise ValueError("Audio incompleto dopo compressione ZIP.")

    size_mb = destination.stat().st_size / (1024 * 1024)
    print(f"MATITA offline: {audio_count} clip Piper, {svg_count} SVG, "
          f"{len(files)} file del sito, ZIP {size_mb:.1f} MiB -> {destination}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", type=Path, default=Path("_site"))
    parser.add_argument("--inventory", type=Path, default=Path("audio/inventory.json"))
    parser.add_argument("--launchers", type=Path, default=Path("offline"))
    parser.add_argument("--output", type=Path, default=Path("_site/MATITA_OFFLINE.zip"))
    args = parser.parse_args()
    try:
        build(args.site.resolve(), args.inventory, args.launchers, args.output.resolve())
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as error:
        print(f"ERRORE: pacchetto offline non creato: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
