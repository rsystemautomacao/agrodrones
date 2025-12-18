# Guia de Deploy no Vercel - AgroDrones

## 📋 Passo a Passo Completo

### 1. **Preenchendo o Formulário de Importação**

Na tela de "New Project" do Vercel:

#### **Project Name:**
- ✅ Deixe como está: `agrodrones`
- Ou altere se preferir outro nome

#### **Framework Preset:**
- ✅ Selecione: **Other** ou **Express**
- O Vercel pode detectar automaticamente como Express

#### **Root Directory:**
- ✅ Deixe como está: `./`
- Não precisa alterar (raiz do projeto)

#### **Build and Output Settings:**
Clique para expandir e configure:

- **Build Command:** Deixe em branco ou use: `npm install`
- **Output Directory:** Deixe em branco (não aplicável para Express)
- **Install Command:** Deixe em branco (usa `npm install` por padrão)

### 2. **Environment Variables (VARIÁVEIS DE AMBIENTE)**

⚠️ **IMPORTANTE:** Configure estas variáveis ANTES de fazer o deploy!

Clique em "Environment Variables" e adicione:

#### **Variável 1: MONGODB_URI**
```
Key: MONGODB_URI
Value: mongodb+srv://rsautomacao2000_db_user:%40Desbravadores%4093@agrodrones.ocj12kt.mongodb.net/agrodrones?retryWrites=true&w=majority&appName=agrodrones
```

#### **Variável 2: SESSION_SECRET**
```
Key: SESSION_SECRET
Value: agrodrones-secret-key-change-in-production-2024
```

**⚠️ IMPORTANTE:** 
- Para produção, gere um SESSION_SECRET mais seguro
- Você pode gerar um novo usando: `openssl rand -base64 32`

#### **Variável 3: PORT (OPCIONAL)**
```
Key: PORT
Value: 3000
```
*Nota: O Vercel define a porta automaticamente, mas pode definir se preferir*

#### **Variável 4: NODE_ENV (OPCIONAL)**
```
Key: NODE_ENV
Value: production
```

### 3. **Configurações Adicionais**

Após adicionar as variáveis de ambiente:

1. ✅ Verifique que todas as variáveis estão marcadas para **Production**, **Preview** e **Development**
2. Clique em **"Add"** para cada variável
3. Clique em **"Deploy"** ou **"Create Project"**

### 4. **Durante o Deploy**

O Vercel vai:
1. Instalar dependências (`npm install`)
2. Fazer o build (se necessário)
3. Fazer o deploy
4. Gerar uma URL (ex: `agrodrones.vercel.app`)

### 5. **Pós-Deploy**

#### **Verificar Logs:**
- Vá em "Deployments" > Clique no deployment mais recente
- Veja os logs para verificar se tudo está funcionando

#### **Testar a Aplicação:**
- Acesse a URL fornecida pelo Vercel
- Teste o login/cadastro
- Verifique se está conectando ao MongoDB

### 6. **Configuração de Domínio Personalizado (Opcional)**

1. Vá em **Settings** > **Domains**
2. Adicione seu domínio personalizado
3. Configure o DNS conforme instruções do Vercel

## ⚠️ IMPORTANTE - Limitações do Vercel

### **Upload de Arquivos:**
O Vercel tem sistema de arquivos **somente leitura** após o deploy. Para uploads funcionarem em produção, você precisará:

**Opção 1: Usar serviço de storage externo** (recomendado)
- AWS S3
- Google Cloud Storage
- Cloudinary (para imagens)
- Azure Blob Storage

**Opção 2: Usar Vercel Blob** (serviço nativo do Vercel)

**Opção 3: Usar servidor separado** para uploads (ex: Render, Railway)

### **Sessões:**
O `connect-mongo` já está configurado, então as sessões serão salvas no MongoDB (funciona perfeitamente no Vercel).

### **Cron Jobs / Background Jobs:**
Se precisar executar tarefas agendadas, considere usar:
- Vercel Cron Jobs (beta)
- Serviço externo (ex: Render Cron Jobs)

## 🔄 Comparação Vercel vs Render

| Recurso | Vercel | Render |
|---------|--------|--------|
| Deploy automático do GitHub | ✅ Sim | ✅ Sim |
| HTTPS gratuito | ✅ Sim | ✅ Sim |
| Upload de arquivos local | ❌ Não (readonly) | ✅ Sim |
| Banco de dados incluído | ❌ Não | ✅ PostgreSQL |
| Storage para uploads | ⚠️ Pago/Vercel Blob | ✅ Sim (disco) |
| Free tier generoso | ✅ Sim | ✅ Sim |
| Deploy rápido | ✅ Muito rápido | ✅ Rápido |

**Conclusão:** Vercel é ótimo para o projeto, mas para uploads de arquivos você precisará usar um serviço externo de storage.

## 📝 Checklist Final

Antes de fazer deploy, certifique-se:

- [x] Variáveis de ambiente configuradas
- [x] MongoDB Atlas configurado e acessível
- [x] IP Access List no MongoDB permite conexões (0.0.0.0/0 para começar)
- [x] Repositório GitHub atualizado
- [x] vercel.json criado (já está no projeto)

## 🚀 Próximos Passos

1. Configure as variáveis de ambiente no Vercel
2. Clique em "Deploy"
3. Aguarde o deploy finalizar
4. Teste a aplicação
5. Configure storage externo para uploads (opcional, mas recomendado)

