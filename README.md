# Reto 4 — Enrutamiento inteligente con Service Mesh (Linkerd)

Enrutamiento por cabeceras HTTP con **Linkerd** sobre Kubernetes (kind), sin tocar el código de la aplicación:

- `X-Feature-Flag: new-version` o `User-Agent: experimental` → **v2**
- Cualquier otra petición → **v1** (estable)

La regla es un `HTTPRoute` de Gateway API: [linkerd/httproute-header.yaml](linkerd/httproute-header.yaml).

**Integrantes:** David Esteban Suarez Lozano (2221909) · Thomas Alejandro Perez Rojas (2221906) · Jesus David Santodomingo Carrascal (2221922)

## Documentos

- 📄 [Informe con capturas (PDF)](docs/informe/Informe_Reto4_Linkerd.pdf)
- 🎞️ [Presentación (PDF)](docs/presentacion/Presentacion-Reto4-Linkerd.pdf) · [PPTX editable](docs/presentacion/Presentacion-Reto4-Linkerd.pptx)
- 📘 [Guía completa paso a paso](docs/GUIA.md)
- 📝 [Enunciado del reto](Retos%20Software%20III.pdf) (Reto 4)

## Ejecución rápida

Se necesita Docker Desktop, kind, kubectl y la CLI de linkerd. Los comandos se corren en Git Bash.

```bash
scripts/01-crear-cluster.sh && scripts/02-instalar-linkerd.sh && scripts/03-desplegar-app.sh
scripts/04-aplicar-rutas.sh header
scripts/05-probar.sh          # cuenta qué versión responde en cada caso
scripts/99-limpiar.sh         # borra el clúster
```
