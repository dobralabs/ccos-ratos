---
name: syncar
description: >
  Salva o estado atual do workspace no GitHub (commit + push).
  Use quando quiser garantir que o trabalho está seguro, ao final de uma sessão produtiva,
  ou quando o usuário disser "salva no github", "faz commit", "synca", "syncar",
  "backup no github", "salva tudo", "manda pro github".
  Também configura o git pela primeira vez se ainda não estiver configurado.
---

# /syncar — Salvar no GitHub

## Verificação inicial

Rode os dois comandos pra entender o estado atual:

```bash
git status --short
git remote get-url origin 2>/dev/null
```

---

## Fluxo A: sem remote configurado (primeira vez)

Se `git remote get-url origin` não retornar nada, o aluno ainda não conectou ao GitHub.

Diga:

> "Seu workspace ainda não está conectado a um repositório no GitHub.
>
> Pra conectar, você precisa de um repositório no GitHub. Se ainda não criou:
> 1. Acesse github.com/new
> 2. Crie um repositório (pode ser privado, nome sugerido: `meu-negocio` ou `workspace`)
> 3. Não inicialize com README — deixa vazio
> 4. Me passa o link do repositório criado (ex: https://github.com/seunome/workspace)"

Após receber o link, configure e envie:

```bash
git remote add origin [link]
git branch -M main
git push -u origin main
```

Confirme:

> "Conectado. Seu workspace está agora em [link].
> A partir de agora, o sistema vai sincronizar automaticamente quando você terminar de trabalhar."

---

## Fluxo B: remote configurado, tem mudanças

Se `git status` mostrar arquivos modificados, liste o que vai ser salvo e faça o commit:

```bash
git add -A
git commit -m "sync: [descrição curta do que foi feito]"
git push
```

Para a descrição do commit, use o que foi feito na sessão (ex: "sync: nova proposta cliente X", "sync: carrossel episódio 42", "sync: atualização de contexto"). Se não souber o que colocar, use `sync: atualizações do dia`.

Após o push, confirme:

> "Salvo. Seu trabalho está seguro em [url do remote]."

---

## Fluxo C: sem mudanças

Se `git status` não mostrar nada:

> "Tudo já está sincronizado. Nenhuma mudança nova pra salvar."

---

## Fluxo D: erro no push

Se o push falhar (credenciais, conexão, etc.), mostre o erro de forma simples:

> "Não consegui enviar pro GitHub. O erro foi: [mensagem]
>
> Causas mais comuns:
> - Sem conexão com internet
> - Precisa configurar autenticação no GitHub (token ou SSH)
>
> Se quiser resolver agora, me diz e eu te ajudo passo a passo."

---

## Regras

- Nunca commitar `.env`, `.env.local` ou qualquer arquivo com chaves secretas
- Tom direto — não explica git em detalhes a não ser que o usuário pergunte
- Se der erro, sempre mostrar o que fazer a seguir — nunca só mostrar o erro
