---
name: iniciar
description: Inicia a sessão de trabalho lendo o contexto do negócio e ajudando o usuário a começar. Usar no começo de cada sessão nova do Claude Code.
---

# Skill: /iniciar

Use essa skill no começo de cada sessão de trabalho.

## O que fazer

1. Verificar se `_contexto/empresa.md` existe e está configurado (sem `<!-- NOT CONFIGURED -->`)
2. Verificar se `_contexto/preferencias.md` existe e está configurado
3. Verificar se `_contexto/estrategia.md` existe e está configurado
4. Ler `_contexto/agora.md` (contexto vivo: onde paramos, decisões recentes, pendências) se estiver configurado
5. Ler AGENTS.md se existir
6. Apresentar um resumo de contexto e perguntar o que o usuário quer fazer

## Fluxo

### Se os arquivos de memória existem e estão configurados

Leia `_contexto/empresa.md`, `_contexto/preferencias.md`, `_contexto/estrategia.md` e, se configurado, `_contexto/agora.md`.

Apresente um resumo curto e direto no formato:

```
Tudo certo. Contexto carregado:

**Negócio:** [nome e o que faz, em uma linha]
**Foco agora:** [prioridade principal de estrategia.md — se não configurado, omitir essa linha]
**Onde paramos:** [de agora.md — a última coisa em andamento; omitir se agora.md não configurado]
**Pendências:** [de agora.md — até 2 itens em aberto mais relevantes; omitir se não houver]
**Lembretes:** [qualquer preferência importante, ex: "sem travessões", "responder em PT"]

O que você quer fazer hoje?
```

Mantenha o resumo enxuto (até 6 linhas). Não reescreva tudo que está nos arquivos, só o essencial pra retomar.

### Se os arquivos de memória não existem ou têm `<!-- NOT CONFIGURED -->`

Avise o usuário:

```
Parece que o sistema ainda não foi configurado.
Rode /setup pra eu aprender sobre o seu negócio — leva uns 5 minutos.
Depois de configurado, o /iniciar vai funcionar completo.
```

## Comportamento

- Tom direto, sem enrolação. Não diga "Olá! Fico feliz em ajudar!"
- Não liste os arquivos que foram lidos. Só mostre o que importa.
- Se houver tarefas pendentes em `tarefas.md`, mencione até 3 itens no topo
- Após o resumo, aguarde o usuário responder o que quer fazer
