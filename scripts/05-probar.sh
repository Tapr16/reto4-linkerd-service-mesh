#!/usr/bin/env bash
# Envía N peticiones por cada caso y cuenta qué versión respondió.
# Uso: scripts/05-probar.sh [N]
source "$(dirname "$0")/env.sh"
N="${1:-20}"
URL=http://localhost:8080/

contar() {
  local titulo="$1"; shift
  local v1=0 v2=0 otro=0
  for _ in $(seq 1 "$N"); do
    case "$(curl -s -o /dev/null -w '%header{x-app-version}' "$@" "$URL")" in
      v1) v1=$((v1 + 1)) ;;
      v2) v2=$((v2 + 1)) ;;
      *)  otro=$((otro + 1)) ;;
    esac
  done
  printf '%-45s v1=%-3s v2=%-3s error=%s\n' "$titulo" "$v1" "$v2" "$otro"
}

paso "Desde el PC (localhost:8080 -> gateway mallado -> web), $N peticiones por caso"
contar "Sin cabecera"
contar "X-Feature-Flag: new-version"      -H 'X-Feature-Flag: new-version'
contar "X-Feature-Flag: otro-valor"       -H 'X-Feature-Flag: otro-valor'
contar "User-Agent: experimental"         -A 'experimental'
contar "x-feature-flag (en minusculas)"   -H 'x-feature-flag: new-version'

paso "Desde el pod cliente mallado (dentro del clúster)"
kubectl -n "$NS" exec deploy/client -c curl -- curl -s http://web.reto4.svc.cluster.local/
kubectl -n "$NS" exec deploy/client -c curl -- curl -s -H 'X-Feature-Flag: new-version' http://web.reto4.svc.cluster.local/
