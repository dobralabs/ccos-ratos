# Catalogo de Skills

Skills externas prontas pra instalar. Use como referencia ao criar skills novas com `/mapear` ou instale diretamente as que fizerem sentido pro seu negocio.

> Skills globais ficam em `~/.claude/skills/` e funcionam em qualquer projeto.
> Skills locais ficam em `.claude/commands/` e so funcionam nesse projeto.

---

## Escrever copy e textos de venda

### Schwartz Copy (resposta direta)
**O que faz:** Escreve copy de vendas usando a metodologia de Eugene Schwartz (Breakthrough Advertising). Diagnostica o nivel de consciencia e sofisticacao do mercado antes de gerar qualquer texto.
**Bom pra:** Landing pages, emails de venda, VSLs, cartas de venda, paginas de captura
**Como instalar:** Ja vem como skill global. Chamar com `/schwartz-copy`
**Fonte:** Skill validada pelo curso Claude Code OS

### Ogilvy Copy (marca e posicionamento)
**O que faz:** Gera copy institucional usando a metodologia de David Ogilvy. Pesquisa profunda, big idea, headlines informativas.
**Bom pra:** Manifestos de marca, campanhas institucionais, taglines, brand voice, posicionamento
**Como instalar:** Ja vem como skill global. Chamar com `/ogilvy-copy`
**Fonte:** Skill validada pelo curso Claude Code OS

---

## Criar interfaces e paginas web

### Frontend Design
**O que faz:** Cria interfaces web completas com design de alta qualidade. Gera codigo HTML/CSS/React pronto pra usar, com visual profissional que foge da estetica generica de IA.
**Bom pra:** Landing pages, dashboards, componentes web, paginas de produto
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/frontend-design`
**Fonte:** Skill nativa do Claude Code

---

## Criar visuais e arte

### Canvas Design
**O que faz:** Cria arte visual em PNG e PDF usando principios de design. Posters, capas, pecas graficas.
**Bom pra:** Capas de ebook, banners, pecas visuais, thumbnails
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/canvas-design`
**Fonte:** Skill nativa do Claude Code

---

## Trabalhar com documentos

### PDF
**O que faz:** Manipula PDFs: extrai texto e tabelas, cria novos, junta/separa documentos, preenche formularios.
**Bom pra:** Extrair dados de contratos, criar relatorios em PDF, preencher formularios
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/pdf`
**Fonte:** Skill nativa do Claude Code

### DOCX
**O que faz:** Cria e edita documentos Word com formatacao, tracked changes e comentarios.
**Bom pra:** Propostas formais, contratos, documentos pra clientes que pedem Word
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/docx`
**Fonte:** Skill nativa do Claude Code

### PPTX
**O que faz:** Cria e edita apresentacoes PowerPoint com layouts, speaker notes e formatacao.
**Bom pra:** Apresentacoes pra clientes, decks de vendas, materiais de treinamento
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/pptx`
**Fonte:** Skill nativa do Claude Code

### XLSX
**O que faz:** Cria e edita planilhas com formulas, formatacao e graficos.
**Bom pra:** Relatorios financeiros, dashboards em planilha, analise de dados
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/xlsx`
**Fonte:** Skill nativa do Claude Code

---

## Escrever documentos e specs

### Doc Co-Authoring
**O que faz:** Fluxo guiado pra coescrever documentos. Te entrevista, itera rascunhos, e valida que o documento funciona pro leitor.
**Bom pra:** Propostas tecnicas, specs, documentos de decisao, SOPs
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/doc-coauthoring`
**Fonte:** Skill nativa do Claude Code

---

## Extrair transcricao de video

### YT Transcript
**O que faz:** Extrai transcricoes de videos do YouTube usando yt-dlp. Suporta multiplos idiomas.
**Bom pra:** Criar conteudo a partir de videos (carrosseis, newsletters, posts)
**Precisa de:** yt-dlp instalado (`brew install yt-dlp`)
**Como instalar:** Ja vem como skill global. Chamar com `/yt-transcript`
**Fonte:** Skill validada pelo curso Claude Code OS

### Transcribe
**O que faz:** Transcreve videos de qualquer plataforma (YouTube, Instagram, TikTok, X/Twitter, Vimeo e 1000+ sites) usando yt-dlp + Whisper. Mais robusta que YT Transcript.
**Bom pra:** Transcrever Reels, TikToks, posts de X/Twitter com video, qualquer URL de video
**Precisa de:** yt-dlp + ffmpeg (a skill faz setup automatico)
**Como instalar:** `git clone https://github.com/duduesh/transcribe ~/.claude/skills/transcribe`
**Fonte:** Skill da Ratos de IA, repo publico

