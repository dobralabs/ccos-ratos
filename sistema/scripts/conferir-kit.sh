#!/usr/bin/env bash
# Trava de build do kit RatosOS. Não conserta nada: só diz o que está fora da regra.
# Roda na raiz do kit (ou de uma instalação). Mac, Linux e Git Bash; só precisa de grep.
#   bash sistema/scripts/conferir-kit.sh
#   bash <kit>/sistema/scripts/conferir-kit.sh   (de dentro de uma instalação: confere ela)
set -u
# Pasta atual com AGENTS.md é uma instalação: confere ela. Senão, o kit onde o script mora.
[ -f AGENTS.md ] || cd "$(dirname "$0")/../.." || exit 1
erros=0; avisos=0
falha(){ echo "  ✗ $1"; erros=$((erros+1)); }
aviso(){ echo "  · $1"; avisos=$((avisos+1)); }
echo "Conferindo o kit em $(pwd)"

# 1. ponteiro e teto
[ "$(tr -d '[:space:]' < CLAUDE.md 2>/dev/null)" = "@AGENTS.md" ] || falha "CLAUDE.md tem que ter uma linha só: @AGENTS.md"
teto=$(grep -o 'Teto deste arquivo: [0-9]*' AGENTS.md | grep -o '[0-9]*$')
linhas=$(wc -l < AGENTS.md | tr -d ' ')
[ -n "${teto:-}" ] || falha "AGENTS.md não declara o teto na primeira linha"
[ -n "${teto:-}" ] && [ "$linhas" -gt "$teto" ] && falha "AGENTS.md com $linhas linhas, teto $teto"

# 2. versão e changelog batem
versao=$(tr -d '[:space:]' < .ratosos 2>/dev/null)
[ -n "${versao:-}" ] || falha "falta o .ratosos com a versão"
[ -n "${versao:-}" ] && [ ! -f "sistema/changelog/$versao.md" ] && falha "falta sistema/changelog/$versao.md (a versão do .ratosos é $versao)"
[ -f sistema/changelog/COMO-ATUALIZAR.md ] || falha "falta sistema/changelog/COMO-ATUALIZAR.md"

# 3. lei de admissão: toda gaveta tem gatilho de leitura (boot ou mapa) E de escrita (tabela)
secao(){ awk -v a="$1" -v b="$2" '$0 ~ a {p=1} $0 ~ b {p=0} p' AGENTS.md; }
leitura=$(secao '^## 2\.' '^## 5\.')      # boot + mapa + gatilhos
escrita=$(secao '^## 5\.' '^## 6\.')      # tabela de destinos
for g in _contexto/empresa.md _contexto/preferencias.md _contexto/agora.md _contexto/estrategia.md \
         _contexto/ferramentas.md _contexto/infra.md _contexto/marca/ _contexto/pessoas/ \
         _memoria/diario/ _memoria/decisoes.md _memoria/recados/; do
  echo "$leitura" | grep -q -- "$g" || falha "gaveta sem gatilho de leitura no AGENTS.md: $g"
  echo "$escrita" | grep -q -- "$g" || falha "gaveta sem linha na tabela de destinos: $g"
done
for g in _contexto/empresa.md _contexto/preferencias.md _contexto/estrategia.md _contexto/ferramentas.md \
         _contexto/infra.md _contexto/agora.md _contexto/marca/design-guide.md _memoria/decisoes.md; do
  [ -e "$g" ] || falha "gaveta declarada no AGENTS.md não existe no disco: $g"
done
[ -d _contexto/pessoas ] && aviso "_contexto/pessoas/ existe no kit: ela não nasce, aparece no 1º arquivo de pessoa"
[ -d dados ] && falha "dados/ ainda existe (morreu na 2.0)"
[ -f tarefas.md ] && falha "tarefas.md no kit (pendência mora no agora.md)"

