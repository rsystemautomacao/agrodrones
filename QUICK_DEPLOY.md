# 🚀 Configuração Rápida no Vercel

## Preencha assim na tela do Vercel:

### 1. **Campos do Formulário:**
- **Project Name:** `agrodrones` ✅ (já está preenchido)
- **Framework Preset:** `Other` ou `Express` ✅
- **Root Directory:** `./` ✅ (deixe como está)

### 2. **Build and Output Settings:**
- **Build Command:** (deixe em branco)
- **Output Directory:** (deixe em branco)
- **Install Command:** (deixe em branco)

### 3. **Environment Variables - ADICIONE ESTAS 3:**

Clique em **"Environment Variables"** e adicione:

#### 🔑 Variável 1:
```
Key: MONGODB_URI
Value: mongodb+srv://rsautomacao2000_db_user:%40Desbravadores%4093@agrodrones.ocj12kt.mongodb.net/agrodrones?retryWrites=true&w=majority&appName=agrodrones
```
✅ Marque: Production, Preview, Development

#### 🔑 Variável 2:
```
Key: SESSION_SECRET
Value: agrodrones-secret-key-change-in-production-2024
```
✅ Marque: Production, Preview, Development

#### 🔑 Variável 3 (Opcional):
```
Key: PORT
Value: 3000
```
✅ Marque: Production, Preview, Development

---

## ✅ Depois de adicionar as variáveis:

1. Clique em **"Deploy"**
2. Aguarde o deploy finalizar
3. Acesse a URL fornecida pelo Vercel
4. Teste o sistema!

---

## ⚠️ IMPORTANTE sobre Uploads:

O Vercel tem sistema de arquivos **somente leitura**. Para uploads funcionarem, você precisará configurar storage externo (AWS S3, Cloudinary, etc) no futuro. Por enquanto, o sistema funcionará, mas uploads serão perdidos a cada novo deploy.

