#!/bin/sh
# Publishes the Klaxon Quiz films in batches of 5: waits until 5 new films are rendered (or the render queue is done), then copies, commits, pushes.
cd "$(dirname "$0")/.."
OUT="$HOME/Documents/marketing agent/motion-studio/out/qi"
QUEUE_LOG="$1"   # the render queue's output file; "done" when all films are listed
while true; do
  have=$(ls "$OUT"/ch*-v1.mp4 2>/dev/null | wc -l)
  live=$(grep -c "\.mp4'," qi/bank.js)
  fin=$(grep -c "\[exited" "$QUEUE_LOG" 2>/dev/null)
  new=$((have - live))
  if [ $new -ge 5 ] || { [ "$fin" -ge 1 ] && [ $new -gt 0 ]; }; then
    sleep 15
    python qi/publish_films.py
    git add qi index.html && git commit -q -m "Klaxon Quiz: $new more films

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git -c credential.helper= -c credential.helper='!gh auth git-credential' push -q origin main && echo "pushed $new films: $(git log --oneline -1)"
  fi
  [ "$fin" -ge 1 ] && [ $((have - $(grep -c "\.mp4'," qi/bank.js))) -le 0 ] && break
  sleep 30
done
echo "all films live: $(grep -c "\.mp4'," qi/bank.js)"
