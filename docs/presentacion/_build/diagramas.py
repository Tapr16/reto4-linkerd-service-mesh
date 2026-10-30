"""Genera los diagramas (Graphviz) de la presentación del Reto 4."""
import pathlib
import subprocess

OUT = pathlib.Path(__file__).resolve().parent.parent / "diagramas"
OUT.mkdir(exist_ok=True)

OSCURO = "#1F2A37"
TEAL = "#0B8A8F"      # Linkerd / malla
V1 = "#2563EB"        # versión estable
V2 = "#F26B1D"        # versión nueva
GRIS = "#5B6675"

COMUN = f'''
  graph [fontname="Arial", fontsize=13, bgcolor="white", pad=0.3, nodesep=0.3, ranksep=0.55, compound=true];
  node  [fontname="Arial", fontsize=12, shape=box, style="rounded,filled", color="{OSCURO}", penwidth=1.2];
  edge  [fontname="Arial", fontsize=10, color="#555555", penwidth=1.3];
'''


def render(nombre, dot):
    src = OUT / f"{nombre}.dot"
    src.write_text(dot, encoding="utf-8")
    subprocess.run(["dot", "-Tpng", "-Gdpi=200", str(src), "-o", str(OUT / f"{nombre}.png")], check=True)
    src.unlink()


# 1. Arquitectura completa
render("arquitectura", f'''digraph G {{ {COMUN} rankdir=TB; ranksep=0.35; nodesep=0.5;
  pc [label="PC\\ncurl / Postman", fillcolor="{OSCURO}", fontcolor="white"];
  subgraph cluster_ns {{
    label="namespace reto4  ·  linkerd.io/inject: enabled"; labeljust="l"; fontsize=14; fontcolor="{OSCURO}";
    style="rounded,filled"; color="{TEAL}"; fillcolor="#E6F4F4"; penwidth=2;
    gw [label="gateway\\nnginx + linkerd-proxy", fillcolor="{TEAL}", fontcolor="white", color="{TEAL}"];
    svc [label="Service web", shape=box, style="filled", fillcolor="white", color="{OSCURO}"];
    rt [label="HTTPRoute\\nweb-por-cabecera", shape=diamond, style="filled", fillcolor="#FFF7E6", color="#D4A72C", fontsize=11];
    v2 [label="web-v2\\n1 réplica · reto4-app:v2", fillcolor="{V2}", fontcolor="white", color="{V2}"];
    v1 [label="web-v1\\n2 réplicas · reto4-app:v1", fillcolor="{V1}", fontcolor="white", color="{V1}"];
    cl [label="client\\ncurl + linkerd-proxy", fillcolor="#CFE9EA", color="{TEAL}"];
  }}
  pc -> gw [label=" localhost:8080\\n (NodePort 30080)"];
  gw -> svc [label="pide web:80"];
  cl -> svc [style=dashed, label="pruebas internas", fontcolor="{GRIS}"];
  svc -> rt [arrowhead=none];
  rt -> v2 [label=" x-feature-flag=new-version\\n ó user-agent=experimental", color="{V2}", fontcolor="{V2}", penwidth=2];
  rt -> v1 [label=" otra petición", color="{V1}", fontcolor="{V1}", penwidth=2];
}}''')

# 2. Cómo funciona el sidecar
render("sidecar", f'''digraph G {{ {COMUN} rankdir=TB; ranksep=0.6; nodesep=0.35; newrank=true;
  subgraph cluster_cp {{
    label="Control plane (namespace linkerd)"; labeljust="l"; fontsize=13; style="rounded,filled"; color="{OSCURO}"; fillcolor="#F3F5F8";
    inj [label="proxy-injector\ninyecta el sidecar", fillcolor="white"];
    dst [label="destination\nrutas (HTTPRoute) y endpoints", fillcolor="white"];
    idn [label="identity\ncertificados mTLS", fillcolor="white"];
  }}
  subgraph cluster_a {{
    label="Pod gateway"; labeljust="l"; fontsize=12; style="rounded,filled"; color="{TEAL}"; fillcolor="#E6F4F4";
    a_app [label="nginx", fillcolor="#CFE9EA", color="{TEAL}"];
    a_px [label="linkerd-proxy\nsalida: aplica la ruta", fillcolor="{TEAL}", fontcolor="white", color="{TEAL}"];
  }}
  subgraph cluster_b {{
    label="Pod web-v2"; labeljust="l"; fontsize=12; style="rounded,filled"; color="{V2}"; fillcolor="#FFF1E8";
    b_px [label="linkerd-proxy\nentrada", fillcolor="{TEAL}", fontcolor="white", color="{TEAL}"];
    b_app [label="app Node.js", fillcolor="{V2}", fontcolor="white", color="{V2}"];
  }}
  {{rank=same; inj; dst; idn;}}
  {{rank=same; a_app; a_px; b_px; b_app;}}
  a_app -> a_px [label="HTTP"];
  a_px -> b_px [label="  mTLS  ", color="{TEAL}", fontcolor="{TEAL}", penwidth=2.5];
  b_px -> b_app [label="HTTP"];
  inj -> a_px [style=dashed, color="{GRIS}", arrowhead=vee];
  dst -> a_px [style=dashed, color="{GRIS}", arrowhead=vee];
  idn -> b_px [style=dashed, color="{GRIS}", arrowhead=vee];
}}''')

# 3. Dentro vs fuera de la malla
render("proxy-cliente", f'''digraph G {{ {COMUN} rankdir=LR; ranksep=0.45;
  subgraph cluster_out {{
    label="Fuera de la malla (kubectl port-forward)"; labeljust="l"; fontsize=13; style="rounded,filled"; color="#9B2C2C"; fillcolor="#FDECEC";
    c2 [label="curl directo\\nsin proxy cliente", fillcolor="white", color="#9B2C2C"];
    s2 [label="Service web\\n(selector v1)", fillcolor="white"];
    o2 [label="v1", fillcolor="{V1}", fontcolor="white", color="{V1}", width=0.8];
    c2 -> s2 [label="X-Feature-Flag:\\nnew-version", fontsize=9]; s2 -> o2 [color="{V1}", penwidth=2];
  }}
  subgraph cluster_in {{
    label="Dentro de la malla"; labeljust="l"; fontsize=13; style="rounded,filled"; color="{TEAL}"; fillcolor="#E6F4F4";
    c1 [label="gateway / client\\n+ linkerd-proxy", fillcolor="{TEAL}", fontcolor="white", color="{TEAL}"];
    r1 [label="HTTPRoute\\nse evalúa aquí", shape=diamond, style="filled", fillcolor="#FFF7E6", color="#D4A72C", fontsize=10];
    o1 [label="v2", fillcolor="{V2}", fontcolor="white", color="{V2}", width=0.8];
    c1 -> r1 [label="X-Feature-Flag:\\nnew-version", fontsize=9] ; r1 -> o1 [color="{V2}", penwidth=2];
  }}
}}''')

print("diagramas en", OUT)
