---
name: syncar
description: >
  Manda o trabalho pro GitHub com cuidado: mostra o que vai subir, nunca sobe segredo,
  puxa o que mudou em outro lugar antes de enviar e diz o que subiu. Configura o git e o
  GitHub na primeira vez.
  Use quando o usuário chamar /syncar, ou disser "synca", "salva no github", "faz commit",
  "manda pro github", "backup", "salva tudo".
---

# /syncar · mandar pro GitHub

**Esta skill não decide nada.** Ela manda pro GitHub o que já foi escrito. Guardar a sessão no
lugar certo é `/atualizar`. Se o usuário chamou o `/syncar` numa sessão que rendeu trabalho e o
`/atualizar` não rodou, oferecer primeiro: *"quer que eu guarde a sessão antes de subir?"*.

Regras que valem em toda falha: **nunca jargão** (nada de rebase, HEAD, upstream, fast-forward,
merge, conflito) e **nunca travar mudo**. Toda falha vira uma frase: o que aconteceu, o que continua
seguro, qual é o próximo passo. E o primeiro fato é sempre este: falha de sincronização não apaga
arquivo; o trabalho está no computador.

## Verificação inicial

```bash
git status --short 2>&1
git remote get-url origin 2>/dev/null
cat .origem 2>/dev/null
ls .gitignore 2>&1
ls _memoria/recados/*auto-sync-parado* 2>/dev/null
```

**Sem `.gitignore` na raiz, nada sobe.** É ele que segura `.env`, vídeo e zip no computador. O
modelo mora em `sistema/templates/gitignore.txt`: copiar pra `.gitignore` e contar em uma linha
(*"faltava a trava que impede senha e vídeo de subirem; coloquei"*). Se a pasta já tem git e já
enviou antes, conferir o que subiu e agora ficaria de fora:

```bash
git ls-files -ci --exclude-standard
```

Tem coisa: mostrar a lista e, com o sim, tirar do GitHub **sem apagar do computador**
(`git rm --cached <arquivo>`, e segue pro Fluxo B). Se na lista tem `.env` ou arquivo com chave,
dizer com todas as letras: *"essa chave já esteve no GitHub. Tirar de lá não apaga do histórico:
troque ela no serviço (gere uma nova) e ponha a nova só no `.env`."*

Tem recado `auto-sync-parado`: é o envio automático pedindo ajuda. Seguir o **Fluxo E** antes de
qualquer outro.

## Fluxo 0 · a pasta nunca foi preparada pra salvar

`git status` respondeu algo como *not a git repository*: ligar o salvamento e contar depois.

```bash
git init
git branch -M main
```

> "Liguei o salvamento nesta pasta. Por enquanto está tudo só no seu computador; falta conectar num
> lugar de fora pra ter cópia de segurança. Quer fazer isso agora? Leva 2 minutos."

Seguir pro Fluxo A.

## Fluxo A · sem GitHub conectado (primeira vez)

