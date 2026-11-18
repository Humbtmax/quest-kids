#!/usr/bin/env python3
"""Gera en/index.html a partir de index.html (português), para as duas versões ficarem SEMPRE iguais.
Uso: python3 tools/gerar_en.py   (rodar na pasta do repositório depois de mudar index.html)
Textos novos sem tradução aparecem na tela e o script para (acrescente em tools/en_textos.py)."""
import re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from en_textos import T
raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(raiz, 'index.html'), encoding='utf-8').read()
norm = lambda x: re.sub(r'\s+', ' ', x).strip()
TN = {norm(k): v for k, v in T.items()}

# 1) preço de fundador só existe no Brasil (em reais): tira as linhas
s = '\n'.join(l for l in s.split('\n') if not re.search(r'Fundador:|Preço de fundador', l))

faltam = []
# 2) textos entre tags (fora de <script> e <style>)
partes = re.split(r'(<script\b.*?</script>|<style\b.*?</style>)', s, flags=re.S)
def troca_txt(m):
    bruto = m.group(1); k = norm(bruto)
    if not k or not re.search(r'[A-Za-zÀ-ú0-9]', k) or re.fullmatch(r'[a-z_]+', k): return m.group(0)
    if k in TN:
        ini = bruto[:len(bruto) - len(bruto.lstrip())]; fim = bruto[len(bruto.rstrip()):]
        return '>' + ini + TN[k] + fim + '<'
    if re.search(r'[A-Za-zÀ-ú]', k) and not re.fullmatch(r'[\d\s.,:+%m→✨/–\-•·]+', k): faltam.append(k)
    return m.group(0)
for i in range(0, len(partes), 2):
    partes[i] = re.sub(r'>([^<>]+)<', troca_txt, partes[i])
s = ''.join(partes)
# 3) atributos com texto
def troca_attr(m):
    k = norm(m.group(2))
    return m.group(1) + '="' + TN[k] + '"' if k in TN else m.group(0)
s = re.sub(r'\b(alt|title|placeholder|aria-label|content)="([^"]*)"', troca_attr, s)
# 4) textos dentro do JavaScript do controle de tempo
s = s.replace('`${val} min / dia`', '`${val} min / day`')
# 5) idioma, caminhos e links (a página inglesa fica em /en/)
s = s.replace('<html lang="pt-BR"', '<html lang="en"')
s = s.replace('<link rel="alternate" hreflang="en" href="en/"/>', '<link rel="alternate" hreflang="pt-BR" href="../"/>')
s = s.replace('href="en/"', 'href="../"')
s = s.replace('lang=pt"', 'lang=en"').replace('lang=pt&', 'lang=en&')
s = re.sub(r'(href|src)="app/', r'\1="../app/', s)
s = s.replace('href="termos.html"', 'href="../termos.html#en"').replace('href="privacidade.html"', 'href="../privacidade.html#en"')
s = s.replace('content="og.png"', 'content="../og.png"')
s = s.replace('data-base=""', 'data-base="../"')
if faltam:
    print('SEM TRADUÇÃO (acrescente em tools/en_textos.py):'); [print(' -', f) for f in dict.fromkeys(faltam)]; sys.exit(1)
open(os.path.join(raiz, 'en', 'index.html'), 'w', encoding='utf-8').write(s)
print('OK: en/index.html gerado a partir de index.html')
