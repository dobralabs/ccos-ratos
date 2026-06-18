# DobraLabs — Claude Code OS

## O que é esse workspace
Workspace de trabalho do Eduardo (DobraLabs). Aqui ficam os projetos de clientes (dev de software e consultoria), a produção de conteúdo do canal Ratos de IA, propostas, reuniões e relatórios.

**Estrutura de pastas:**
- `_contexto/` — memória do sistema (não apagar)
- `marca/` — identidade visual e logos da DobraLabs
- `clientes/` — uma pasta por cliente (dev e consultoria); `_modelo-cliente/` é o template
- `conteudo/` — produção do Ratos de IA (`roteiros/`, `carrosseis/`, `ideias/`)
- `propostas/` — propostas avulsas antes de virar cliente
- `reunioes/` — atas e anotações de reunião
- `relatorios/` — relatórios e análises
- `dados/` — drop zone pra arquivos analisar (CSV, XLSX, TXT, PDF)
- `templates/skills/` — templates de skills prontos pra personalizar com /mapear
- `templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis pra usar em skills
- `tarefas.md` — lista de tarefas corrente

## Sobre o negócio
DobraLabs presta serviços de desenvolvimento de software e consultoria pra clientes, e mantém o canal Ratos de IA no YouTube. Operação solo: o Eduardo toca tudo.

## O que mais fazemos aqui
- Conteúdo pra redes sociais (foco no YouTube Ratos de IA)
- Propostas comerciais e apresentações comerciais
- Relatórios e análises
- Muitas reuniões (atas e follow-ups)

## Clientes e contexto
Atende clientes externos de dev de software e consultoria, e usa o sistema também pra gerir o próprio negócio. Cada cliente tem sua pasta em `clientes/[nome-cliente]/`.

## Tom de voz
Informal e direto, como quem fala. Evitar travessão (—), frases-fragmento curtas em série, e dicotomias do tipo "não é isso, é aquilo". Detalhes em `_contexto/preferencias.md`.

## Ferramentas conectadas
- [ ] Google Drive
- [ ] Gmail
- [ ] Canva
- [ ] Meta Ads (skill /meta-ads-ratos)
- [ ] Google Ads (skill /google-ads-ratos)

*(Marcar conforme for instalando os MCPs)*

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (se existirem e estiverem configurados):

1. `_contexto/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_contexto/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_contexto/estrategia.md` — foco atual, prioridades, o que pode esperar

Usar essas informações como base pra qualquer resposta ou decisão. Ao sugerir prioridades, formatos ou abordagens, considerar o foco atual descrito em `estrategia.md`.

Para qualquer tarefa visual (carrossel, proposta, slide, landing page), consultar `marca/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe uma skill relevante em `.claude/skills/` ou `.claude/commands/`.
Se encontrar, seguir as instruções da skill.
Se não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível, perguntar se o usuário quer transformar em skill. Não perguntar pra tarefas pontuais.

---

## Regras do sistema

- Cada cliente tem sua pasta em `clientes/[nome-cliente]/` (briefing.md + proposta.html)
- Propostas de cliente salvar em `clientes/[nome-cliente]/proposta.html`
- Conteúdo do Ratos de IA vai em `conteudo/`
- Atas de reunião vão em `reunioes/`
- Relatórios e análises vão em `relatorios/`

---

## Aprender com correções

Quando o usuário corrigir algo ou der uma instrução que parece permanente ("na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita..."), perguntar se quer salvar. Se sim:

- **Sobre o negócio** → `_contexto/empresa.md`
- **Preferências e estilo** → `_contexto/preferencias.md`
- **Prioridades e foco atual** → `_contexto/estrategia.md`
- **Regra de comportamento nessa pasta** → este `CLAUDE.md`
- **Mudança visual** → `marca/design-guide.md`

Salvar só a linha nova, sem reformatar o arquivo inteiro.
