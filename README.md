# AgroDrones

**MVP de micro-SaaS para registro de aplicações com drones na agricultura**

## 🎯 Sobre o Projeto

Sistema web multi-tenant para empresas prestadoras de serviços de pulverização com drones. Permite registrar aplicações, organizar dados operacionais e gerar relatórios conforme exigências do MAPA (Portaria 298/2021).

**Slogan:** "Cada aplicação registrada. Cada voo comprovado."

**Nome:** AgroDrones

## 🚀 Tecnologias

- **Backend:** Node.js + Express
- **Banco de Dados:** MongoDB Atlas (Mongoose)
- **Autenticação:** express-session + connect-mongo
- **Upload de Arquivos:** Multer
- **Geração de PDF:** PDFKit
- **Exportação CSV:** json2csv
- **View Engine:** EJS
- **Validação:** express-validator

## 📋 Pré-requisitos

- Node.js 14+ instalado
- MongoDB Atlas (ou MongoDB local)
- npm ou yarn

**Nota:** O logo padrão do sistema (`logo drones.png`) já está configurado em `public/images/logo.png`. Se você quiser usar um logo customizado, faça upload durante o onboarding.

## ⚙️ Configuração

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd AgroDrones
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/agrodroneops?retryWrites=true&w=majority
SESSION_SECRET=seu-secret-super-seguro-aqui-altere-isto
PORT=3000
```

**Importante:** 
- Substitua `usuario`, `senha` e `cluster` pela sua string de conexão do MongoDB Atlas
- Gere um `SESSION_SECRET` aleatório e seguro (ex: use `openssl rand -base64 32`)

4. **Crie as pastas necessárias**

O sistema criará automaticamente, mas você pode criar manualmente:

```bash
mkdir uploads
mkdir uploads/logos
mkdir uploads/evidencias
```

5. **Execute o seed (opcional)**

Para criar dados iniciais de teste:

```bash
npm run seed
```

Isso criará uma empresa e um usuário admin:
- Email: admin@example.com
- Senha: admin123

## 🏃 Como Rodar

**Modo Desenvolvimento (com nodemon):**
```bash
npm run dev
```

**Modo Produção:**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
AgroDrones/
├── src/
│   ├── config/          # Configurações (DB, env)
│   ├── models/          # Modelos Mongoose
│   ├── routes/          # Rotas da aplicação
│   ├── middleware/      # Middlewares (auth, tenant, roles)
│   ├── services/        # Serviços (PDF, exportação CSV)
│   ├── views/           # Templates EJS
│   └── scripts/         # Scripts utilitários (seed)
├── public/              # Arquivos estáticos
│   └── css/
├── uploads/             # Uploads de arquivos
├── server.js            # Arquivo principal
├── package.json
└── .env                 # Variáveis de ambiente (não commitado)
```

## 🎨 Paleta de Cores

- **Primary (Drone Blue):** #1E5EFF
- **Secondary (Agro Green):** #2FBF71
- **Accent (Safety Orange):** #FF8A00
- **Dark (Charcoal):** #1B1F24
- **Light (Off-white):** #F6F8FA

## ✨ Funcionalidades

### Onboarding Wizard
Fluxo de 5 passos para configuração inicial da empresa:
1. Dados da Empresa
2. Endereço
3. Registro e Conformidade
4. Serviços Prestados
5. Equipe e Identidade Visual

### Cadastros Essenciais
- **Clientes:** Contratantes/Propriedades
- **Drones:** ARP (Aeronaves Remotamente Pilotadas) com registro ANAC
- **Operadores:** Equipe (piloto remoto, aplicador, RT, admin)

### Registro de Aplicações
Formulário completo com:
- Campos obrigatórios conforme MAPA (Portaria 298/2021, art. 10)
- Dados meteorológicos
- Relatório Operacional (modelo Anexo XI)
- Upload de evidências (fotos, PDFs, croqui)
- Autopreenchimento com configurações padrão
- Funcionalidade de duplicar aplicação

### Relatórios e Exportações
- **Filtros avançados:** período, cliente, município/UF, tipo, drone, operador, cultura
- **Exportação CSV:** Lista completa de aplicações filtradas
- **PDF Individual:** Relatório Operacional (Anexo XI) por aplicação
- **PDF Consolidado:** Relatório mensal/periodal consolidado

### Dashboard
- Cards com estatísticas (aplicações do mês, hoje, clientes, drones)
- Tabela com últimas aplicações
- Ações rápidas (Ver, Editar, Gerar PDF)

### Multi-tenant
- Todos os dados filtrados por `companyId`
- Isolamento completo entre empresas
- Middleware de tenant automático

### Autenticação e Autorização
- Autenticação por sessão
- Roles: Admin, Operador, RT (Responsável Técnico)
- Permissões por role:
  - **Admin:** Acesso total
  - **Operador:** Criar/editar aplicações, ver relatórios
  - **RT:** Ver tudo + gerar relatórios

## 📄 Modelos de Dados

### Company
Empresa prestadora de serviço com dados completos de cadastro e configurações.

### User
Usuários do sistema vinculados a uma empresa.

### Client
Clientes/Contratantes com dados da propriedade.

### Drone
Aeronaves com identificação ANAC.

### Operator
Operadores/Equipe (piloto, aplicador, RT, admin).

### Application
Aplicações registradas com todos os campos obrigatórios MAPA.

### File
Arquivos enviados (evidências, croqui, logo).

## 🔒 Segurança

- Senhas hashadas com bcryptjs
- Sessões armazenadas no MongoDB
- Uploads sanitizados (apenas imagens e PDFs)
- Validação de dados no backend
- Middleware de autenticação em todas as rotas protegidas
- Multi-tenant com isolamento por `companyId`

## 📝 Licença

ISC

## 🤝 Contribuindo

Este é um MVP. Sugestões e melhorias são bem-vindas!

## 📧 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

