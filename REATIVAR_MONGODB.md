# 🔄 Como Reativar o MongoDB Atlas

Se seu cluster foi pausado após 30 dias de inatividade, siga estes passos:

## 📋 Passo a Passo

### 1️⃣ Acessar o MongoDB Atlas

1. Acesse: **https://cloud.mongodb.com/**
2. Faça login com suas credenciais

### 2️⃣ Navegar até seu Cluster

1. Na página inicial, clique no seu **projeto** (ex: "AgroDrones")
2. No menu lateral, clique em **"Clusters"** (ou "Clusters" na lista)
3. Você verá seu cluster listado (provavelmente "Cluster0" ou nome similar)
4. **Status:** Se estiver pausado, verá "Paused" ou "Pausado"

### 3️⃣ Reativar o Cluster

1. Clique no botão **"Resume"** (▶️) ou **"Retomar"** ao lado do cluster pausado
2. Confirme na janela de confirmação (se aparecer)
3. **Aguarde 2-5 minutos** para o cluster iniciar
4. O status mudará de "Paused" → "Starting" → "Running"

### 4️⃣ Verificar Network Access (Whitelist)

⚠️ **IMPORTANTE:** Após reativar, verifique se seu IP está na whitelist:

1. No menu lateral, clique em **"Network Access"** (ou "Acesso à Rede")
2. Clique em **"Add IP Address"**
3. Para desenvolvimento local, você pode:
   - Adicionar seu IP atual: Clique em **"Add Current IP Address"**
   - Ou permitir todos (apenas para testes): Clique em **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Clique em **"Confirm"**

### 5️⃣ Verificar Database Access (Usuários)

1. No menu lateral, clique em **"Database Access"** (ou "Acesso ao Banco")
2. Verifique se o usuário `rsautomacao2000_db_user` está ativo
3. Se necessário, crie/edite o usuário com a senha correta

### 6️⃣ Obter a String de Conexão (se necessário)

1. No cluster, clique em **"Connect"**
2. Selecione **"Connect your application"**
3. Copie a connection string (você já tem, mas pode verificar)

Sua connection string deve ser algo como:
```
mongodb+srv://rsautomacao2000_db_user:<password>@agrodrones.ocj12kt.mongodb.net/agrodrones?retryWrites=true&w=majority&appName=agrodrones
```

**Substitua `<password>` pela senha real** (no seu caso: `@Desbravadores@93`)

### 7️⃣ Testar a Conexão Localmente

Após reativar, teste a conexão:

```bash
npm run test-db
```

Este comando irá:
- Conectar ao MongoDB Atlas
- Listar as coleções existentes
- Confirmar que está tudo funcionando

### 8️⃣ Iniciar o Servidor

Se o teste passou, inicie o servidor:

```bash
npm run dev
```

---

## ⚠️ Problemas Comuns

### ❌ Erro: "authentication failed"
**Solução:** Verifique o usuário e senha no arquivo `.env`

### ❌ Erro: "ECONNREFUSED" ou "ENOTFOUND"
**Solução:** 
- Verifique se o cluster está "Running"
- Verifique se seu IP está na whitelist (Network Access)

### ❌ Erro: "timed out"
**Solução:** 
- O cluster pode estar ainda inicializando (aguarde 5 minutos)
- Verifique a whitelist de IPs

### ❌ Cluster não aparece ou está deletado
**Solução:** 
- Se o cluster foi deletado (não pausado), você precisará criar um novo
- No MongoDB Atlas, clique em "Build a Database" → "M0 FREE" → Configure

---

## 📝 Notas Importantes

- **Tier Gratuito (M0):** Clusters são pausados após 30 dias de inatividade
- **Tempo de reativação:** Geralmente 2-5 minutos
- **Dados preservados:** Seus dados NÃO são perdidos quando o cluster é pausado
- **Limitações do Free Tier:** 
  - 512 MB de storage
  - Compartilhado (não dedicado)
  - Pode ser pausado após inatividade

---

## ✅ Checklist de Reativação

- [ ] Cluster reativado (status: "Running")
- [ ] IP adicionado na whitelist (Network Access)
- [ ] Usuário do banco verificado (Database Access)
- [ ] String de conexão atualizada no `.env` (se necessário)
- [ ] Teste de conexão passou (`npm run test-db`)
- [ ] Servidor iniciou com sucesso (`npm run dev`)

---

## 🔗 Links Úteis

- MongoDB Atlas: https://cloud.mongodb.com/
- Documentação: https://docs.atlas.mongodb.com/
- Suporte: https://www.mongodb.com/support
