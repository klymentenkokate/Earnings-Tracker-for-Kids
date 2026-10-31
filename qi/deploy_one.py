"""Put one pipeline question live: its bank.js entry (from the spec's BANK) + its newest film, then commit + push.
    python qi/deploy_one.py h1
Called by motion-studio/hf/qi/pipeline.sh after each render (31 Oct 2026). Safe to run again: a newer film version is re-deployed."""
import importlib.util
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
Q = Path.home() / "Documents" / "marketing agent" / "motion-studio" / "hf" / "qi" / "_gen" / "q"
qid = sys.argv[1]

spec = importlib.util.spec_from_file_location(f"q_{qid}", Q / f"{qid}.py")
m = importlib.util.module_from_spec(spec); sys.path.insert(0, str(Q.parent)); spec.loader.exec_module(m)
B = m.BANK

lock = ROOT / ".deploy.lock"   # two films can finish close together; one deploy at a time
while True:
    try: lock.mkdir(); break
    except FileExistsError:
        if time.time() - lock.stat().st_mtime > 600: lock.rmdir()
        time.sleep(3)
try:
    js = lambda s: "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"
    bank_p = ROOT / "qi" / "bank.js"
    bank = bank_p.read_text(encoding="utf-8")
    if f"id: '{qid}'" not in bank:
        S = qid[0].upper()
        entry = (f"  // Set {S} (pipeline, one question at a time)\n" if f"set: '{S}'" not in bank else "") + \
            f"  {{ id: '{qid}', set: '{S}', emoji: {js(B['emoji'])}, topic: {js(B['topic'])},\n" \
            f"    q: {js(B['q'])}, qes: {js(B['qes'])},\n" \
            f"    trap: {js(B['trap'])}, trapEs: {js(B['trapEs'])},\n" \
            f"    answer: {js(B['answer'])}, answerEs: {js(B['answerEs'])},\n" \
            f"    fact: {js(B['fact'])},\n" \
            f"    factEs: {js(B['factEs'])} }},\n"
        assert bank.count("\n];\nconst QI_FILMS") == 1
        bank = bank.replace("\n];\nconst QI_FILMS", "\n" + entry + "];\nconst QI_FILMS")
        bank_p.write_text(bank, encoding="utf-8")
    subprocess.run([sys.executable, str(ROOT / "qi" / "publish_films.py")], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
    git = lambda *a: subprocess.run(["git", *a], cwd=ROOT, check=True, capture_output=True, text=True)
    git("add", "qi/bank.js", "qi/films", "index.html")
    if subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=ROOT).returncode:
        git("commit", "-q", "-m", f"Klaxon Quiz: {qid} {B['topic']} (question + film)\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>")
        git("-c", "credential.helper=", "-c", "credential.helper=!gh auth git-credential", "push", "-q", "origin", "main")
    print(f"{time.strftime('%H:%M')} LIVE {qid} {B['topic']}", flush=True)
finally:
    lock.rmdir()
