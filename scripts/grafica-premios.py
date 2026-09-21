#!/usr/bin/env python3
"""
Arma la grafica de premios del Club de Puntos a partir de lo que devuelve la API.

Los premios NO se escriben a mano: se leen de /api/premios, asi la pieza nunca queda
desfasada de lo que el cliente ve en la tienda.

Uso:
    python scripts/grafica-premios.py --salida premios.png
    python scripts/grafica-premios.py --formato cuadrada
"""
import argparse, json, os, sys, urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter

API = "https://tienda-puntos-sage.vercel.app/api/premios"
REGISTRO = "https://tienda-puntos-sage.vercel.app/#registro"
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HP = r"C:\Users\Alejo Bales\Desktop\HOUSE-OF-PANCHOS"

NEGRO   = (0, 0, 0)
ORO     = (255, 215, 0)
ORO_SUA = (245, 217, 139)
BLANCO  = (255, 255, 255)
GRIS    = (168, 168, 168)
CARTA   = (22, 22, 22)

F = lambda n, s: ImageFont.truetype(rf"C:\Windows\Fonts\{n}", s)

# Foto para cada premio. Se empareja por palabras clave del nombre, para que si
# manana se carga otro premio no se rompa: simplemente queda sin foto.
FOTOS = [
    (("cerveza",),            r"03-FOTOS-PRODUCTO\fotos profesionales\pancho y cerveza arreglado.png"),
    (("duo", "dos botellas"), "__DUO__"),
    (("vino",),               r"07 - ARCHIVOS PARA PAGINA WEB\VINO LOS SIETE LOCOS EL DESAMOR.png"),
    (("combo", "pancho"),     r"03-FOTOS-PRODUCTO\fotos comida\combo PREMIU CHEDAR Y PANCETA c fritas sin fondo.png"),
]

def sin_negro(im):
    """El logo viene con fondo negro solido. Se vuelve transparente para que no
    quede un recuadro recortado sobre el degrade dorado."""
    im = im.convert("RGBA")
    px = im.load()
    for yy in range(im.height):
        for xx in range(im.width):
            r, g, b, al = px[xx, yy]
            m = max(r, g, b)
            if m < 40:
                px[xx, yy] = (r, g, b, 0)
            elif m < 110:
                px[xx, yy] = (r, g, b, int(al * (m - 40) / 70))
    return im


TITULO_MINUS = {"de", "con", "y", "a", "el", "la", "los", "las", "del", "en", "por"}
PROPIOS = {"siete": "Siete", "locos": "Locos", "quilmes": "Quilmes", "premium": "Premium",
           "boutique": "Boutique", "bajocero": "Bajocero", "bodega": "Bodega"}


def titulo(t):
    ps = t.lower().split()
    out = []
    for i, w in enumerate(ps):
        out.append(w if (i and w in TITULO_MINUS) else w.capitalize())
    return " ".join(out)


def descripcion(t):
    if not t: return ""
    if t.isupper() or t == t.upper():
        ps = [PROPIOS.get(w.lower().strip(",."), w.lower()) for w in t.split()]
        t = " ".join(ps)
        t = t[0].upper() + t[1:]
    return t.replace(" - ", " — ")


def abrir(rel):
    p = os.path.join(HP, rel)
    return Image.open(p).convert("RGBA") if os.path.exists(p) else None

def foto_de(premio):
    texto = (premio["nombre"] + " " + (premio.get("descripcion") or "")).lower()
    for claves, rel in FOTOS:
        if any(k in texto for k in claves):
            if rel == "__DUO__":
                a = abrir(r"07 - ARCHIVOS PARA PAGINA WEB\VINO LOS SIETE LOCOS EL DESAMOR.png")
                b = abrir(r"07 - ARCHIVOS PARA PAGINA WEB\VINO LOS SIETE LOCOS LA COJA.png")
                if not (a and b): return None
                h = 1600; a = a.resize((int(a.width*h/a.height), h)); b = b.resize((int(b.width*h/b.height), h))
                duo = Image.new("RGBA", (a.width + b.width, h), (0,0,0,0))
                duo.paste(a, (0,0)); duo.paste(b, (a.width,0))
                return duo
            return abrir(rel)
    return None

