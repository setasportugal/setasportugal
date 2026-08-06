# Setas DB – Base de dados pessoal de setas (darts)

Aplicação simples para gerir **jogadores** e **equipas** de setas, com associação entre eles.

Funciona bem no telemóvel e no computador.

---

## 1. Criar o projeto no Supabase

1. Vai a [https://supabase.com](https://supabase.com) e cria uma conta (se ainda não tiveres).
2. Clica em **New Project**.
3. Escolhe um nome (ex: `setas-db`), uma password forte para a base de dados e a região mais próxima (Europe West).
4. Espera que o projeto fique pronto (1-2 minutos).

---

## 2. Criar as tabelas

1. No menu do lado esquerdo, vai a **SQL Editor**.
2. Clica em **New query**.
3. Copia **todo** o conteúdo do ficheiro `schema.sql` e cola na caixa.
4. Clica em **Run** (ou Ctrl+Enter).
5. Cria uma nova query, copia o conteúdo de `supabase/migrations/20260806215944_core_competitions.sql` e volta a clicar em **Run**.

Ficam criadas as tabelas de jogadores, equipas, associações, competições, épocas, participantes, jornadas e jogos. A segunda query também ativa RLS e limita o acesso a utilizadores autenticados.

---

## 3. Configurar autenticação (obrigatório)

As políticas RLS permitem acesso apenas a utilizadores autenticados:

1. Vai a **Authentication → Providers**.
2. Ativa o **Email** (já vem ativo por defeito).
3. (Opcional) Desativa a confirmação de email em **Authentication → Providers → Email → Confirm email** se quiseres testar mais rápido.

Cria pelo menos um utilizador em **Authentication → Users → Add user**. Depois entra na aplicação pela página `/login`.

---

## 4. Ligar a aplicação ao Supabase

1. No Supabase, vai a **Project Settings → API**.
2. Copia:
   - **Project URL**
   - **anon public** key

3. Na pasta do projeto, cria um ficheiro `.env.local` com:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

(Substitui pelos valores reais)

---

## 5. Instalar e correr a aplicação

No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

Abre no browser: [http://localhost:3000](http://localhost:3000)

---

## 6. Usar no telemóvel

Enquanto o `npm run dev` estiver a correr no computador:

1. Descobre o IP local do teu computador (ex: `192.168.1.85`).
2. No telemóvel (mesma rede Wi-Fi), abre: `http://192.168.1.85:3000`

Assim consegues introduzir e consultar dados diretamente no telemóvel.

Mais tarde podes fazer deploy (Vercel é o mais fácil) para teres um link permanente.

---

## O que a aplicação faz agora

- Criar / editar / apagar **jogadores**
- Criar / editar / apagar **equipas**
- Associar jogadores a equipas (e remover)
- Pesquisar por nome, alcunha, cidade, região
- Ver o histórico simples de associações

---

## Próximos passos possíveis (quando quiseres)

- Adicionar tabela de **jogos / resultados**
- Calcular estatísticas automaticamente
- Rankings
- Importação em massa
- Autenticação mais completa

---

Bom trabalho! Vai preenchendo com calma.
