from pathlib import Path
import shutil
import zipfile

zip_path = Path('Giannos_Olive_Oil_4K_Clean_Transparent.zip')
tmp = Path('/tmp/olive-assets')
if tmp.exists():
    shutil.rmtree(tmp)
tmp.mkdir(parents=True)
with zipfile.ZipFile(zip_path) as z:
    z.extractall(tmp)

root = tmp / 'Giannos_Olive_Oil_4K_Clean_Transparent'
src500 = root / 'Giannos Greek Extra Virgin Olive Oil 500ml Bottle'
src3l = root / 'Giannos Greek Extra Virgin Olive Oil 3 Liter Tin'
dst500 = Path('assets/olive-oil/500ml')
dst3l = Path('assets/olive-oil/3l')
dst500.mkdir(parents=True, exist_ok=True)
dst3l.mkdir(parents=True, exist_ok=True)
for f in src500.glob('*.png'):
    shutil.copy2(f, dst500 / f.name)
for f in src3l.glob('*.png'):
    shutil.copy2(f, dst3l / f.name)
zip_path.unlink()

p = Path('olive.js')
s = p.read_text()
old500 = """      images:[
        'https://www.giannos.com/cdn/shop/files/Giannos_Olive_Oil_Resized_-_Front.png?v=1777448601&width=1946',
        'https://www.giannos.com/cdn/shop/files/Giannos_Olive_Oil_Resized_-_Back.png?v=1777448601&width=1946'
      ]"""
new500 = """      images:[
        './assets/olive-oil/500ml/giannos-greek-extra-virgin-olive-oil-500ml-front.png',
        './assets/olive-oil/500ml/giannos-greek-extra-virgin-olive-oil-500ml-back.png'
      ]"""
if old500 not in s:
    raise SystemExit('500ml image block not found')
s = s.replace(old500, new500, 1)
old3l = """      images:[
        'https://www.giannos.com/cdn/shop/files/olive-oil-3L-tin-front.jpg?v=1775600164&width=1946',
        'https://www.giannos.com/cdn/shop/files/olive-oil-3L-tin-angled.jpg?v=1775600169&width=1946'
      ]"""
new3l = """      images:[
        './assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-front.png',
        './assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-front-angled.png',
        './assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-side.png',
        './assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-back.png'
      ]"""
if old3l not in s:
    raise SystemExit('3L image block not found')
s = s.replace(old3l, new3l, 1)
old_swipe = "state[index].image=dx<0?1:0;image.src=OLIVE_PRODUCTS[index].images[state[index].image]"
new_swipe = "const count=OLIVE_PRODUCTS[index].images.length;state[index].image=dx<0?(state[index].image+1)%count:(state[index].image-1+count)%count;image.src=OLIVE_PRODUCTS[index].images[state[index].image]"
if old_swipe not in s:
    raise SystemExit('olive swipe block not found')
s = s.replace(old_swipe, new_swipe, 1)
p.write_text(s)

idx = Path('index.html')
h = idx.read_text()
h = h.replace('olive.js?v=202608171206', 'olive.js?v=202608171229')
idx.write_text(h)

expected = [
    dst500/'giannos-greek-extra-virgin-olive-oil-500ml-front.png',
    dst500/'giannos-greek-extra-virgin-olive-oil-500ml-back.png',
    dst3l/'giannos-greek-extra-virgin-olive-oil-3-liter-front.png',
    dst3l/'giannos-greek-extra-virgin-olive-oil-3-liter-front-angled.png',
    dst3l/'giannos-greek-extra-virgin-olive-oil-3-liter-side.png',
    dst3l/'giannos-greek-extra-virgin-olive-oil-3-liter-back.png',
]
for f in expected:
    if not f.exists() or f.stat().st_size == 0:
        raise SystemExit(f'missing asset: {f}')
print('\n'.join(str(f) for f in expected))