def recuadro(img, lado):
    """Cuadrado con esquinas redondeadas. Las fotos muy verticales (botellas) se
    encajan enteras: recortarlas al centro le comia la etiqueta."""
    if img is None: return None
    im = img.convert("RGB")
    if im.height / im.width > 1.35:
        e = lado / im.height
        ch = im.resize((max(1,int(im.width*e)), lado), Image.LANCZOS)
        im = Image.new("RGB", (lado, lado), (34, 34, 34))
        im.paste(ch, ((lado-ch.width)//2, 0))
    else:
        e = max(lado/im.width, lado/im.height)
        im = im.resize((max(1,int(im.width*e)), max(1,int(im.height*e))), Image.LANCZOS)
        x = (im.width-lado)//2; y = (im.height-lado)//2
        im = im.crop((x, y, x+lado, y+lado))
    mask = Image.new("L", (lado,lado), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0,0,lado-1,lado-1), radius=int(lado*0.16), fill=255)
    out = Image.new("RGBA", (lado,lado), (0,0,0,0))
    out.paste(im, (0,0), mask)
    return out

def cortar(d, texto, fuente, ancho):
    palabras = texto.split(); lineas = []; act = ""
    for p in palabras:
        t = (act + " " + p).strip()
        if d.textlength(t, font=fuente) <= ancho: act = t
        else:
            if act: lineas.append(act)
            act = p
    if act: lineas.append(act)
    return lineas

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--salida", default="premios-club-de-puntos.png")
    ap.add_argument("--api", default=API)
    a = ap.parse_args()

    with urllib.request.urlopen(a.api, timeout=30) as r:
        premios = json.load(r)
    premios.sort(key=lambda p: p["puntosRequeridos"])
    print(f"{len(premios)} premios leidos de la API")

    W = 1080
    alto_t, sep = 246, 20
    # se dibuja sobre un lienzo holgado y al final se recorta al contenido:
    # asi el pie queda pegado a las tarjetas aunque cambie la cantidad de premios
    H = 900 + len(premios)*(alto_t+sep) + 700
    img = Image.new("RGB", (W, H), NEGRO)
    d = ImageDraw.Draw(img)

    # resplandor dorado suave detras del encabezado
    halo = Image.new("RGB", (W, H), NEGRO)
    ImageDraw.Draw(halo).ellipse((-200, -380, W+200, 420), fill=(70, 58, 0))
    img = Image.blend(img, halo.filter(ImageFilter.GaussianBlur(120)), 0.85)
    d = ImageDraw.Draw(img)

    y = 60
    logo = sin_negro(Image.open(os.path.join(RAIZ, "web-admin", "public", "logo-hp-v2.png")))
    lw = 470; logo = logo.resize((lw, int(logo.height*lw/logo.width)), Image.LANCZOS)
    img.paste(logo, ((W-lw)//2, y), logo)
    y += logo.height + 26

    f_tit = F("georgiab.ttf", 78)
    d.text((W//2, y), "CLUB DE PUNTOS", font=f_tit, fill=ORO, anchor="ma"); y += 96
    f_sub = F("arial.ttf", 33)
    d.text((W//2, y), "Sumá puntos con cada compra", font=f_sub, fill=ORO_SUA, anchor="ma"); y += 44
    d.text((W//2, y), "y canjealos por estos premios", font=f_sub, fill=ORO_SUA, anchor="ma"); y += 70

    # tarjetas
    MX = 56
    f_nom = F("georgiab.ttf", 42)
    f_des = F("arial.ttf", 27)
    f_pts = F("ariblk.ttf", 52)
    f_lbl = F("arialbd.ttf", 23)

    for p in premios:
        x0, x1 = MX, W-MX
        d.rounded_rectangle((x0, y, x1, y+alto_t), radius=28, fill=CARTA)
        d.rounded_rectangle((x0, y, x1, y+alto_t), radius=28, outline=(58,50,10), width=2)

        lado = alto_t - 44
        ph = recuadro(foto_de(p), lado)
        if ph: img.paste(ph, (x0+22, y+22), ph)

        tx = x0 + 22 + lado + 26
        anc = x1 - tx - 172
        ty = y + 40
        for ln in cortar(d, titulo(p["nombre"]), f_nom, anc)[:2]:
            d.text((tx, ty), ln, font=f_nom, fill=BLANCO); ty += 50
        ty += 6
        desc = descripcion(p.get("descripcion") or "")
        for ln in cortar(d, desc, f_des, anc)[:3]:
            d.text((tx, ty), ln, font=f_des, fill=GRIS); ty += 34

        # insignia de puntos
        bx = x1 - 148
        by = y + alto_t//2
        d.ellipse((bx-8, by-72, bx+140, by+76), fill=ORO)
        d.text((bx+66, by-34), str(p["puntosRequeridos"]), font=f_pts, fill=NEGRO, anchor="ma")
        d.text((bx+66, by+26), "PUNTOS", font=f_lbl, fill=NEGRO, anchor="ma")
        y += alto_t + sep

    # pie: QR de registro
    y = y + 60
    d.text((W//2, y), "¿Todavía no sos socio?", font=F("georgiab.ttf", 40), fill=ORO, anchor="ma"); y += 60
    d.text((W//2, y), "Escaneá y registrate gratis", font=f_sub, fill=ORO_SUA, anchor="ma"); y += 56

    qr_path = os.path.join(HP, "06-TIENDA-PUNTOS", "qr-registro-tienda-puntos.png")
    if os.path.exists(qr_path):
        q = Image.open(qr_path).convert("RGB")
        qs = 232; q = q.resize((qs, qs), Image.LANCZOS)
        marco = Image.new("RGB", (qs+24, qs+24), BLANCO)
        marco.paste(q, (12, 12))
        img.paste(marco, ((W-qs-24)//2, y))
        y += qs + 40
    d.text((W//2, y), "tienda-puntos-sage.vercel.app", font=F("arialbd.ttf", 27), fill=GRIS, anchor="ma")

    img = img.crop((0, 0, W, min(H, y + 78)))
    img.save(a.salida, quality=95)
    print("guardado:", a.salida, img.size)

if __name__ == "__main__":
    main()
