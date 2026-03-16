# 🆕 Criar Novo Cluster MongoDB Atlas

Se seu cluster foi deletado, siga estes passos para criar um novo:

## 📋 Passo a Passo Completo

### 1️⃣ Criar o Cluster

1. Na página do MongoDB Atlas, você verá o botão **"Create cluster"** ou **"Create"**
2. Clique nele
3. Escolha a opção **"M0 FREE"** (tier gratuito)
4. **Região (Region):** Escolha a mais próxima do Brasil:
   - **São Paulo (AWS):** `sa-east-1`
   - Ou outra região próxima
5. **Cluster Name (opcional):** Pode deixar "Cluster0" ou colocar "agrodrones"
6. Clique em **"Create Cluster"**
7. **Aguarde 3-5 minutos** enquanto o cluster é criado

---

### 2️⃣ Configurar Network Access (Whitelist de IPs)

⚠️ **CRÍTICO:** Sem isso, você não conseguirá conectar!

1. No menu lateral esquerdo, clique em **"Network Access"** (ou "Security" → "Network Access")
2. Clique no botão **"Add IP Address"**
3. Você tem 3 opções:
   
   **Opção A - Desenvolvimento Local (Recomendado):**
   - Clique em **"Add Current IP Address"**
   - Isso adiciona seu IP atual automaticamente
   
   **Opção B - Permitir Todos (Apenas para Testes):**
   - Clique em **"Allow Access from Anywhere"**
   - Digite `0.0.0.0/0`
   - ⚠️ **ATENÇÃO:** Isso permite acesso de qualquer lugar (inseguro para produção!)
   
   **Opção C - IP Manual:**
   - Digite seu IP público manualmente
   - Para descobrir seu IP: https://www.whatismyip.com/

4. Clique em **"Confirm"**
5. Aguarde alguns segundos para a configuração ser aplicada

---

### 3️⃣ Criar Usuário do Banco de Dados

1. No menu lateral, clique em **"Database Access"** (ou "Security" → "Database Access")
2. Clique no botão **"Add New Database User"** ou **"Create Database User"**
3. Configure o usuário:
   
   **Authentication Method:** Password
   
   **Username:** `rsautomacao2000_db_user` (ou o nome que você preferir)
   
   **Password:** 
   - Você pode usar a mesma senha antiga: `@Desbravadores@93`
   - **OU** gerar uma nova (clique em "Autogenerate Secure Password" e COPIE a senha)
   
   **Database User Privileges:** 
   - Selecione **"Atlas admin"** (para ter acesso total)
   - OU **"Read and write to any database"** (recomendado)
   
4. Clique em **"Add User"** ou **"Create User"**

⚠️ **IMPORTANTE:** Se você gerou uma nova senha, COPIE ELA AGORA! Você não conseguirá vê-la depois.

---

### 4️⃣ Obter a String de Conexão

1. No menu lateral, clique em **"Clusters"**
2. Clique no botão **"Connect"** ao lado do seu cluster
3. Selecione **"Connect your application"** (ou "Conectar seu aplicativo")
4. Na tela que aparece:
   - **Driver:** Deixe "Node.js" (ou selecione se não estiver)
   - **Version:** Versão mais recente (geralmente já selecionada)
5. **Copie a connection string** que aparece

Ela será algo como:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

### 5️⃣ Atualizar o Arquivo .env

1. Abra o arquivo `.env` na raiz do seu projeto
2. Substitua a linha `MONGODB_URI` pela nova connection string

**Formato completo da URI (substitua os valores):**

```env
MONGODB_URI=mongodb+srv://rsautomacao2000_db_user:SENHA_AQUI@cluster0.xxxxx.mongodb.net/agrodrones?retryWrites=true&w=majority&appName=agrodrones
```

**Importante:**
- Substitua `SENHA_AQUI` pela senha do usuário (se tiver caracteres especiais como `@`, use URL encoding: `%40` para `@`)
- Substitua `cluster0.xxxxx.mongodb.net` pelo endereço do seu novo cluster
- O `/agrodrones` no meio é o nome do banco de dados (pode ser qualquer nome)
- Se sua senha é `@Desbravadores@93`, na URI fica: `%40Desbravadores%4093`

**Exemplo completo:**
```env
MONGODB_URI=mongodb+srv://rsautomacao2000_db_user:%40Desbravadores%4093@cluster0.abc123.mongodb.net/agrodrones?retryWrites=true&w=majority&appName=agrodrones
```

---

### 6️⃣ Testar a Conexão

Após configurar tudo, teste:

```bash
npm run test-db
```

Isso deve conectar e listar as coleções (mesmo que vazias).

---

### 7️⃣ Recriar Dados (Opcional)

Se você tinha dados antes e quer recriar dados de teste:

```bash
npm run seed
```

Isso criará:
- Uma empresa de exemplo
- Um usuário admin (email: `admin@example.com`, senha: `admin123`)

---

## ✅ Checklist Completo

- [ ] Cluster criado (status: "Running")
- [ ] Network Access configurado (IP adicionado)
- [ ] Usuário do banco criado
- [ ] String de conexão copiada
- [ ] Arquivo `.env` atualizado com a nova URI
- [ ] Teste de conexão passou (`npm run test-db`)
- [ ] Servidor iniciou com sucesso (`npm run dev`)

---

## ⚠️ Problemas Comuns

### ❌ Erro: "authentication failed"
**Causa:** Usuário ou senha incorretos no `.env`
**Solução:** 
- Verifique o username e password no `.env`
- Lembre-se de fazer URL encoding dos caracteres especiais na senha

### ❌ Erro: "ECONNREFUSED" ou "ENOTFOUND"
**Causa:** IP não está na whitelist
**Solução:** Adicione seu IP em "Network Access"

### ❌ Erro: "timed out"
**Causa:** Cluster ainda está inicializando ou problema de rede
**Solução:** Aguarde 5 minutos e tente novamente

### ❌ Não consigo copiar a connection string
**Solução:** 
- Use o botão de copiar ao lado da string
- Ou construa manualmente usando o formato acima

---

## 🔗 Links Úteis

- MongoDB Atlas: https://cloud.mongodb.com/
- Documentação: https://docs.atlas.mongodb.com/getting-started/
- URL Encoder (para senhas): https://www.urlencoder.org/

---

## 💡 Dica Pro

Se você quer usar a mesma senha antiga (`@Desbravadores@93`), pode recriar o usuário com essa senha. Lembre-se apenas de fazer URL encoding na connection string:
- `@` vira `%40`
- `#` vira `%23`
- ` ` (espaço) vira `%20`
- etc.

---

**Boa sorte! 🚀**
