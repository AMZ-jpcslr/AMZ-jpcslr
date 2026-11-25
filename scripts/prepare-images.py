"""ポートフォリオ（AMZ-jpcslr/Portfolio）の画像を、README用に縮小して assets/source/ へ保存します。

一度だけ手動で実行します（Pillowが必要）。
    python3 scripts/prepare-images.py ../Portfolio/site
"""
import sys
from pathlib import Path
from PIL import Image

site = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / 'assets' / 'source'
out.mkdir(parents=True, exist_ok=True)

def save(src, name, size, crop=None, quality=82):
    im = Image.open(site / src)
    if crop:  # 指定の縦横比で上寄せに切り抜く
        w, h = im.size
        tw = min(w, int(h * crop))
        th = int(tw / crop)
        left = (w - tw) // 2
        im = im.crop((left, 0, left + tw, th))
    im.thumbnail(size, Image.LANCZOS)
    im.save(out / name, 'WEBP', quality=quality, method=6)
    print(name, im.size, (out / name).stat().st_size)

save('assets/workshop/working.webp', 'working.webp', (440, 550), quality=84)
save('assets/workshop/guide.webp', 'guide.webp', (360, 347), quality=84)
works = {
    'mania': 'assets/works/mania.webp', 'career': 'assets/works/career.webp',
    'stream': 'assets/works/stream.webp', 'voice': 'interaction-demos/media/voice.jpg',
    'weather': 'assets/works/weather.webp', 'moral': 'recordings/media/moral.jpg',
    'proxy': 'recordings/media/proxy.jpg', 'soccer': 'recordings/media/soccer.jpg',
}
for slug, src in works.items():
    save(src, f'work-{slug}.webp', (520, 360), crop=520 / 360, quality=74)
