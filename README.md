# 🎯 Teste Vortex - Sistema de Indicações Seguro

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)

Sistema completo de cadastro de usuários com **sistema de indicações seguro**, **autenticação JWT**, **pontuação em tempo real** e **medidas anti-fraude**. Desenvolvido com Next.js 15 + React 19, priorizando segurança e experiência do usuário.

## 🚀 Funcionalidades Principais

### 🔐 **Autenticação & Segurança**
- **Autenticação JWT** com tokens seguros (expiração: 24h)
- **Hash de senhas** com bcrypt (salt rounds: 12)
- **Proteção anti-fraude**: Prevenção de auto-referência
- **Validação dupla**: Front-end + Back-end
- **Redirecionamento inteligente**: Usuários logados não acessam registro

### 📊 **Sistema de Indicações**
- **Links únicos** de indicação para cada usuário
- **Pontuação automática**: +1 ponto por indicação válida
- **Atualização em tempo real**: Auto-refresh a cada 10 segundos
- **Botão de refresh manual** para atualização instantânea
- **Prevenção de duplicatas**: Mesmo email não pode ser referenciado duas vezes

### 🎨 **Interface & UX**
- **Design responsivo** (mobile-first)
- **CSS puro** (sem frameworks)
- **Feedback visual** em todas as ações
- **Loading states** e animações suaves
- **Copiar link** com confirmação visual

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Versão | Justificativa |
|-----------|------------|---------|---------------|
| **Frontend** | Next.js | 15.5.4 | App Router, SSR, API Routes integradas |
| **UI Library** | React | 19.1.0 | Performance otimizada, hooks modernos |
| **Language** | TypeScript | 5.0 | Type safety, melhor DX |
| **Database** | Supabase | 2.58.0 | PostgreSQL managed, real-time |
| **Auth** | JWT | 9.0.2 | Stateless, escalável |
| **Security** | bcryptjs | 3.0.2 | Hash de senhas seguro |
| **Styling** | CSS Puro | - | Controle total, sem dependências |

## 🔒 Medidas de Segurança Implementadas

### ✅ **Autenticação Robusta**
```typescript
// JWT com expiração e validação
const token = jwt.sign(userData, secret, { expiresIn: '1d' });
```

### ✅ **Proteção Anti-Fraude**
```typescript
// Prevenção de auto-referência
if (referrer.email === email) {
  return { error: 'Não é possível usar seu próprio código de referência' };
}
```

### ✅ **Prevenção de Duplicatas**
```typescript
// Verificação de referência duplicada
const existingReferral = await supabase
  .from('referrals')
  .select('id')
  .eq('referrer_id', referrer.id)
  .eq('referred_email', email);
```

## 📦 Instalação e Configuração

### 1. **Clone e Dependências**
```bash
git clone https://github.com/devNatanfreitas/teste-vortex.git
cd teste-vortex
npm install
```

### 2. **Configuração do Supabase**