> "Seu sistema ainda não está conectado a um repositório no GitHub. Se ainda não criou:
> 1. Acesse github.com/new
> 2. Crie um repositório **privado** (nome sugerido: `meu-negocio`)
> 3. Não inicialize com README, deixa vazio
> 4. Me passa o link (ex: https://github.com/seunome/meu-negocio)"

**Quem cria o repositório é o usuário, no site.** Nunca criar por ele (`gh repo create` ou
API), mesmo que a conta esteja logada nesta máquina e mesmo que ele diga "faz tudo": conta e
repositório são dele, e ele precisa saber onde o trabalho dele mora. Sem o link, parar aqui.

Com o link: `git remote add origin <link>` e seguir pro Fluxo B (o primeiro envio é
`git push -u origin main`). Se o `git push` pedir login: *"seu computador não está conectado à sua
conta do GitHub. É uma vez só: rode `gh auth login` e siga o que aparecer. Te ajudo se quiser."*

## Fluxo B · tem mudanças pra subir

### 1. Mostrar o que vai subir, e barrar o que não pode

Listar os arquivos de `git status --short` em linguagem de gente (não a saída crua): *"vão subir
3 arquivos novos e 2 alterados: a proposta da Acme, o diário de hoje, ..."*. Antes disso, três
conferências, sem perguntar:

- **Segredo:** procurar nos arquivos que vão subir por cara de chave (`sk-`, `ghp_`, `AKIA`,
  `-----BEGIN`, `password=`, `token=`, `api_key`). Achou: **não sobe esse arquivo**, avisar
  qual e onde, e sugerir mover a chave pro `.env`.
- **Pesado:** arquivo acima de 50 MB fica de fora, e avisa: *"tem arquivo pesado demais pro GitHub
  (vídeo, zip); esse fica só no seu computador."*
- **Nada de `git add -A` cego.** Adicionar pelo que foi listado e aprovado:
  `git add <arquivos>` (ou `git add -A` só depois de mostrar a lista e sem nenhum barrado).

**Primeira sincronização depois de atualizar o `.gitignore`:** a lista pode ser um paredão de
arquivos (as pastas de trabalho, que antes não subiam). Avisar em uma linha: *"é um monte de
arquivo porque é a primeira vez que o seu trabalho sobe; é só desta vez."*

### 2. Trazer o que mudou fora daqui, antes de mandar

```bash
git pull --ff-only 2>&1
```

Se a resposta disser que as versões divergiram (este computador e o GitHub mudaram os dois):

> "Seu sistema mudou em outro lugar também (outro computador, outra pessoa, ou um robô). Vou
> trazer o que está lá antes de mandar o seu, pra não atropelar nada."

Aí: `git stash` do que ainda não foi commitado (se houver), `git pull --rebase`, `git stash pop`.
Se o git parar dizendo que **o mesmo arquivo mudou nos dois lados**:

- arquivo do diário (`_memoria/diario/`) ou recado: não devia acontecer (cada origem tem o seu).
  Ficar com os dois blocos, um embaixo do outro, e seguir.
- arquivo destilado (`agora.md`, `andamento.md`, `empresa.md`, qualquer `_contexto/`):
  **evento supervisionado.** Fazer backup antes (`cp <arquivo> <arquivo>.antes-de-juntar`),
  mostrar as duas versões em linguagem de gente, propor a junção (o conteúdo dos dois, destilado
  de novo: **uma seção só de cada**, sem título repetido, sem linha duplicada), e só aplicar com
  o sim. Sem sim, `git rebase --abort` e:
  *"O mesmo arquivo foi editado aqui e em outro lugar. Não vou juntar sozinho pra não apagar nada
  seu. Seu trabalho está salvo no computador; me chama que a gente junta os dois."*

### 3. Commit com a origem identificada, push só pra frente

```bash
git commit -m "sync (<origem>): <o que foi feito, curto>"
git push
```

A origem vem do `.origem` (`dono` ou o nome da máquina). A descrição vem da sessão ("sync (dono):
proposta Acme + diário"); sem saber, `sync (<origem>): atualizações do dia`. Nunca `push --force`.

### 4. Dizer o que subiu

> "Subiu: a proposta da Acme, o diário de hoje e o onde-paramos. 3 arquivos, em [link do repositório]."

Não dizer "seu trabalho está seguro": dizer **o que** subiu. Se algo ficou de fora (segredo, pesado),
repetir o quê e por quê.

## Fluxo C · sem mudanças

> "Nada novo pra subir. Está tudo sincronizado."

Se `git pull --ff-only` trouxe coisa nova, dizer o que veio: *"trouxe 2 arquivos que mudaram em
outro lugar: ..."*.

## Fluxo D · deu errado

| o que aconteceu | o que dizer |
|---|---|
| sem internet | "Não consegui alcançar o GitHub agora. Parece internet. Seu trabalho está salvo aqui no computador; quando voltar, é só pedir 'synca'." |
| autenticação falhou | "Seu computador não está conectado à sua conta do GitHub. É uma vez só: `gh auth login`. Te ajudo se quiser." |
| repositório não existe ou não é seu | "O endereço configurado não existe ou sua conta não tem acesso. Quer conferir o link comigo?" |
| recusou porque tem coisa nova lá | seguir o passo 2 do Fluxo B |
| arquivo grande demais | "Tem arquivo pesado demais pro GitHub. Esse fica só no computador. Quer ver quais?" |
| qualquer outra | "Não consegui subir, e essa eu não sei resolver de cabeça. Seu trabalho está seguro no computador. Quer que eu investigue?" |

O erro cru só aparece se o usuário pedir.

## Fluxo E · o envio automático parou

Existe quando este computador tem o envio automático ligado (`sistema/scripts/auto-sync.sh`, ver a
linha dele em `_contexto/automacoes.md`) e ele deixou um recado `AAAA-MM-DD-<origem>-auto-sync-parado.md`.
O recado diz o motivo em uma frase; o detalhe está nas últimas linhas de `.auto-sync.log`.

| o recado diz | o que fazer |
|---|---|
| o mesmo arquivo mudou aqui e no GitHub | é o passo 2 do Fluxo B: o evento supervisionado. Se `git status` mostra arquivo em conflito, as mudanças daqui estão guardadas (`git stash list`); juntar com o sim, do mesmo jeito |
| tem arquivo esperando decidir entre duas versões | idem: juntar com o sim. Nunca descartar um lado |
| achei cara de chave ou senha em ... | mostrar o arquivo e a linha, sem o valor; mover a chave pro `.env` |
| arquivo pesado demais | acrescentar o caminho no `.gitignore` com o sim |
| o GitHub recusou o acesso | Fluxo D, linha de autenticação |
| o git respondeu algo que não sei resolver | ler o `.auto-sync.log`, explicar em uma frase, perguntar se investiga |

Resolveu: rodar o Fluxo B normalmente. O próprio envio automático apaga o recado na próxima rodada
que passar; se o usuário quiser, apague agora. O envio automático nunca junta arquivo nem força
nada: por isso ele para e chama você.

## Regras

- Nunca subir `.env`, chave, token ou senha. Achou: barra e avisa.
- Nunca criar repositório, conta ou credencial pelo usuário. Ele cria e cola o link.
- Nunca `git add -A` sem antes mostrar a lista. Nunca `push --force`. Nunca `reset --hard`.
- Antes de qualquer coisa que possa apagar trabalho: parar e perguntar.
- Tom direto; não explicar git a não ser que perguntem.
