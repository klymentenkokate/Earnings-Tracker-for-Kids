#!/bin/sh
# push_loop.sh : pushes the Klaxon Quiz pipeline's commits to GitHub Pages without starving its builds (31 Oct 2026).
# A Pages build takes ~5.5 min and a new push cancels the running one (and ~10 builds/hour is the limit), so:
# push only when there are unpushed commits, no build is running, and the last push was 7+ min ago. Runs until killed.
cd "$(dirname "$0")/.."
REPO=klymentenkokate/Earnings-Tracker-for-Kids
last=0
while true; do
  ahead=$(git rev-list --count origin/main..main 2>/dev/null)
  now=$(date +%s)
  if [ "${ahead:-0}" -gt 0 ] && [ $((now - last)) -ge 420 ]; then
    st=$(gh api "repos/$REPO/pages/builds/latest" --jq .status 2>/dev/null)
    if [ "$st" != "building" ] && [ "$st" != "queued" ]; then
      n=$(git log --oneline origin/main..main | grep -c "Klaxon Quiz:")
      if git -c credential.helper= -c credential.helper='!gh auth git-credential' push -q origin main; then
        last=$now; echo "$(date +%H:%M) PUSHED $n commits ($(git log -1 --format=%h)) - live in ~6 min"
      else
        echo "$(date +%H:%M) PUSH FAILED"
      fi
    fi
  fi
  st=$(gh api "repos/$REPO/pages/builds/latest" --jq '.status + " " + .commit[0:7]' 2>/dev/null)
  case "$st" in built*) [ "$st" != "$seen" ] && echo "$(date +%H:%M) SITE BUILT ${st#built }" && seen="$st";; errored*) [ "$st" != "$seen" ] && echo "$(date +%H:%M) SITE BUILD ERRORED ${st#errored }" && seen="$st";; esac
  sleep 60
done