1. Crie uma conta em [Supabase](https://supabase.com)
2. Crie um novo projeto
3. O banco já está configurado e pronto para uso

### 3. **Variáveis de Ambiente**

Crie `.env.local` na raiz:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
```

### 4. **Executar o Projeto**
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🎯 Como Usar

### 🔑 **Fluxo de Autenticação**

1. **Registro**: `/register` ou com referência `/register?ref=ABC123`
2. **Login**: `/login` com email/senha
3. **Perfil**: Redirecionamento automático para `/profile`
4. **Logout**: Botão no perfil (limpa tokens)

### 📈 **Sistema de Pontuação**

- **Ganhar pontos**: Compartilhe seu link de referência
- **Atualização**: Automática (10s) + manual (botão 🔄)
- **Visualização**: Tempo real na página de perfil

### 🔗 **Links de Indicação**

Formato: `https://seusite.com/register?ref=CODIGO_UNICO`

Cada usuário recebe um código único (ex: `A7B8C9D0`)

## 📱 Design Responsivo

### 📊 **Breakpoints**
- **Mobile**: < 768px (design principal)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### 🎨 **Características**
- **Mobile-first** approach
- **Touch-friendly** (botões 44px+)
- **Tipografia** escalável
- **Grid flexível** com CSS Grid/Flexbox

## 🗂️ Estrutura do Projeto

```
teste-vortex/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── login/route.ts       # API de autenticação
│   │   │   ├── register/route.ts    # API de registro seguro
│   │   │   └── profile/route.ts     # API de perfil protegida
│   │   ├── login/page.tsx           # Página de login
│   │   ├── register/page.tsx        # Página de registro
│   │   ├── profile/page.tsx         # Dashboard do usuário
│   │   ├── layout.tsx               # Layout global
│   │   ├── page.tsx                 # Página inicial
│   │   └── globals.css              # Estilos globais
│   └── lib/
│       ├── jwt.ts                   # Utilitários JWT
│       └── supabaseServer.ts        # Cliente Supabase
├── public/                          # Assets estáticos
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 🧪 Validações Implementadas

### 📝 **Frontend (Tempo Real)**
```typescript
// Validação de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validação de senha
const hasLetter = /[a-zA-Z]/.test(password);
const hasNumber = /\d/.test(password);
const minLength = password.length >= 8;
```

### 🛡️ **Backend (Segurança)**
```typescript
// Verificação de duplicatas
const { data: existingUser } = await supabase
  .from('users')
  .select('id')
  .eq('email', email);

// Hash seguro
const hashedPassword = await bcrypt.hash(password, 12);
```

## 📊 Banco de Dados (Supabase)

### 👤 **Tabela: users**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária |
| `name` | VARCHAR(255) | Nome completo |
| `email` | VARCHAR(255) | Email único |
| `password` | VARCHAR(255) | Hash bcrypt |
| `referral_code` | VARCHAR(10) | Código único |
| `score` | INTEGER | Pontuação atual |

### 🔗 **Tabela: referrals**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `referrer_id` | UUID | Quem indicou |
| `referred_id` | UUID | Quem foi indicado |
| `referred_email` | VARCHAR(255) | Email indicado |



## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com Turbopack
npm run dev

# Build otimizado para produção
npm run build

# Executar versão de produção
npm start
```

## ✅ Conformidade com Requisitos

### 📋 **Requisitos Funcionais** ✅
- [x] Página de cadastro com validação
- [x] Página de perfil com pontuação
- [x] Sistema de indicações funcional
- [x] Botão copiar link implementado
- [x] Atualização de pontuação (**melhorada**: tempo real)

### 🔧 **Requisitos Técnicos** ✅
- [x] CSS puro (zero frameworks)
- [x] Design responsivo completo
- [x] API REST organizada
- [x] Banco PostgreSQL (Supabase)
- [x] Justificativas técnicas documentadas

### 🚀 **Funcionalidades Extras**
- [x] **Autenticação JWT** (não solicitada)
- [x] **Segurança anti-fraude** (não solicitada)
- [x] **Atualização tempo real** (melhoria)
- [x] **TypeScript** completo (melhoria)
- [x] **Proteções de segurança** (melhoria)

## 🎯 Justificativas Técnicas

### **Next.js 15 + React 19**
- **App Router**: Roteamento moderno e performático
- **API Routes**: Backend integrado, sem servidor separado
- **SSR**: Melhor SEO e performance inicial
- **Turbopack**: Build ultra-rápido em desenvolvimento

### **TypeScript**
- **Type Safety**: Redução de bugs em runtime
- **IntelliSense**: Melhor experiência de desenvolvimento
- **Refatoração**: Mudanças seguras no código

### **CSS Puro**
- **Sem dependências**: Bundle menor e mais controle
- **Performance**: CSS otimizado e específico
- **Manutenibilidade**: Estilos organizados e reutilizáveis

### **Supabase**
- **PostgreSQL**: Banco relacional robusto
- **Real-time**: Suporte nativo para atualizações
- **Managed**: Sem necessidade de configuração de infraestrutura

## 🤖 Colaboração com IA

Durante o desenvolvimento deste projeto, utilizei ferramentas de IA de forma específica e estratégica em duas áreas principais. Aqui está um detalhamento preciso de como a IA contribuiu para o projeto:

### 🔒 **Medidas de Segurança do Backend**
**Uso Principal**: A IA foi utilizada para identificar e implementar práticas de segurança robustas no backend.

**Contribuições Específicas**:
- **Prevenção Anti-Fraude**: Implementação de verificação para evitar auto-referência no sistema de indicações
- **Hash de Senhas**: Orientação sobre configuração adequada do bcrypt com salt rounds seguros
- **Validação JWT**: Implementação de tokens seguros com expiração apropriada
- **Sanitização e Validações**: Dupla validação de dados entre frontend e backend
- **Prevenção de Duplicatas**: Verificações para evitar referências duplicadas no banco

**Exemplos de Implementação**:
```typescript
// Anti-fraude: Prevenção de auto-referência
if (referrer.email === email) {
  return { error: 'Não é possível usar seu próprio código de referência' };
}

// Hash seguro implementado com ajuda da IA
const hashedPassword = await bcrypt.hash(password, 12);

// JWT com configuração de segurança sugerida pela IA
const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '1d' });
```

### 🎨 **Frontend - Organização e Estilização**
**Uso Principal**: A IA auxiliou na organização do código frontend e na estruturação dos estilos CSS.

**Áreas de Contribuição**:
- **CSS Responsivo**: Criação de layouts flexíveis e mobile-first
- **Estrutura de Estilos**: Organização hierárquica e reutilização de classes CSS
- **Design System**: Padronização de cores, espaçamentos e tipografia
- **Layout Grid**: Implementação de sistemas de grid com CSS puro

**Exemplo de Organização**:
```css
/* Estrutura CSS organizada com ajuda da IA */
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Sistema responsivo implementado */
@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }
}
```

### 🧠 **Aprendizados da Colaboração**

#### **Pontos Positivos**:
1. **Segurança Aprimorada**: A IA identificou vulnerabilidades que poderiam passar despercebidas
2. **Código Mais Organizado**: Sugestões para melhor estruturação de arquivos e estilos
3. **Boas Práticas**: Implementação de padrões de segurança e organização reconhecidos
4. **Eficiência**: Aceleração no desenvolvimento das partes onde foi utilizada

#### **Limitações Encontradas**:
1. **Contexto Específico**: Nem todas as sugestões se adequavam ao projeto específico
2. **Validação Manual**: Todas as implementações precisaram ser testadas e validadas
3. **Adaptação Necessária**: Algumas soluções genéricas precisaram ser customizadas

#### **Lições Aprendidas**:
- **Uso Focado**: A IA foi mais efetiva quando usada em áreas específicas (segurança e organização)
- **Parceria Consciente**: Funcionou melhor como ferramenta de apoio, não como substituto
- **Validação Crítica**: Importante sempre avaliar e testar as sugestões da IA
- **Conhecimento Base**: Experiência prévia foi fundamental para filtrar as melhores sugestões

### 🎯 **Resultado Final**
A colaboração focada com IA resultou em:
- **Backend mais seguro** com medidas anti-fraude robustas
- **Frontend bem organizado** com CSS estruturado e responsivo
- **Código mais limpo** e fácil de manter
- **Desenvolvimento direcionado** nas áreas onde a IA mais agrega valor

A experiência mostrou que o uso estratégico e focado da IA em áreas específicas (segurança do backend e organização/estilização do frontend) pode trazer benefícios significativos quando aplicado com conhecimento e validação adequados.






