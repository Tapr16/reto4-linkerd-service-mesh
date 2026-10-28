# Guía completa — Reto 4 (Linkerd)

**Integrantes**

| Código  | Nombre                              |
|---------|-------------------------------------|
| 2221909 | David Esteban Suarez Lozano         |
| 2221906 | Thomas Alejandro Perez Rojas        |
| 2221922 | Jesus David Santodomingo Carrascal  |

**Informe con capturas:** [informe/Informe_Reto4_Linkerd.pdf](informe/Informe_Reto4_Linkerd.pdf)

## Objetivo

Usar **Linkerd** para dirigir el tráfico a una versión distinta de la aplicación según una cabecera HTTP, sin tocar el código:

| Petición                                   | Versión que responde |
|--------------------------------------------|----------------------|
| `X-Feature-Flag: new-version`              | **v2** (nueva)       |
| `User-Agent: experimental`                 | **v2** (nueva)       |
| Sin cabecera, o con cualquier otro valor   | **v1** (estable)     |

## Arquitectura

```
 PC (curl / Postman)
        │  http://localhost:8080
        ▼
 kind NodePort 30080
        ▼
 ┌─────────────── namespace reto4 (linkerd.io/inject: enabled) ───────────────┐
 │  gateway (nginx + linkerd-proxy) ──► Service "web" ── HTTPRoute ──┐        │
 │                                                                   │        │
 │      header coincide ─────────────► Service web-v2 ─► pods web-v2 (1)     │
 │      resto ───────────────────────► Service web-v1 ─► pods web-v1 (2)     │
 │                                                                            │
 │  client (curl + linkerd-proxy)  → para probar desde dentro del clúster     │
 └────────────────────────────────────────────────────────────────────────────┘
```

**Detalle importante de Linkerd:** las reglas de ruteo se aplican en el proxy **del cliente** (el que envía la petición). Una petición que llega directo desde fuera de la malla no pasa por ningún proxy saliente y no se enruta. Por eso hay un `gateway` nginx **dentro** de la malla. El PC le habla a él y él reenvía a `web` a través de su `linkerd-proxy`.

### ¿Por qué `HTTPRoute` y no `TrafficSplit` + `ServiceProfile`?

El enunciado menciona `TrafficSplit` (SMI) y `ServiceProfile`. En las versiones actuales de Linkerd, SMI/`TrafficSplit` está deprecado. La forma oficial de hacer ruteo por cabeceras es el recurso `HTTPRoute` de **Gateway API** (iniciativa GAMMA), con un `Service` como `parentRef`. El concepto es el mismo: dividir el tráfico entre backends. `HTTPRoute` además permite reglas `matches` por cabecera, ruta, método o query, cosa que `TrafficSplit` no tenía.

## Estructura

```
app/        server.js + Dockerfile (misma imagen, build-arg APP_VERSION=v1|v2)
kind-config.yaml  clúster kind (puerto 8080 del PC -> NodePort 30080)
k8s/        namespace, deployments v1/v2, services, client, gateway
linkerd/    httproute-header.yaml (reto) · httproute-canary.yaml (opcional 90/10)
scripts/    00..06 instalación, despliegue, pruebas y observabilidad · 99 limpiar
docs/       informe (PDF/HTML), capturas, evidencias en texto, colección Postman
tools/      capturar.js: genera las capturas PNG con Chrome headless
```

## Requisitos (Windows)

| Herramienta    | Cómo obtenerla                                                                                                    |
|----------------|-------------------------------------------------------------------------------------------------------------------|
| Docker Desktop | Ya instalado. Debe estar **abierto** (motor corriendo).                                                           |
| kubectl        | Viene con Docker Desktop (`C:\Program Files\Docker\Docker\resources\bin`).                                        |
| kind           | `winget install Kubernetes.kind`                                                                                  |
| linkerd CLI    | Probado con edge-26.10.1. Descargar `linkerd2-cli-edge-XX.X.X-windows.exe` de https://github.com/linkerd/linkerd2/releases, renombrarlo a `linkerd.exe` y ponerlo en `bin/` de este proyecto (los scripts lo agregan al PATH). |

