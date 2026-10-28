#!/usr/bin/env bash
# Métricas de Linkerd viz. Lanza tráfico con 05-probar.sh antes (o en paralelo).
source "$(dirname "$0")/env.sh"

paso "Tasa de éxito, RPS y latencias por deployment"
linkerd viz stat deploy -n "$NS"

paso "Conexiones entre workloads (columna SECURED = mTLS)"
linkerd viz edges deploy -n "$NS"

paso "Dashboard web (Ctrl+C para cerrar)"
linkerd viz dashboard