# 3b. ponte do Codex: script sobe dois níveis, nada sobrando em sistema/, e a da raiz abre
grep -q '/\.\./\.\.' sistema/scripts/sync-ponte.sh 2>/dev/null || falha "sync-ponte.sh acha a raiz um nível só acima (script da 1.0 em sistema/scripts/): copiar o do kit"
grep -q 'Split-Path -Parent (Split-Path -Parent' sistema/scripts/sync-ponte.ps1 2>/dev/null || falha "sync-ponte.ps1 acha a raiz um nível só acima (script da 1.0 em sistema\\scripts\\): copiar o do kit"
[ -e sistema/.agents ] || [ -L sistema/.agents ] && falha "sistema/.agents existe: ponte criada no lugar errado, apagar"
if [ -L .agents/skills ] || [ -e .agents/skills ]; then
  [ -d .agents/skills ] || falha ".agents/skills na raiz existe mas não abre (atalho quebrado): rodar a ponte de novo"
else
  aviso ".agents/skills na raiz não existe: o Codex não enxerga as skills até a ponte rodar"
fi

# 4. arquivo de _contexto/ e _memoria/ diz quem o alimenta
for f in _contexto/*.md _contexto/marca/design-guide.md _memoria/decisoes.md; do
  head -1 "$f" | grep -q 'quem alimenta' || falha "sem comentário 'quem alimenta' no topo: $f"
done

# 5. nenhum caminho fixo velho em skill (a regra: cita a gaveta pelo nome do mapa)
if grep -rnE '`marca/design-guide|marca/design-guide\.md|dados/|`templates/|`scripts/| scripts/sync-ponte|tarefas\.md|git add -A cego|está seguro em' \
     .claude/skills sistema/templates/skills 2>/dev/null | grep -v 'sistema/scripts/\|sistema/templates/\|nunca `git add -A`\|Nada de `git add -A`\|`git add -A` só depois\|`git add -A` sem antes\|nem `dados/`\|Nada de `tarefas\|dentro da pasta\|na pasta\|própria' ; then
  falha "caminho fixo velho (ou frase proibida) em skill; ver linhas acima"
fi

# 6. toda skill tem name e description
for s in .claude/skills/*/SKILL.md; do
  grep -q '^name:' "$s" || falha "sem name: $s"
  grep -q '^description:' "$s" || falha "sem description: $s"
done

# 7. .gitignore: o trabalho sobe, o segredo não
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  for deve_subir in clientes/x/proposta.html _memoria/diario/2026-01-01.md .claude/skills/minha/SKILL.md .ratosos sistema/scripts/sync-ponte.sh clientes/x/contrato.pdf; do
    git check-ignore -q "$deve_subir" && falha ".gitignore bloqueia coisa que devia subir: $deve_subir"
  done
  for nao_sobe in .env .env.local .origem .claude/settings.local.json video.mp4 backup.zip node_modules/x.js; do
    git check-ignore -q "$nao_sobe" || falha ".gitignore deixa subir coisa que não devia: $nao_sobe"
  done
fi

# 8. bem-vindo: modelo com os campos que o /setup preenche
for campo in NOME NEGOCIO RESUMO SABERES PASTAS PASSOS COR_FUNDO COR_DESTAQUE FONTE_TITULO_URL; do
  grep -q "{{$campo}}" sistema/templates/bem-vindo.template.html || falha "modelo do bem-vindo sem o campo {{$campo}}"
done
[ -f bem-vindo.html ] && grep -q '{{' bem-vindo.html && falha "bem-vindo.html gerado com campo sem preencher"

# 9. travessão em texto que o aluno lê (só aviso: o kit 1.0 tem muito)
n=$(grep -rl '—' AGENTS.md README.md _contexto _memoria .claude/skills sistema/changelog 2>/dev/null | wc -l | tr -d ' ')
[ "$n" -gt 0 ] && aviso "$n arquivo(s) com travessão (—) fora dos modelos antigos: $(grep -rl '—' AGENTS.md README.md _contexto _memoria .claude/skills sistema/changelog 2>/dev/null | tr '\n' ' ')"

echo
if [ "$erros" -eq 0 ]; then echo "  ✓ kit íntegro ($avisos aviso(s))"; exit 0; fi
echo "  $erros problema(s), $avisos aviso(s). Conserte antes de dizer que terminou."; exit 1
