from pathlib import Path
from datetime import datetime
import re
import sys

html_path = Path("public/index.html")
css_path = Path("public/styles.css")
js_path = Path("public/app.js")

html = html_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")
js = js_path.read_text(encoding="utf-8")

logo = '''<img class="brand-logo" src="/assets/logo.png"
           alt="Donna Luiza Restaurante & Pizzaria">'''

button = '''          <button class="add-item" type="button" data-add="${escapeHTML(product.id)}"
            aria-label="Adicionar ${escapeHTML(product.name)} ao carrinho">+</button>'''

checks = [
    (logo in html, "Logo original"),
    ('id="cart-drawer"' in html, "Carrinho"),
    (".cart-drawer {" in css, "Estilos do carrinho"),
    (button in js, "Botão + sobre a imagem"),
    ('href="/styles.css' in html, "Referência ao CSS"),
]

failed = [name for ok, name in checks if not ok]
if failed:
    print("CANCELADO: não encontrei:", ", ".join(failed))
    print("Nenhum arquivo foi alterado.")
    sys.exit(1)

stamp = datetime.now().strftime("%Y%m%d-%H%M%S")

# Backups antes de qualquer alteração.
for path in (html_path, css_path, js_path):
    backup = path.with_name(path.name + ".bak-ajustes-" + stamp)
    backup.write_text(path.read_text(encoding="utf-8"), encoding="utf-8")
    print("Backup criado:", backup)

# Nome elegante ao lado da logo, dentro do link do cabeçalho.
html = html.replace(
    logo,
    logo + '''
      <span class="brand-copy brand-copy-header">
        <strong>Donna Luiza</strong>
        <small>RESTAURANTE &amp; PIZZARIA</small>
      </span>''',
    1
)

# Evita que o navegador reutilize o CSS antigo.
html, count = re.subn(
    r'href="/styles\.css(?:\?v=[^"]*)?"',
    f'href="/styles.css?v=donna-ajustes-{stamp}"',
    html,
    count=1
)

if count != 1:
    print("ERRO: referência CSS inesperada. Consulte os backups.")
    sys.exit(1)

# Remove o botão + sobre a foto. Mantém o botão Adicionar do card.
js = js.replace(button, "", 1)

css += f"""

/* DONNA LUIZA - AJUSTES SOLICITADOS {stamp} */

/* Logo ampliada e nome elegante */
.site-header .brand {{
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
}}

.site-header .brand-logo {{
  width: clamp(210px, 25vw, 290px);
  height: auto;
  max-height: 100px;
  object-fit: contain;
  flex: 0 1 auto;
}}

.brand-copy-header {{
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}}

.brand-copy-header strong {{
  color: var(--ivory);
  font-family: var(--font-display);
  font-size: clamp(25px, 2.7vw, 36px);
  font-weight: 500;
  letter-spacing: -.035em;
  line-height: 1;
  white-space: nowrap;
}}

.brand-copy-header small {{
  color: var(--copper-light);
  font-size: 8px;
  letter-spacing: .14em;
  line-height: 1.5;
  white-space: nowrap;
}}

/* Carrinho em card compacto, centralizado */
.cart-drawer {{
  top: 50%;
  right: auto;
  left: 50%;
  width: min(430px, calc(100vw - 28px));
  height: auto;
  max-height: calc(100dvh - 28px);
  padding: 22px;
  border: 1px solid var(--line-copper);
  border-radius: 22px;
  box-shadow: 0 24px 90px rgba(0,0,0,.5);
  overflow: hidden;
  transform: translate(-50%, -46%) scale(.97);
}}

.cart-drawer.open {{
  transform: translate(-50%, -50%) scale(1);
}}

.cart-items {{
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}}

.cart-empty {{
  min-height: 150px;
  flex: 1 1 auto;
}}

.cart-footer {{
  flex: 0 0 auto;
}}

@media (max-width: 800px) {{
  .site-header .brand-logo {{
    width: clamp(155px, 30vw, 210px);
    max-height: 76px;
  }}

  .brand-copy-header strong {{
    font-size: clamp(21px, 4vw, 28px);
  }}
}}

@media (max-width: 480px) {{
  .site-header .brand {{
    gap: 6px;
  }}

  .site-header .brand-logo {{
    width: clamp(105px, 32vw, 155px);
    max-height: 65px;
  }}

  .brand-copy-header strong {{
    font-size: clamp(17px, 4.8vw, 23px);
  }}

  .brand-copy-header small {{
    font-size: 5px;
    letter-spacing: .06em;
  }}

  .cart-drawer {{
    width: calc(100vw - 24px);
    max-height: calc(100dvh - 24px);
    padding: 17px 14px;
    border-radius: 19px;
  }}

  .drawer-header {{
    padding-bottom: 13px;
  }}

  .drawer-header h2 {{
    font-size: 24px;
  }}
}}

/* Remove somente o + que fica sobre a imagem */
.menu-card-image .add-item {{
  display: none !important;
}}
"""

# Salva os três arquivos somente depois das verificações.
html_path.write_text(html, encoding="utf-8")
css_path.write_text(css, encoding="utf-8")
js_path.write_text(js, encoding="utf-8")

print("\\nSUCESSO: os quatro ajustes foram aplicados.")
print("Logo ampliada e nome Donna Luiza no cabeçalho.")
print("Carrinho compacto em formato de card.")
print("Botão + sobre as fotos removido.")
print("Botão Adicionar abaixo dos produtos preservado.")
print("Backups disponíveis para restauração.")
