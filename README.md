# Claude Code OS — Kit de Boas-Vindas 🐀

Feito pelo [Ratos de IA](https://ratosdeia.com.br) pra alunos do curso **Claude Code OS**.

---

## Como instalar

### Opção 1 — Via prompt (mais fácil)

Com o Claude Code aberto em qualquer pasta, copie e cole esse prompt:

```
Instala pra mim o repositório https://github.com/dobralabs/ccos-ratos.git na pasta atual, abre ela e roda /setup
```

O Claude faz tudo: clona o repositório, entra na pasta e inicia a configuração.

---

### Opção 2 — Via terminal

**1. Clone o repositório**
```bash
git clone https://github.com/dobralabs/ccos-ratos.git
cd ccos-ratos
```

**2. Abra no VS Code**
```bash
code .
```

**3. Abra o terminal integrado** (Ctrl + ` no Windows / Cmd + ` no Mac) e rode:
```bash
claude
```

**4. Chame o setup**
```
/setup
```

---

O Claude vai te fazer algumas perguntas e configurar o sistema pro seu negócio. Em 5 minutos você tem tudo pronto.

---

## O que vem no kit

**Skills prontas pra usar:**
- `/setup` — configura o sistema pro seu negócio (comece por aqui)
- `/iniciar` — carrega o contexto do negócio no começo de cada sessão de trabalho
- `/syncar` — salva o trabalho no GitHub (commit + push, configura na primeira vez)
- `/carrossel` — cria carrosséis pra Instagram e TikTok com a sua identidade visual
- `/proposta-comercial` — gera proposta profissional em HTML a partir de um briefing
- `/publicar-site` — publica qualquer HTML no ar com um link compartilhável
- `/slide` — cria slide/card visual pra apresentação
- `/analisar-dados` — analisa um arquivo e gera resumo executivo com insights
- `/roteiro-post` — transforma ideia ou texto em roteiro de post ou vídeo
- `/email-profissional` — rascunha email profissional a partir de contexto livre
- `/atualizar` — varre o projeto e atualiza os arquivos de contexto que ficaram desatualizados
- `/novo-projeto` — cria pasta de projeto novo com CLAUDE.md dedicado (entrevista sobre o projeto)

**Pastas geradas pelo `/setup`:**
- `_contexto/` — contexto do seu negócio e preferências
- `marca/` — guia de identidade visual da sua marca
- `templates/ferramentas/catalogo.md` — APIs, CLIs e MCPs disponíveis pra usar em skills

**Pasta `dados/`:**
- Drop zone pra arquivos que você quer analisar (CSV, XLSX, TXT, PDF)
- Útil quando você não tem MCP de Google Drive instalado
- Use com `/analisar-dados dados/seu-arquivo.csv`

---

## Ficou travado?

Assiste a **Aula 1.3** do curso (instalação do Claude Code).

Dúvidas: [ratosdeia.com.br](https://ratosdeia.com.br)
