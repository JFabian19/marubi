"""Optimize bathroom organizer images into ultra-lightweight responsive WebP variants."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BATH_DIR = ROOT / 'public/assets/organizador-bano'

STEMS = ('ambiente', 'kit', 'referencia')
VARIANTS = [
    ('thumb', 200, 72),
    ('480', 480, 72),
    ('720', 720, 72),
    ('960', 960, 72),
]


def main():
    before = sum(f.stat().st_size for f in BATH_DIR.glob('*.webp'))
    print(f'Before total: {before / 1024:.1f} KiB')

    sources = {}
    for stem in STEMS:
        master = BATH_DIR / f'{stem}-1200.webp'
        if not master.exists():
            master = BATH_DIR / f'{stem}-960.webp'
        with Image.open(master) as im:
            sources[stem] = im.convert('RGB').copy()

    for stem, original in sources.items():
        for suffix, width, quality in VARIANTS:
            img = original.resize((width, width), Image.Resampling.LANCZOS) if original.width > width else original
            out = BATH_DIR / f'{stem}-{suffix}.webp'
            img.save(out, 'WEBP', quality=quality, method=6)
            print(f'  {out.name:24} {img.width}x{img.height:<5} {out.stat().st_size / 1024:5.1f} KiB')

    # Remove superseded heavy variants so dist stays lean.
    for old_suffix in ('640', '1200'):
        for stem in STEMS:
            old_path = BATH_DIR / f'{stem}-{old_suffix}.webp'
            if old_path.exists():
                old_path.unlink()

    after = sum(f.stat().st_size for f in BATH_DIR.glob('*.webp'))
    print(f'After total:  {after / 1024:.1f} KiB')


if __name__ == '__main__':
    main()
