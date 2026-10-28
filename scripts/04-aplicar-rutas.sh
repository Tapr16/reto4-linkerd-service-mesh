#!/usr/bin/env bash
# Uso: scripts/04-aplicar-rutas.sh [header|canary|ninguna]
source "$(dirname "$0")/env.sh"
modo="${1:-header}"
case "$modo" in
  header|canary)
    kubectl apply -f "$RAIZ/linkerd/httproute-$modo.yaml"
    sleep 3
    kubectl -n "$NS" get httproute web-por-cabecera -o yaml | sed -n '/^status:/,$p'
    ;;
  ninguna)
    kubectl -n "$NS" delete httproute web-por-cabecera --ignore-not-found
    ;;
  *) echo "modo desconocido: $modo"; exit 1 ;;
esac
