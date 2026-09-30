#!/usr/bin/env bash
# Auto-sync do Ratos OS: traz o que mudou no GitHub, confere e manda o que mudou aqui.
# Quem chama é o agendador do computador (cron no Mac/Linux, Agendador de Tarefas no Windows).
# Na dúvida, para e deixa recado. Nunca força, nunca apaga, nunca junta arquivo sozinho.
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

root="$(cd "$(dirname "$0")/../.." && pwd)" || exit 1
cd "$root" || exit 1

log="$root/.auto-sync.log"
agora="$(date '+%Y-%m-%d %H:%M')"
hoje="$(date '+%Y-%m-%d')"
origem="$(tr -d '[:space:]' < .origem 2>/dev/null)"
[ -n "$origem" ] || origem="sem-origem"

# Sinal de vida: toda rodada marca a hora aqui, mesmo sem nada pra subir (fica fora do GitHub).
echo "$agora" > .git/auto-sync-ultima-rodada 2>/dev/null

anota() { echo "[$agora] $*" >> "$log"; }

# Para, anota no log e deixa um recado (um por dia) pro /iniciar mostrar na próxima sessão.
para() {
  anota "PAROU: $1"
  recado="_memoria/recados/$hoje-$origem-auto-sync-parado.md"
  if [ -d _memoria/recados ] && [ ! -f "$recado" ]; then
    printf 'de: auto-sync (%s)\nquando: %s\nprecisa de ação: sim\n\nO envio automático pro GitHub parou: %s\n\nNada foi apagado. Abra o agente e peça "/syncar" que ele resolve com você. Detalhes em .auto-sync.log\n' \
      "$origem" "$agora" "$1" > "$recado"
  fi
  exit 1
}

# Falha passageira (internet, GitHub fora): só anota. A próxima rodada tenta de novo.
tenta_depois() { anota "tentar de novo: $1"; exit 1; }

# Uma rodada por vez. Trava com mais de 1h é resto de rodada que morreu no meio.
trava="$root/.git/auto-sync.lock"
if ! mkdir "$trava" 2>/dev/null; then
  if [ -n "$(find "$trava" -maxdepth 0 -mmin +60 2>/dev/null)" ]; then
    rmdir "$trava" 2>/dev/null; mkdir "$trava" 2>/dev/null || exit 0
  else
    exit 0
  fi
fi
trap 'rmdir "$trava" 2>/dev/null' EXIT

# Tem uma junção pela metade (de uma rodada ou sessão anterior)? Não mexe.
if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ] || [ -f .git/MERGE_HEAD ] \
   || [ -n "$(git diff --name-only --diff-filter=U)" ]; then
  para "tem arquivo esperando você decidir entre duas versões."
fi

# 1. Traz o que mudou no GitHub.
saida="$(git pull --rebase --autostash origin main 2>&1)"; ok=$?
if [ $ok -ne 0 ]; then
  echo "$saida" >> "$log"
  git rebase --abort 2>/dev/null
  case "$saida" in
    *"Could not resolve host"*|*"unable to access"*|*"Connection"*|*"timed out"*|*"Operation timed out"*|*"Could not read from remote"*)
      tenta_depois "não alcancei o GitHub." ;;
    *[Aa]uthentication*|*"Permission denied"*|*403*)
      para "o GitHub recusou o acesso deste computador (login vencido ou sem permissão no repositório)." ;;
    *CONFLICT*|*"would be overwritten"*|*"could not apply"*|*"unmerged"*)
      para "o mesmo arquivo mudou aqui e no GitHub (ou nasceu com o mesmo nome nos dois). Nada foi enviado." ;;
    *) para "o git respondeu algo que eu não sei resolver sozinho. Nada foi enviado." ;;
  esac
fi

# O autostash pode esbarrar e o pull sai com sucesso mesmo assim. Essa trava é obrigatória.
if [ -n "$(git diff --name-only --diff-filter=U)" ]; then
  para "o mesmo arquivo mudou aqui e no GitHub: $(git diff --name-only --diff-filter=U | tr '\n' ' ')"
fi

# Chegou até aqui, o caminho está livre: o recado de parada desta máquina sai antes de salvar.
rm -f _memoria/recados/*-"$origem"-auto-sync-parado.md 2>/dev/null

# 2. Tem mudança aqui? Confere antes de salvar: segredo e arquivo pesado não sobem.
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  suspeitos=""
  pesados=""
  while IFS= read -r arq; do
    [ -f "$arq" ] || continue
    if grep -qIE 'sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----' "$arq" 2>/dev/null; then
      suspeitos="$suspeitos $arq"
    fi
    if [ "$(wc -c < "$arq")" -gt 52428800 ]; then
      pesados="$pesados $arq"
    fi
  done < <(git diff --cached --name-only --diff-filter=ACM)

  if [ -n "$suspeitos" ]; then
    git reset -q
    para "achei cara de chave ou senha em:$suspeitos. Nada foi enviado."
  fi
  if [ -n "$pesados" ]; then
    git reset -q
    para "arquivo pesado demais pro GitHub (mais de 50 MB):$pesados. Nada foi enviado."
  fi

  # 3. Salva uma versão, assinada com a origem desta máquina.
  qtd="$(git diff --cached --name-only | wc -l | tr -d ' ')"
  git commit -q -m "auto-sync ($origem): $agora" || para "não consegui salvar a versão."
  anota "salvo: $qtd arquivo(s)."
fi

# 4. Manda o que está salvo aqui e ainda não foi (inclusive de rodada que caiu antes). Só pra frente.
if [ "$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 1)" -gt 0 ]; then
  git push -q origin main >> "$log" 2>&1 || tenta_depois "salvei aqui, mas não consegui mandar pro GitHub."
  anota "ok: enviado pro GitHub."
fi

exit 0
