#!/usr/bin/env python3
"""Build static compressed Piper audio for Traccia, without recording or student data.

Requirements: piper-tts==1.8.0, ffmpeg on PATH, model ONNX + JSON.
The generated audio may contain pronunciation imperfections. Review before classroom use.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import logging
import re
import subprocess
import tempfile
import wave
from pathlib import Path
from piper import PiperVoice

log=logging.getLogger("piper-audio")
logging.basicConfig(level=logging.INFO,format="%(levelname)s: %(message)s")

def speakable(text: str) -> str:
    # Uppercase words in the exercise database must not be interpreted as acronyms.
    value=re.sub(r"\s+"," ",text).strip()
    if value.isupper():
        value=value.casefold()
    return value

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--inventory",default="audio/inventory.json")
    p.add_argument("--model",required=True)
    p.add_argument("--config",required=True)
    p.add_argument("--out",default="audio/generated")
    args=p.parse_args()
    raw=json.loads(Path(args.inventory).read_text(encoding="utf-8"))
    assert raw["version"]==1
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
    voice=PiperVoice.load(args.model,config_path=args.config)
    result={}
    size=0
    entries=raw["entries"]
    log.info("Loaded %s, generating %d clips",args.model,len(entries))
    with tempfile.TemporaryDirectory() as scratch:
        wave_file=Path(scratch)/"temporary.wav"
        for index,entry in enumerate(entries,1):
            key=entry["key"]
            text=speakable(entry["text"])
            name=hashlib.sha256(key.encode("utf-8")).hexdigest()[:20]+".mp3"
            dst=out/name
            if not dst.exists():
                with wave.open(str(wave_file),"wb") as handle:
                    voice.synthesize_wav(text,handle)
                subprocess.run([
                    "ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y",
                    "-i",str(wave_file),"-ar","22050","-ac","1",
                    "-codec:a","libmp3lame","-b:a","40k",
                    str(dst)
                ],check=True)
            if not dst.exists() or dst.stat().st_size<300:
                raise RuntimeError("Empty/invalid MP3 for "+key)
            result[key]=name
            size+=dst.stat().st_size
            if index%50==0 or index==len(entries):
                log.info("Generated %d/%d; compressed size %.1f MB",
                         index,len(entries),size/1024/1024)
    index={
       "schema":1,
       "voice":"Piper it_IT-paola-medium",
       "source":"rhasspy/piper-voices",
       "generated":True,
       "clips":result
    }
    (out/"manifest.json").write_text(json.dumps(index,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    if len(result)!=len(entries):
        raise RuntimeError("Missing audio clips in generated manifest")
    log.info("Done: %d clips, %.1f MB",len(result),size/1024/1024)

if __name__=="__main__":
    main()
