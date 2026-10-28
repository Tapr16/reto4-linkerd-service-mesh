# Variables comunes. Se carga desde los demás scripts (source scripts/env.sh).
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLUSTER=reto4
NS=reto4
GATEWAY_API_VERSION=v1.2.1

# En Git Bash, Docker Desktop y la CLI de Linkerd no siempre quedan en el PATH.
WINGET="$HOME/AppData/Local/Microsoft/WinGet"
for d in "/c/Program Files/Docker/Docker/resources/bin" "$WINGET/Links" \
         "$WINGET/Packages/Kubernetes.kind_Microsoft.Winget.Source_8wekyb3d8bbwe" \
         "$HOME/.linkerd2/bin" "$RAIZ/bin"; do
  [ -d "$d" ] && PATH="$d:$PATH"
done
export PATH

paso() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
