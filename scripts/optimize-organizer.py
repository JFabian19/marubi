"""Responsive WebP exports: resize the entire source, never crop the product.

Run with Python + Pillow after updating the PNG originals.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'public/assets/organizador-plantas'
for color in ('blanco', 'negro'):
    for scene in ('sala', 'balcon', 'despues', 'armado', 'ficha'):
        source = (ROOT.parents[2] / 'assets/organizador-source' if scene == 'ficha' else ROOT) / f'{scene}-{color}.png'
        if not source.exists():
            continue
        with Image.open(source) as original:
            for suffix, width in (('movil', 720), ('desktop', 1280)):
                image = original.convert('RGB')
                image = image.resize((width, round(width * original.height / original.width)), Image.Resampling.LANCZOS)
                target = ROOT / f'{scene}-{color}-{suffix}.webp'
                image.save(target, 'WEBP', quality=82, method=6)
                print(f'{target.name}: {image.width}x{image.height}, {target.stat().st_size / 1024:.1f} KiB')
    with Image.open(ROOT / f'sala-{color}.png') as original:
        original.thumbnail((120, 120), Image.Resampling.LANCZOS)
        original.convert('RGB').save(ROOT / f'sala-{color}-thumb.webp', 'WEBP', quality=78, method=6)
