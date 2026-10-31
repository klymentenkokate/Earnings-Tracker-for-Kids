"""Copy the newest rendered Klaxon Quiz films into qi/films and list them in QI_FILMS (bank.js); bumps bank.js?v in index.html.
    python qi/publish_films.py       (chNN -> id: ch01-08 = a1-a8, ch11-18 = b1-b8, ch21-28 = c1-c8, ch31-38 = d1-d8, ch41-48 = e1-e8)"""
import re, shutil
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
OUT = Path.home() / "Documents" / "marketing agent" / "motion-studio" / "out" / "qi"
bank = (ROOT / "qi" / "bank.js").read_text(encoding="utf-8")
films = {}
for n in [k for s in range(5) for k in range(s * 10 + 1, s * 10 + 9)]:
    vids = sorted(OUT.glob(f"ch{n:02d}-*-v*.mp4"), key=lambda p: int(re.search(r"-v(\d+)\.mp4$", p.name).group(1)))
    if not vids: continue
    qid = "abcde"[n // 10] + str(n % 10)
    topic = re.search(rf"id: '{qid}'.*?topic: '(.*?)',\s*$", bank, re.S | re.M).group(1).replace(chr(92), '').replace(chr(39), '')
    name = f"{qid}-{re.sub(r'[^a-z0-9]+', '-', topic.lower()).strip('-')}.mp4"
    dst = ROOT / "qi" / "films" / name
    if not dst.exists() or dst.stat().st_size != vids[-1].stat().st_size: shutil.copy(vids[-1], dst)
    films[qid] = name
block = "const QI_FILMS = {   // id -> film file in qi/films/, filled in as the films are rendered\n" + "".join(f"  {k}: '{v}',\n" for k, v in films.items()) + "};\n"
bank = re.sub(r"const QI_FILMS = \{.*?\};\n?", block, bank, flags=re.S)
(ROOT / "qi" / "bank.js").write_text(bank, encoding="utf-8")
idx = (ROOT / "index.html").read_text(encoding="utf-8")
idx = re.sub(r'qi/bank\.js\?v=(\d+)', lambda m: f"qi/bank.js?v={int(m.group(1)) + 1}", idx)
(ROOT / "index.html").write_text(idx, encoding="utf-8")
print(len(films), "films:", ", ".join(films))
