#!/usr/bin/env bash
source "$(dirname "$0")/env.sh"

paso "CRDs de Gateway API ($GATEWAY_API_VERSION) — Linkerd las usa para HTTPRoute"
if ! kubectl get crd httproutes.gateway.networking.k8s.io >/dev/null 2>&1; then
  kubectl apply -f "https://github.com/kubernetes-sigs/gateway-api/releases/download/$GATEWAY_API_VERSION/standard-install.yaml"
fi

paso "Pre-chequeo"
linkerd check --pre

paso "Instalando CRDs y control plane de Linkerd"
linkerd install --crds | kubectl apply -f -
linkerd install | kubectl apply -f -
linkerd check

paso "Instalando extensión viz (dashboard y métricas)"
linkerd viz install | kubectl apply -f -
linkerd viz check