Los scripts son bash: se ejecutan desde **Git Bash** en la raíz del proyecto.

## Paso a paso

```bash
scripts/00-verificar-herramientas.sh   # comprueba docker, kubectl, kind, linkerd
scripts/01-crear-cluster.sh            # clúster kind "reto4"
scripts/02-instalar-linkerd.sh         # Gateway API CRDs + Linkerd + viz
scripts/03-desplegar-app.sh            # build v1/v2, kind load, apply k8s/
scripts/05-probar.sh                   # ANTES de la ruta: todo va a v1
scripts/04-aplicar-rutas.sh header     # aplica el HTTPRoute por cabecera
scripts/05-probar.sh                   # DESPUÉS: la cabecera manda a v2
scripts/06-observabilidad.sh           # stat, edges (mTLS) y dashboard
scripts/99-limpiar.sh                  # borra el clúster
```

Resultado esperado de `05-probar.sh` con la ruta aplicada:

```
Sin cabecera                                  v1=20  v2=0   error=0
X-Feature-Flag: new-version                   v1=0   v2=20  error=0
X-Feature-Flag: otro-valor                    v1=20  v2=0   error=0
User-Agent: experimental                      v1=0   v2=20  error=0
x-feature-flag (en minusculas)                v1=0   v2=20  error=0
```

Pruebas manuales:

```bash
curl -i http://localhost:8080/
curl -i -H "X-Feature-Flag: new-version" http://localhost:8080/
curl -i -A experimental http://localhost:8080/
```

En Postman: importar `docs/reto4.postman_collection.json` (desde la raíz del repo).

**Opcional (canary por pesos):** `scripts/04-aplicar-rutas.sh canary` mantiene la regla por cabecera, pero el tráfico sin cabecera se reparte 90 % v1 / 10 % v2.

## Observabilidad

- `linkerd viz stat deploy -n reto4`: tasa de éxito, RPS y latencias p50/p95/p99 de `web-v1` y `web-v2`. Se ve cómo se mueve el tráfico al aplicar la ruta.
- `linkerd viz edges deploy -n reto4`: quién habla con quién. La columna `SECURED` confirma **mTLS automático**.
- `linkerd viz tap deploy/web-v2 -n reto4`: peticiones en vivo que llegan a v2.
- `linkerd viz dashboard`: interfaz web con todo lo anterior.

## Service Mesh vs Ingress vs balanceador tradicional

| Aspecto                         | Balanceador L4           | Ingress (L7 en el borde)          | Service Mesh (Linkerd)                               |
|---------------------------------|--------------------------|-----------------------------------|------------------------------------------------------|
| Dónde decide                    | Solo en la entrada       | Solo en la entrada (norte-sur)    | En **cada** llamada, también entre servicios (este-oeste) |
| Ruteo por cabeceras             | No (no ve HTTP)          | Sí, pero solo para tráfico externo | Sí, para cualquier servicio interno                 |
| mTLS entre servicios            | No                       | No (TLS termina en el borde)      | Sí, automático y transparente                        |
| Métricas por servicio/ruta      | Mínimas                  | Solo del borde                    | Golden metrics por workload sin instrumentar código  |
| Reintentos, timeouts            | No                       | Limitado                          | Sí, declarativos                                     |
| Costo                           | Bajo                     | Bajo                              | Un sidecar por pod (CPU/RAM extra, más complejidad)  |

Conclusión: un Ingress basta para exponer la app al exterior. Cuando se necesita controlar el tráfico **entre** microservicios (A/B, canary por servicio, feature flags, seguridad mTLS), el Service Mesh lo hace sin cambiar el código.