---

## Trafego pago e analytics

### GA4 Ratos
**O que faz:** Le dados do Google Analytics 4 via API oficial. 13 subcomandos: realtime, landing pages, conversoes, fontes de trafego, comportamento.
**Bom pra:** Relatorios de trafego, dashboards de site, analise de campanhas UTM, tempo real
**Precisa de:** Service account com acesso de leitura na propriedade GA4
**Como instalar:** `git clone https://github.com/duduesh/ga4-ratos ~/.claude/skills/ga4-ratos`. Setup conversacional na primeira vez
**Fonte:** Skill da Ratos de IA, repo publico

### Ads Ratos (cerebro orquestrador)
**O que faz:** Diagnostico, relatorio, auditoria e estrategia para Meta Ads e Google Ads. Usa benchmarks brasileiros, Quality Gates e Health Score. Orquestra `meta-ads-ratos`, `google-ads-ratos` e `ga4-ratos`.
**Bom pra:** Diagnostico de conta, relatorio de performance, auditoria de tragefo, identificar problemas de campanha
**Como instalar:** `git clone https://github.com/duduesh/ads-ratos ~/.claude/skills/ads-ratos`
**Fonte:** Skill da Ratos de IA, repo publico

### Meta Ads Ratos
**O que faz:** Gerencia campanhas Meta Ads (Facebook/Instagram) via SDK oficial. 43 subcomandos: CRUD completo, targeting, criativos, insights, duplicar campanhas, trocar URL tags.
**Bom pra:** Gestao de Meta Ads, criar/pausar campanhas, ajustar orcamento, ler metricas
**Precisa de:** Token Meta Business
**Como instalar:** `git clone https://github.com/duduesh/meta-ads-ratos ~/.claude/skills/meta-ads-ratos`
**Fonte:** Skill da Ratos de IA, repo publico

### Google Ads Ratos
**O que faz:** Gerencia campanhas Google Ads via SDK oficial. 30 subcomandos: GAQL, CRUD, Quality Score, Keyword Planner com volume e CPC.
**Bom pra:** Gestao de Google Ads, pesquisa de keywords, relatorios via GAQL, monitorar quality score
**Precisa de:** Conta Google Ads + developer token
**Como instalar:** `git clone https://github.com/duduesh/google-ads-ratos ~/.claude/skills/google-ads-ratos`
**Fonte:** Skill da Ratos de IA, repo publico

---

## Descobrir e fazer fetch de docs

### Find Skills
**O que faz:** Ajuda a descobrir e instalar skills quando voce nao sabe se existe alguma pra resolver o que precisa. Funciona como um buscador de skills.
**Bom pra:** Quando o `/mapear` nao acha template e voce quer pesquisar antes de criar do zero
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/find-skills`
**Fonte:** Skill nativa do Claude Code

### Context7 MCP
**O que faz:** Busca documentacao atualizada de bibliotecas, frameworks e APIs (React, Next.js, Prisma, Tailwind, etc). Evita que o Claude use info desatualizada do treinamento.
**Bom pra:** Qualquer skill que envolva codigo com biblioteca/framework. Setup, debug, geracao de codigo
**Como instalar:** `claude mcp add context7 -- npx -y @upstash/context7-mcp`. Depois roda automatico
**Fonte:** Skill que embrulha o MCP context7

---

## Testar sites e apps

### Webapp Testing
**O que faz:** Testa aplicacoes web locais usando Playwright. Captura screenshots, verifica funcionalidade, le logs do browser.
**Bom pra:** Testar landing pages antes de publicar, verificar se tudo funciona em diferentes tamanhos
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/webapp-testing`
**Fonte:** Skill nativa do Claude Code

---

## Criar skills novas

### Skill Creator
**O que faz:** Guia pra criar skills novas do zero. Ajuda a estruturar, definir triggers, e testar.
**Bom pra:** Quando o `/mapear` nao cobre o que voce precisa e quer criar algo mais complexo
**Como instalar:** Ja vem nativo no Claude Code. Chamar com `/skill-creator`
**Fonte:** Skill nativa do Claude Code

---

## Como adicionar skills novas a este catalogo

Se voce testou uma skill e quer adicionar aqui pra referencia futura:

```markdown
### Nome da Skill
**O que faz:** [descricao em uma frase]
**Bom pra:** [casos de uso praticos]
**Como instalar:** [comando ou instrucao]
**Fonte:** [de onde veio — skill nativa, criada por voce, ou de terceiros]
```
