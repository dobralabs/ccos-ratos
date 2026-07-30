#!/usr/bin/env bash
# Sincroniza .agents/skills (ponte pro Codex) com .claude/skills (fonte).
# Mac/Linux: symlink (auto-fresh, nada a fazer). Windows: use sync-ponte.ps1 (ver abaixo).
# Idempotente: pode rodar quantas vezes quiser.
set -e
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

# No Windows (inclusive Git Bash), ln -s sem privilégio elevado ou Developer Mode
# falha silenciosamente: retorna exit 0 mas não cria link nenhum, só deixa o
# caminho livre pra próxima etapa criar uma pasta comum. Sem essa checagem o
# script reportava "symlink criado" quando na real era cópia — recusar aqui e
# apontar pro .ps1, que usa junction (não exige privilégio nenhum no Windows).
case "$(uname -s 2>/dev/null)" in
  MINGW*|MSYS*|CYGWIN*)
    echo "Windows detectado — use scripts\\sync-ponte.ps1 (via PowerShell), não este .sh." >&2
    echo "Ele cria uma junction, que não exige privilégio elevado nem Developer Mode." >&2
    exit 1
    ;;
esac

mkdir -p .agents

# Já é symlink? Reflete .claude/skills sozinho, nada a fazer.
if [ -L .agents/skills ]; then
  echo "ponte ok (symlink)"; exit 0
fi

# Não existe? Tenta symlink; confirmar que virou link de fato (ln -s pode retornar
# sucesso sem criar nada em ambientes sem suporte).
if [ ! -e .agents/skills ]; then
  ln -sfn ../.claude/skills .agents/skills 2>/dev/null || true
  if [ -L .agents/skills ]; then
    echo "ponte criada (symlink)"; exit 0
  fi
fi

# É pasta real (cópia): re-sincroniza do zero.
rm -rf .agents/skills
cp -R .claude/skills .agents/skills
echo "ponte sincronizada (cópia)"
