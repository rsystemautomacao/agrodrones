# 🔍 Cluster MongoDB Não Aparece (Mas Existe)

Se o Atlas diz que já existe um cluster gratuito mas você não consegue encontrá-lo, siga estes passos:

## 🔎 Diagnóstico Passo a Passo

### 1️⃣ Verificar Outros Projetos na Organização

1. No canto superior esquerdo, clique no **nome do projeto** (onde está "PROJECT agrodrones")
2. Você verá uma lista de **todos os projetos** da sua organização
3. **Verifique TODOS os projetos** listados:
   - Clique em cada projeto
   - Vá em "Clusters" no menu lateral
   - Procure por qualquer cluster listado

**O cluster pode estar em outro projeto!**

---

### 2️⃣ Verificar Outras Organizações

1. No canto superior esquerdo, clique em **"ORGANIZATION"** (onde está "startech's Org")
2. Veja se há **outras organizações** na lista
3. Se houver, clique e verifique os projetos dentro delas

---

### 3️⃣ Verificar Filtros/Visualização

1. Na página "Clusters", procure por:
   - **Filtros** (botões de filtro, dropdowns)
   - **Abas** (All, Running, Paused, etc.)
   - **Visualização diferente** (grid vs lista)
2. Tente clicar em **"All Clusters"** ou **"Show All"**

---

### 4️⃣ Usar a Busca/Listagem Completa

1. Tente acessar diretamente: https://cloud.mongodb.com/v2
2. Ou vá em: **"Organization"** → **"Billing"** → Veja se há algum cluster listado lá

---

### 5️⃣ Verificar via API ou Support

Se ainda não encontrar, o cluster pode estar em um estado "órfão". Neste caso, você pode:

**Opção A: Contactar Support do MongoDB**
1. Clique no ícone de **"?"** (help) no canto superior direito
2. Clique em **"Support"**
3. Explique que há um cluster "fantasma" que não aparece mas impede criar novo

**Opção B: Tentar Deletar via Interface Alternativa**
1. Acesse: https://cloud.mongodb.com/v2#/org
2. Verifique se há alguma referência ao cluster

---

## ✅ Solução: Deletar Cluster "Fantasma" e Criar Novo

Se você encontrou o cluster em outro projeto:

### Passo 1: Deletar o Cluster Antigo

1. **Navegue até o projeto** onde encontrou o cluster
2. Vá em **"Clusters"**
3. Clique nos **três pontinhos (⋯)** ao lado do cluster
4. Selecione **"Terminate Cluster"** ou **"Delete"**
5. **Digite o nome do cluster** para confirmar
6. Clique em **"Confirm"** ou **"Terminate"**
7. Aguarde a confirmação (pode levar alguns minutos)

### Passo 2: Voltar ao Projeto Correto

1. Clique no nome do projeto no topo
2. Selecione o projeto **"agrodrones"**
3. Agora você deve conseguir criar um novo cluster

### Passo 3: Criar Novo Cluster

Agora siga o guia `CRIAR_CLUSTER_MONGODB.md` para criar o novo cluster.

---

## 🆘 Se Ainda Não Encontrar o Cluster

Se após verificar TODOS os projetos e organizações você ainda não encontrar o cluster:

### Opção 1: Criar um Novo Projeto

1. No canto superior esquerdo, clique no nome do projeto
2. Clique em **"New Project"** ou **"Create Project"**
3. Dê um nome: "agrodrones-v2" ou "agrodrones-new"
4. Clique em **"Create Project"**
5. Agora você pode criar um cluster neste novo projeto

⚠️ **Nota:** Você terá que atualizar a connection string no `.env` depois.

### Opção 2: Contactar Suporte MongoDB

1. Acesse: https://www.mongodb.com/support
2. Ou via interface: Clique no **"?"** → **"Support"**
3. Explique a situação: "Tenho um cluster gratuito que não aparece mas impede criar novo"
4. Peça ajuda para deletar o cluster órfão

---

## 💡 Dica: Verificar Billing/Usage

1. Vá em: **Organization** → **Billing** (ou "Usage")
2. Veja se há algum cluster listado lá
3. Isso pode ajudar a identificar onde está o cluster "fantasma"

---

## ✅ Checklist de Diagnóstico

- [ ] Verifiquei TODOS os projetos na organização
- [ ] Verifiquei TODAS as organizações disponíveis
- [ ] Verifiquei filtros/abas na página de Clusters
- [ ] Tentei buscar o cluster via interface
- [ ] Encontrei o cluster em outro projeto → Deletei
- [ ] Ou: Criei um novo projeto para o cluster
- [ ] Ou: Contatei suporte MongoDB

---

## 🔗 Links Úteis

- MongoDB Atlas: https://cloud.mongodb.com/
- Suporte MongoDB: https://www.mongodb.com/support
- Documentação: https://docs.atlas.mongodb.com/

---

**Próximo Passo:** Depois de resolver, siga o guia `CRIAR_CLUSTER_MONGODB.md` para criar o novo cluster.
