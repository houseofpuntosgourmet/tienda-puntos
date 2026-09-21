#!/usr/bin/env python3
"""
Reemplaza el QR dentro de una pieza grafica ya disenada, sin rehacer el arte.

Por que: los carteles de House of Panchos son arte generado, no se pueden re-editar.
Pero el QR vive sobre un panel blanco bien delimitado, asi que se puede sustituir
sin tocar el resto del diseno.

Uso:
    python scripts/rehacer-cartel.py "AVISO TIENDA DE PUNTOS.png" <url> --salida nuevo.png

Deja ademas un margen blanco (zona silenciosa) correcto alrededor del codigo, que en el
original era de apenas 3 px: por debajo de lo que pide el estandar y de lo que necesita
un telefono para leerlo de lejos.
"""
import argparse, importlib.util, os, sys
import cv2
import numpy as np
from PIL import Image

_spec = importlib.util.spec_from_file_location(
    "gen", os.path.join(os.path.dirname(os.path.abspath(__file__)), "generar-qr.py"))
gen = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(gen)


def leer(path):
    img = cv2.imdecode(np.fromfile(path, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        sys.exit(f"No se pudo abrir {path}")
    return img


def panel_blanco(img):
    """Ubica el QR y, alrededor, el panel blanco que lo contiene."""
    det = cv2.QRCodeDetector()
    ok, pts = det.detect(img)
    if not ok or pts is None:
        return None
    q = pts.reshape(-1, 4, 2)[0]
    x0, y0 = int(q[:, 0].min()), int(q[:, 1].min())
    x1, y1 = int(q[:, 0].max()), int(q[:, 1].max())
    pad = int(max(x1 - x0, y1 - y0) * 0.35)
    rx0, ry0 = max(0, x0 - pad), max(0, y0 - pad)
    rx1, ry1 = min(img.shape[1], x1 + pad), min(img.shape[0], y1 + pad)
    sub = cv2.cvtColor(img[ry0:ry1, rx0:rx1], cv2.COLOR_BGR2GRAY)
    _, th = cv2.threshold(sub, 200, 255, cv2.THRESH_BINARY)
    cnts, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not cnts:
        return (x0, y0, x1, y1)
    bx, by, bw, bh = cv2.boundingRect(max(cnts, key=cv2.contourArea))
    return (rx0 + bx, ry0 + by, rx0 + bx + bw, ry0 + by + bh)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("cartel")
    p.add_argument("url")
    p.add_argument("--salida", default=None)
    p.add_argument("--escala", type=float, default=1.0,
                   help="agranda el panel del QR respecto del original (1.3 = 30% mas grande)")
    a = p.parse_args()

    img = leer(a.cartel)
    zona = panel_blanco(img)
    if zona is None:
        sys.exit("No se encontro un QR en esta pieza. "
                 "Puede ser un QR decorativo (generado por IA) y no uno real.")
    x0, y0, x1, y1 = zona
    lado = int(max(x1 - x0, y1 - y0) * a.escala)
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2

    # QR nuevo, con zona silenciosa correcta incluida
    m = gen.matriz(a.url)
    n = len(m)
    # se dibuja con modulos grandes y se reduce: asi el estilo redondeado sale limpio
    px = 20
    qr = gen.dibujar(m, px, 4)
    qr = qr.resize((lado, lado), Image.LANCZOS)

    base = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    px0, py0 = cx - lado // 2, cy - lado // 2
    base.paste(qr, (px0, py0))

    salida = a.salida or (os.path.splitext(a.cartel)[0] + " - QR NUEVO.png")
    base.save(salida)
    print(f"Pieza    : {os.path.basename(a.cartel)}  {img.shape[1]}x{img.shape[0]}")
    print(f"Panel QR : {x0},{y0} .. {x1},{y1}  -> nuevo de {lado}x{lado} px")
    print(f"QR       : {n}x{n} modulos, {lado/(n+8):.1f} px por modulo en la pieza")
    print(f"Salida   : {salida}")
    frac = lado / img.shape[1]
    print(f"\nEl QR ocupa el {frac*100:.1f}% del ancho de la pieza.")
    print(f"Para que cada modulo mida 0.8 mm (lo minimo comodo para un telefono),")
    print(f"la pieza impresa tiene que medir al menos {(n+8)*0.8/10/frac:.1f} cm de ancho.")


if __name__ == "__main__":
    main()
