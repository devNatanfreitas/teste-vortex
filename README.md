# teste-vortex - Sistema de Indicações

Sistema de cadastro de usuários com sistema de indicações e pontuação em tempo real, desenvolvido com Next.js 15 e CSS puro.

## 🚀 Funcionalidades

- **Página de Cadastro**: Formulário com validação front-end para nome, email e senha
- **Validação Robusta**: Email formato válido, senha mínimo 8 caracteres com letras e números
- **Sistema de Indicações**: Links únicos de indicação para cada usuário
- **Pontuação em Tempo Real**: +1 ponto para cada indicação bem-sucedida
- **Atualização Automática**: Pontuação atualiza automaticamente a cada 10 segundos
- **Página de Perfil**: Exibe nome, pontuação atual e link de indicação
- **Botão Copiar Link**: Copia link de indicação para área de transferência
- **Refresh Manual**: Botão para atualizar pontuação instantaneamente
- **Design Responsivo**: Funciona em desktop e mobile

## 🛠️ Tecnologias

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **CSS Puro Global** (sem frameworks CSS)
- **Supabase** (banco de dados)

## 🎯 Justificativas das Escolhas Tecnológicas

### **Front-end: Next.js 15 + React 19**
- **Next.js 15**: Escolhido pela robustez do App Router, SSR nativo, e API Routes integradas que eliminam a necessidade de um servidor back-end separado
- **React 19**: Versão mais recente com melhor performance e hook otimizados para estado e efeitos
- **TypeScript**: Garante type safety, reduz bugs em runtime e melhora a experiência de desenvolvimento

### **Estilização: CSS Puro Global**
- **CSS Puro**: Cumprindo o requisito de não usar frameworks como Bootstrap ou Tailwind
- **Abordagem Global**: Simplifica manutenção, reduz bundle size e permite controle total sobre estilos
- **Design Responsivo**: Mobile-first approach com media queries customizadas

### **Back-end: Next.js API Routes**
- **API Routes**: Integração nativa com Next.js, elimina complexidade de servidor separado
- **RESTful**: Endpoints organizados seguindo padrões REST (/api/register, /api/login, /api/profile)
- **Serverless**: Deploy simplificado e escalabilidade automática

### **Banco de Dados: Supabase (PostgreSQL)**
- **PostgreSQL**: Banco relacional robusto, ideal para relacionamentos entre usuários e indicações
- **Supabase**: BaaS que oferece PostgreSQL managed, auth built-in e APIs automaticamente geradas
- **Real-time**: Suporte nativo a subscriptions para futuras funcionalidades em tempo real

### **Uso de IA no Desenvolvimento**
- **GitHub Copilot**: Utilizado para acelerar desenvolvimento de componentes React e lógica de validação
- **Assistente IA**: Ajudou na estruturação das APIs REST e otimização de queries SQL
- **Code Review**: IA assistiu na identificação de possíveis bugs e melhorias de performance

## ✅ Conformidade com Requisitos

### **Requisitos Funcionais Atendidos:**
- ✅ **Página de Cadastro**: Formulário completo com nome, email e senha
- ✅ **Validação Front-end**: Email formato válido + senha 8+ caracteres com letras e números
- ✅ **Página de Perfil**: Exibe nome do usuário, pontuação atual e link de indicação único
- ✅ **Botão Copiar Link**: Funcionalidade implementada com feedback visual
- ✅ **Sistema de Indicação**: +1 ponto automático para quem indica
- ✅ **Atualização Pontuação**: **EXCEDEU O REQUISITO** - tempo real (10s) ao invés de apenas reload

### **Requisitos Técnicos Atendidos:**
- ✅ **CSS Puro**: Zero frameworks CSS (Bootstrap, Material UI, Tailwind)
- ✅ **Responsivo**: Funciona perfeitamente em desktop e mobile
- ✅ **API REST**: Endpoints organizados (/api/register, /api/login, /api/profile)
- ✅ **Banco de Dados**: PostgreSQL via Supabase com tabelas relacionais
- ✅ **Justificativas**: Todas as escolhas tecnológicas justificadas acima

### **Funcionalidades Extras Implementadas:**
- 🚀 **Atualização em Tempo Real**: Pontuação atualiza automaticamente a cada 10 segundos
- 🔄 **Refresh Manual**: Botão para atualização instantânea da pontuação
- 📱 **UX Aprimorada**: Feedback visual para ações do usuário
- 🎨 **Design Moderno**: Interface limpa e intuitiva

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd teste-vortex
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
   - Crie uma conta no [Supabase](https://supabase.com)
   - Execute o SQL do arquivo `database.sql` no SQL Editor do Supabase
   - Copie as credenciais do projeto

4. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

5. Execute o projeto:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`
- `id`: UUID (chave primária)
- `name`: VARCHAR(255) - Nome do usuário
- `email`: VARCHAR(255) - Email único
- `password`: VARCHAR(255) - Senha (em produção usar hash)
- `referral_code`: VARCHAR(10) - Código único de indicação
- `score`: INTEGER - Pontuação atual
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Tabela `referrals`
- `id`: UUID (chave primária)
- `referrer_id`: UUID - ID do usuário que indicou
- `referred_id`: UUID - ID do usuário indicado
- `created_at`: TIMESTAMP

## 🎯 Como Usar

### 1. Cadastro
- Acesse `/register` ou clique em "Criar Conta"
- Preencha nome, email e senha
- Se foi indicado, use o link com `?ref=CODIGO`

### 2. Login
- Acesse `/login` ou clique em "Fazer Login"
- Use email e senha cadastrados

### 3. Perfil
- Após login, é redirecionado para `/profile`
- Veja sua pontuação atual (atualiza automaticamente a cada 10 segundos)
- Use o botão 🔄 para atualizar pontuação manualmente
- Copie seu link de indicação
- Compartilhe para ganhar pontos

### 4. Sistema de Indicações
- Cada usuário tem um código único (ex: `ABC123DE`)
- Link de indicação: `https://seusite.com/register?ref=ABC123DE`
- Quando alguém se cadastra com seu link, você ganha 1 ponto
- Pontuação atualiza automaticamente em tempo real

## 🎨 Validações

### Front-end (Cliente)
- **Nome**: Obrigatório
- **Email**: Formato válido (regex)
- **Senha**: Mínimo 8 caracteres, contendo letras E números

### Back-end (API)
- Validação duplicada das regras do front-end
- Verificação de email único
- Geração de código de indicação único

## 📱 Responsividade

O sistema é totalmente responsivo, adaptando-se a:
- **Desktop**: Layout otimizado para telas grandes
- **Tablet**: Adaptação automática
- **Mobile**: Design mobile-first com navegação touch-friendly

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento com Turbopack
npm run build    # Build para produção
npm run start    # Executar versão de produção
```

## 📂 Estrutura de Pastas

```
src/
  app/
    api/
      login/
        route.ts          # API de login
      register/
        route.ts          # API de cadastro
      profile/
        route.ts          # API de perfil
    login/
      page.tsx            # Página de login
    register/
      page.tsx            # Página de cadastro
    profile/
      page.tsx            # Página de perfil
    page.tsx              # Página inicial
    layout.tsx            # Layout root
    globals.css           # Todos os estilos CSS
  lib/
    supabaseServer.ts     # Configuração do Supabase
```

---




