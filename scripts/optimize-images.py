"""Create WebP assets and update site references; keep original source images."""
import json
import re
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
assets = dist / 'assets'
originals = root / 'originals' / 'assets'
report = []
sources = sorted(assets.rglob('*')) + sorted(originals.rglob('*'))
for source in sources:
    if source.suffix.lower() not in {'.png', '.jpg', '.jpeg'}:
        continue
    relative = source.relative_to(originals if source.is_relative_to(originals) else assets)
    target = (assets / relative).with_suffix('.webp')
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as opened:
        picture = ImageOps.exif_transpose(opened)
        picture = picture.convert('RGBA' if 'A' in picture.getbands() else 'RGB')
        # Preserve small marks sharply; large catalog photos retain zoom detail.
        is_mark = 'logo' in source.stem.lower() or 'colegios' in source.parts
        picture.thumbnail((2200, 2200), Image.Resampling.LANCZOS)
        picture.save(target, 'WEBP', quality=88, method=6, lossless=is_mark)
        report.append({
            'source': 'assets/' + relative.as_posix(),
            'webp': target.relative_to(dist).as_posix(),
            'width': picture.width, 'height': picture.height,
            'before_bytes': source.stat().st_size,
            'after_bytes': target.stat().st_size,
        })

for file in [dist / 'index.html', dist / 'app.js', root / 'src/styles.css', dist / 'tokens.css']:
    if not file.exists():
        continue
    text = file.read_text(encoding='utf-8')
    for item in report:
        text = text.replace(item['source'], item['webp'])
    if file.suffix == '.html':
        by_path = {item['webp']: item for item in report}
        def dimensions(match):
            tag = match.group(0)
            src = re.search(r'src="([^"]+)"', tag)
            item = by_path.get(src.group(1)) if src else None
            if item:
                tag = re.sub(r'\s(?:width|height)="\d+"', '', tag)
                tag = tag.replace('<img ', f'<img width="{item["width"]}" height="{item["height"]}" ', 1)
            return tag
        text = re.sub(r'<img\b[^>]*>', dimensions, text)
    file.write_text(text, encoding='utf-8')

(root / 'scripts/webp-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
before = sum(item['before_bytes'] for item in report)
after = sum(item['after_bytes'] for item in report)
print(json.dumps({'images': len(report), 'before_bytes': before,
                  'after_bytes': after, 'reduction_percent': round((1-after/before)*100, 1)}))
