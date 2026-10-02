"""Optional asset generator. Requires Pillow and installed npm dependencies."""
from pathlib import Path
import math
import struct
import zlib
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'img'
OUT.mkdir(parents=True, exist_ok=True)
INK = '#3f4752'
PURPLE = '#73038a'

def prepare_fonts():
    """Reconstruct SFNT from the local Fontsource WOFF1 files for Pillow."""
    work = ROOT / 'work'
    work.mkdir(exist_ok=True)
    for name, weight in [('Regular', 400), ('Bold', 700)]:
        source = ROOT / 'node_modules' / '@fontsource' / 'poppins' / 'files' / f'poppins-latin-{weight}-normal.woff'
        data = source.read_bytes()
        count = struct.unpack_from('>H', data, 12)[0]
        power = 2 ** int(math.log2(count))
        header = data[4:8] + struct.pack('>HHHH', count, power * 16, int(math.log2(power)), count * 16 - power * 16)
        records = []
        payload = bytearray()
        offset = 12 + count * 16
        for i in range(count):
            tag, start, compressed, length, checksum = struct.unpack_from('>4sIIII', data, 44 + i * 20)
            block = data[start:start + compressed]
            if compressed < length:
                block = zlib.decompress(block)
            records.append(struct.pack('>4sIII', tag, checksum, offset, length))
            padded = block + b'\0' * ((4 - length % 4) % 4)
            payload.extend(padded)
            offset += len(padded)
        (work / f'Poppins-{name}.ttf').write_bytes(header + b''.join(records) + payload)

prepare_fonts()

def font(size, bold=False):
    return ImageFont.truetype(str(ROOT / 'work' / f'Poppins-{"Bold" if bold else "Regular"}.ttf'), size)

def make(name, title, subtitle, price=False):
    canvas = Image.new('RGB', (1200, 630), 'white')
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((24, 24, 1176, 606), radius=24, outline='#e1e2e5', width=2)
    draw.rounded_rectangle((24, 24, 1176, 32), radius=4, fill=PURPLE)
    logo = Image.open(ROOT / 'img' / 'logo-hr.webp').convert('RGBA')
    logo.thumbnail((310, 60), Image.Resampling.LANCZOS)
    canvas.paste(logo, (72, 72), logo)
    draw.text((72, 176), 'VISUALIZADOR DE PROYECTOS ARQUITECTÓNICOS', font=font(17), fill=PURPLE)
    draw.multiline_text((68, 221), title, font=font(53, True), fill=INK, spacing=7)
    draw.multiline_text((72, 395), subtitle, font=font(22), fill='#626872', spacing=7)
    if price:
        draw.rounded_rectangle((72, 492, 437, 554), radius=12, fill=PURPLE)
        draw.text((96, 502), '$100.000 ARS', font=font(28, True), fill='white')
        draw.text((468, 511), 'PRECIO DE LANZAMIENTO', font=font(16), fill=PURPLE)
    else:
        draw.line((72, 505, 1128, 505), fill='#e1e2e5', width=2)
        draw.text((72, 533), 'IMÁGENES · PLANOS · VIDEOS · TOURS VIRTUALES', font=font(17), fill=INK)
    canvas.save(OUT / f'{name}.png', optimize=True)

make('og-home', 'Tu proyecto.\nUna sola experiencia.', 'Presentá el material de tu proyecto en un Visualizador\ninteractivo, listo para recorrer y compartir.')
make('og-price', 'Listo para presentar\ny compartir.', 'Implementación de tu material en un único enlace.\nPromoción para viviendas de hasta 2 plantas.', price=True)

icon = Image.open(ROOT / 'img' / 'TUV LOGO.webp').convert('RGBA')
icon.thumbnail((156, 156), Image.Resampling.LANCZOS)
touch = Image.new('RGB', (180, 180), 'white')
touch.paste(icon, ((180-icon.width)//2, (180-icon.height)//2), icon)
touch.save(OUT / 'apple-touch-icon.png')
print('Imágenes sociales e icono generados.')
