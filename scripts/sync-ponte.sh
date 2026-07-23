#!/usr/bin/env bash
# Sincroniza .agents/skills (ponte pro Codex) com .claude/skills (fonte).
# Mac/Linux: symlink (auto-fresh, nada a fazer). Windows sem symlink cai na cópia.
# Idempotente: pode rodar quantas vezes quiser.
set -e
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
mkdir -p .agents

# Já é symlink? Reflete .claude/skills sozinho, nada a fazer.
if [ -L .agents/skills ]; then
  echo "ponte ok (symlink)"; exit 0
fi

# Não existe? Tenta symlink; se falhar, cópia.
if [ ! -e .agents/skills ]; then
  if ln -sfn ../.claude/skills .agents/skills 2>/dev/null; then
    echo "ponte criada (symlink)"; exit 0
  fi
fi

# É pasta real (cópia, tipicamente Windows): re-sincroniza do zero.
rm -rf .agents/skills
cp -R .claude/skills .agents/skills
echo "ponte sincronizada (cópia)"
