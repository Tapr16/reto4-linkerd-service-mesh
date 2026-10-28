#!/usr/bin/env bash
source "$(dirname "$0")/env.sh"
falta=0
for t in docker kubectl kind linkerd; do
  if command -v "$t" >/dev/null; then
    printf '%-8s OK  (%s)\n' "$t" "$(command -v "$t")"
  else
    printf '%-8s FALTA\n' "$t"; falta=1
  fi
done
docker info >/dev/null 2>&1 && echo "docker   motor corriendo" || { echo "docker   el motor NO está corriendo: abre Docker Desktop"; falta=1; }
exit $falta
