#!/usr/bin/env bash
source "$(dirname "$0")/env.sh"

paso "Construyendo imágenes v1 y v2"
for v in v1 v2; do
  docker build -t "reto4-app:$v" --build-arg "APP_VERSION=$v" "$RAIZ/app"
  kind load docker-image "reto4-app:$v" --name "$CLUSTER"
done

paso "Aplicando manifiestos"
kubectl apply -f "$RAIZ/k8s/00-namespace.yaml"
kubectl apply -f "$RAIZ/k8s/"
for d in web-v1 web-v2 client gateway; do
  kubectl -n "$NS" rollout status "deploy/$d" --timeout=180s
done

paso "Verificando que los pods tienen el sidecar de Linkerd"
kubectl -n "$NS" get pods -o custom-columns='POD:.metadata.name,APP:.spec.containers[*].name,SIDECAR(init):.spec.initContainers[*].name,ESTADO:.status.phase'
linkerd check --proxy -n "$NS"
