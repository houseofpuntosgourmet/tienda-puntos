#!/usr/bin/env python3
"""
Genera el QR de registro de la Tienda de Puntos, en alta resolucion para imprimir.

Por que existe: el QR que estaba impreso apuntaba a tienda-puntos-ten.vercel.app, que
quedo muerto, y ademas el PDF de impresion lo tenia a ~91 dpi. Este script lo rehace
con el MISMO estilo visual que genera la app (web-admin RegistroCliente.tsx, que usa
qr-code-styling) pero al tamano que haga falta.

Uso:
    python scripts/generar-qr.py https://club.houseofpanchos.com.ar/#registro
    python scripts/generar-qr.py <url> --px 2400 --salida qr-nuevo.png

Importante: generar el QR contra un dominio que todavia no resuelve no sirve de nada.
Verificar primero que la URL abra el formulario de registro.
"""
import argparse, sys
import segno
from PIL import Image, ImageDraw

# Mismos valores que web-admin/src/components/RegistroCliente.tsx
COLOR_PUNTOS = "#222222"
COLOR_ESQUINAS = "#2563eb"
FONDO = "#ffffff"
ECC = "h"           # errorCorrectionLevel: 'H'
MARGEN_MODULOS = 4  # zona silenciosa minima del estandar


def matriz(url):
    qr = segno.make(url, error=ECC, micro=False)
    filas = [list(f) for f in qr.matrix]
    return [[1 if v else 0 for v in f] for f in filas]


def es_localizador(r, c, n):
    return (r < 7 and c < 7) or (r < 7 and c >= n - 7) or (r >= n - 7 and c < 7)


def dibujar(m, px_modulo, margen):
    n = len(m)
    lado = (n + 2 * margen) * px_modulo
    img = Image.new("RGB", (lado, lado), FONDO)
    d = ImageDraw.Draw(img)
    off = margen * px_modulo

    def caja(r, c):
        x0 = off + c * px_modulo
        y0 = off + r * px_modulo
        return int(x0), int(y0), int(x0 + px_modulo - 1), int(y0 + px_modulo - 1)

    def oscuro(r, c):
        return 0 <= r < n and 0 <= c < n and m[r][c] == 1

    # modulos de datos, con esquinas redondeadas solo donde no hay vecino
    # (es lo que hace el tipo "rounded" de qr-code-styling)
    # un pelo menos de la mitad: con exactamente la mitad, PIL degenera la geometria
    # (px-3)//2 es el radio maximo que PIL tolera al redondear solo algunas esquinas
    radio = min(int(px_modulo * 0.45), (px_modulo - 3) // 2)
    for r in range(n):
        for c in range(n):
            if m[r][c] != 1 or es_localizador(r, c, n):
                continue
            arriba, abajo = oscuro(r - 1, c), oscuro(r + 1, c)
            izq, der = oscuro(r, c - 1), oscuro(r, c + 1)
            esquinas = (
                not (arriba or izq),   # sup izq
                not (arriba or der),   # sup der
                not (abajo or der),    # inf der
                not (abajo or izq),    # inf izq
            )
            if any(esquinas) and radio >= 2:
                d.rounded_rectangle(caja(r, c), radius=radio, fill=COLOR_PUNTOS, corners=esquinas)
            else:
                # con modulos muy chicos PIL no puede redondear: se dibuja cuadrado,
                # que ademas es lo mas legible a esa escala
                d.rectangle(caja(r, c), fill=COLOR_PUNTOS)

    # localizadores: anillo extra-redondeado + punto central
    for (fr, fc) in [(0, 0), (0, n - 7), (n - 7, 0)]:
        x0 = off + fc * px_modulo
        y0 = off + fr * px_modulo
        x1 = x0 + 7 * px_modulo - 1
        y1 = y0 + 7 * px_modulo - 1
        d.rounded_rectangle((x0, y0, x1, y1), radius=px_modulo * 2,
                            outline=COLOR_ESQUINAS, width=px_modulo)
        cx0 = x0 + 2 * px_modulo
        cy0 = y0 + 2 * px_modulo
        d.ellipse((cx0, cy0, cx0 + 3 * px_modulo - 1, cy0 + 3 * px_modulo - 1),
                  fill=COLOR_ESQUINAS)
    return img


def main():
    p = argparse.ArgumentParser()
    p.add_argument("url")
    p.add_argument("--px", type=int, default=1800, help="lado aproximado en pixeles")
    p.add_argument("--salida", default="qr-registro-tienda-puntos.png")
    p.add_argument("--margen", type=int, default=MARGEN_MODULOS)
    a = p.parse_args()

    m = matriz(a.url)
    n = len(m)
    px_modulo = max(4, round(a.px / (n + 2 * a.margen)))
    img = dibujar(m, px_modulo, a.margen)
    img.save(a.salida)
    lado = img.size[0]
    print(f"URL      : {a.url}")
    print(f"Version  : {n}x{n} modulos (ECC H)")
    print(f"Salida   : {a.salida}  {lado}x{lado} px  ({px_modulo} px por modulo)")
    print(f"Impresion: a 300 dpi entra nitido hasta {lado/300:.1f} pulgadas ({lado/300*2.54:.1f} cm)")


if __name__ == "__main__":
    main()
