"""Optimize 5-level organizer images into lightweight responsive WebP assets.

Generates viewport-tailored WebP variants without cropping the product and
converts the checkout WhatsApp icon from PNG to WebP.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ORG5_DIR = ROOT / 'public/assets/organizador-5'
ASSETS_DIR = ROOT / 'public/assets'

# Target widths and WebP qualities tuned per display slot.
TARGETS = {
    'hero': [
        ('hero.webp', 960, 76),
        ('hero-720.webp', 720, 75),
        ('hero-480.webp', 480, 74),
    ],
    'aislado': [
        ('aislado.webp', 720, 78),
        ('aislado-480.webp', 480, 76),
    ],
    'detalle': [
        ('detalle.webp', 840, 76),
        ('detalle-480.webp', 480, 75),
    ],
    'antes': [
        ('antes.webp', 720, 76),
        ('antes-480.webp', 480, 75),
    ],
    'despues': [
        ('despues.webp', 720, 76),
        ('despues-480.webp', 480, 75),
    ],
    'cocina': [
        ('cocina.webp', 600, 74),
        ('cocina-360.webp', 360, 73),
    ],
    'lavanderia': [
        ('lavanderia.webp', 600, 74),
        ('lavanderia-360.webp', 360, 73),
    ],
    'bano': [
        ('bano.webp', 600, 74),
        ('bano-360.webp', 360, 73),
    ],
    'departamento': [
        ('departamento.webp', 600, 74),
        ('departamento-360.webp', 360, 73),
    ],
    'hogar': [
        ('hogar.webp', 768, 75),
        ('hogar-480.webp', 480, 74),
    ],
}


def resize_and_save(original: Image.Image, target: Path, max_width: int, quality: int, keep_alpha: bool = False):
    img = original.convert('RGBA' if keep_alpha else 'RGB')
    if img.width > max_width:
        new_height = round(max_width * img.height / img.width)
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
    img.save(target, 'WEBP', quality=quality, method=6)
    return img.size, target.stat().st_size


def main():
    before_total = sum(f.stat().st_size for f in ORG5_DIR.glob('*.webp'))
    print(f'Before organizador-5 total: {before_total / 1024:.1f} KiB ({before_total:,} bytes)')

    # Load all source images into memory first so overwriting base files reads originals.
    sources = {}
    for stem in TARGETS:
        src_path = ORG5_DIR / f'{stem}.webp'
        with Image.open(src_path) as im:
            sources[stem] = im.copy()

    for stem, outputs in TARGETS.items():
        original = sources[stem]
        for filename, width, quality in outputs:
            target = ORG5_DIR / filename
            (w, h), size = resize_and_save(original, target, width, quality)
            print(f'  {filename:24} {w}x{h:<6} {size / 1024:5.1f} KiB')

    # Convert WhatsApp checkout icon PNG -> WebP (64x64 RGBA for crisp 2x/3x display at 22px).
    wa_png = ASSETS_DIR / 'whatsapp-icon.png'
    wa_webp = ASSETS_DIR / 'whatsapp-icon.webp'
    if wa_png.exists():
        with Image.open(wa_png) as original:
            (w, h), size = resize_and_save(original, wa_webp, 64, 82, keep_alpha=True)
            print(f'  {wa_webp.name:24} {w}x{h:<6} {size / 1024:5.1f} KiB (was {wa_png.stat().st_size / 1024:.1f} KiB PNG)')

    after_total = sum(f.stat().st_size for f in ORG5_DIR.glob('*.webp'))
    desktop_files = [ORG5_DIR / f'{s}.webp' for s in TARGETS]
    mobile_files = [ORG5_DIR / outputs[-1][0] for outputs in TARGETS.values()]
    print(f'After desktop set total:    {sum(f.stat().st_size for f in desktop_files) / 1024:.1f} KiB')
    print(f'After mobile set total:     {sum(f.stat().st_size for f in mobile_files) / 1024:.1f} KiB')
    print(f'After all variants total:   {after_total / 1024:.1f} KiB')


if __name__ == '__main__':
    main()
