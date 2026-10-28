#!/usr/bin/env bash
source "$(dirname "$0")/env.sh"
if kind get clusters | grep -qx "$CLUSTER"; then
  echo "El clúster $CLUSTER ya existe"
else
  paso "Creando clúster kind '$CLUSTER'"
  kind create cluster --config "$RAIZ/kind-config.yaml"
fi
kubectl cluster-info --context "kind-$CLUSTER"
