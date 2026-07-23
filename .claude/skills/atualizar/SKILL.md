---
name: atualizar
description: >
  Varre o estado atual do projeto e atualiza os arquivos de contexto que ficaram
  desatualizados. Compara o que existe nas pastas, skills e configurações com o que
  está documentado em AGENTS.md, _contexto/ e marca/design-guide.md.
  Use quando o usuário chamar /atualizar, quando disser "atualiza o contexto",
  "os arquivos tão desatualizados", "sincroniza a memória", ou no fim de uma sessão
  longa com muitas mudanças.
---

# /atualizar — Manutenção de Contexto

## O que fazer

Fazer uma varredura comparando o **estado real do projeto** com o que está **documentado nos arquivos de contexto**. Identificar diferenças e propor atualizações pro usuário aprovar.

## Passo 0: Sincronizar a ponte de skills (rápido, silencioso)

Garantir que o Codex enxerga as skills que existem hoje. Rodar o script (idempotente — no Mac/Linux
é symlink e vira no-op; no Windows-cópia re-sincroniza skills novas):

```bash
bash scripts/sync-ponte.sh        # Mac/Linux ou Git Bash
```
```powershell
powershell -ExecutionPolicy Bypass -File scripts\sync-ponte.ps1   # Windows
```

Não precisa reportar isso ao usuário, só rodar.

## Passo 1: Levantar o estado real

Ler e anotar:

1. **Estrutura de pastas** — listar os diretórios de primeiro nível (ignorar `.git`, `node_modules`, `.claude`, `templates`, `dados`)
2. **Skills instaladas** — listar `.claude/skills/*/` (exceto as skills do kit: setup, iniciar, syncar, mapear, novo-projeto, atualizar)
3. **MCPs configurados** — verificar se `.claude.json` ou `.claude/mcp.json` existe e quais servers estão listados
4. **Arquivos recentes** — usar `git diff --name-only HEAD~5..HEAD` (ou menos commits se não tiver 5) pra ver o que mudou recentemente
5. **Mudanças não commitadas** — `git status` pra ver trabalho em andamento

## Passo 2: Ler os arquivos de contexto

Ler cada um dos arquivos abaixo (se existir):

1. `AGENTS.md` — foco em: estrutura de pastas, lista de skills, ferramentas conectadas, regras do sistema
2. `_contexto/empresa.md` — foco em: equipe, ferramentas, entregas, clientes
3. `_contexto/estrategia.md` — foco em: prioridade principal, fase, o que pode esperar
4. `_contexto/preferencias.md` — foco em: tom de voz, o que evitar
5. `_contexto/agora.md` — contexto vivo: onde paramos, decisões recentes, pendências, o que está quente
6. `marca/design-guide.md` — foco em: cores, fontes, estilo

## Passo 1.5: Atualizar o contexto vivo (`agora.md`)

Isto é o "fechar a sessão": capturar o que aconteceu nesta conversa pro próximo `/iniciar` retomar rápido.
Diferente do resto do `/atualizar` (que compara pastas com docs), aqui você escreve a partir da **conversa atual**.

Olhando o que rolou nesta sessão, atualizar `_contexto/agora.md`:

- **Onde paramos:** a última coisa em andamento (substitui a anterior).
- **Decisões recentes:** se alguma decisão foi tomada, adicionar uma linha com a data (`AAAA-MM-DD — decisão`).
- **Pendências:** adicionar o que ficou em aberto; remover o que foi resolvido.
- **Quente agora:** ajustar o que está ativo esta semana.
- **Higiene:** o que passou de ~30 dias em "Decisões recentes" e "Quente agora" sai daqui (some, ou vai pra um `_contexto/historico.md` se o usuário quiser guardar). Manter o arquivo curto.

Só escrever se houve algo digno de nota na sessão. Sessão trivial (uma pergunta, um email avulso) não mexe no `agora.md`.
Mostrar ao usuário as linhas que vão mudar antes de salvar, igual ao resto do `/atualizar`.

## Passo 3: Comparar e identificar gaps

Para cada arquivo de contexto, verificar:

### AGENTS.md
- Pastas listadas na estrutura batem com as pastas reais?
- Skills mencionadas existem de fato? Tem skills novas não documentadas?
- Ferramentas marcadas como conectadas estão de fato configuradas (MCPs)?
- Regras do sistema ainda fazem sentido com o estado atual?

### _contexto/empresa.md
- Ferramentas listadas incluem tudo que o usuário instalou (MCPs)?
- Clientes ou projetos mencionados ainda são atuais?
- Equipe mudou?

### _contexto/estrategia.md
- A prioridade principal ainda parece ser o foco (baseado nos arquivos recentes)?
- Tem prazos vencidos ou contextos datados?

### _contexto/preferencias.md
- (Esse raramente muda, mas verificar se tem algo contraditório com o uso recente)

### marca/design-guide.md
- Está preenchido ou ainda é template vazio?
- Se tem logo referenciado, o arquivo existe?

## Passo 4: Apresentar o diagnóstico

Mostrar um resumo organizado no formato:

```
## Diagnóstico de contexto

### Em dia
- [lista do que está atualizado]

### Desatualizado
- **[arquivo]:** [o que está errado e o que deveria ser]
- **[arquivo]:** [o que está errado e o que deveria ser]

### Não configurado
- [arquivos que existem mas estão vazios ou com template padrão]
```

Se tudo estiver em dia, dizer:

> "Tudo atualizado. Os arquivos de contexto refletem o estado atual do projeto."

## Passo 5: Aplicar as correções (com aprovação)

Para cada item desatualizado, mostrar a mudança proposta:

> **`_contexto/empresa.md`** — adicionar "Canva" na lista de ferramentas
>
> **`AGENTS.md`** — adicionar pasta `relatorios/` na estrutura de pastas

Perguntar:

> "Quer que eu aplique essas atualizações?"

Se sim, aplicar todas de uma vez. Mostrar um resumo do que foi atualizado.
Se o usuário quiser aprovar uma a uma, respeitar.

## Regras

- Nunca reformatar um arquivo inteiro. Só editar as linhas relevantes
- Se não tem certeza se algo mudou, perguntar ao usuário em vez de assumir
- Não inventar informação. Se não consegue inferir do estado do projeto, perguntar
- Tom direto. Não exagerar no diagnóstico de coisas triviais
- Se o projeto acabou de ser configurado (setup recente, poucos commits), dizer que está tudo certo e não forçar atualizações desnecessárias
