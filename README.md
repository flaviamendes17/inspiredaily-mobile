# 🚀 Rotas Privadas V2 - Expo Router + AsyncStorage

## Versão melhorada com Expo Router e persistência de dados

### 🆕 O que há de novo nesta versão:

- ✅ **Expo Router** - Navegação baseada em arquivos (file-based routing)
- ✅ **AsyncStorage** - Persistência de dados local
- ✅ **Cadastro de Usuários** - Sistema completo de criação de contas
- ✅ **Login Persistente** - Dados salvos mesmo após fechar o app
- ✅ **Rotas Privadas Automáticas** - Proteção inteligente de rotas
- ✅ **Validação Avançada** - Email, senha e campos obrigatórios
- ✅ **Navegação por Tabs** - Home e Perfil

---

## 📁 Estrutura do Projeto

```
rotas-privadas-v2/
├── app/
│   ├── _layout.js                 # Layout raiz com AuthProvider
│   ├── index.js                   # Rota inicial (redireciona)
│   ├── (auth)/
│   │   ├── _layout.js             # Layout de autenticação
│   │   ├── login.js               # Tela de login
│   │   └── register.js            # Tela de cadastro
│   └── (tabs)/
│       ├── _layout.js             # Layout com tabs
│       ├── home.js                # Tela home (privada)
│       └── profile.js             # Tela perfil (privada)
├── contexts/
│   └── AuthContext.js             # Context com proteção de rotas
└── utils/
    └── storage.js                 # Funções do AsyncStorage
```

---

## 📦 Instalação

```bash
cd rotas-privadas-v2
npm install
```

---

## 🚀 Como Executar

```bash
npx expo start
```

Depois:
- Pressione `w` para web
- Escaneie QR code com Expo Go
- Ou pressione `a` para Android

---

## 🎯 Como Funciona

### 1. Cadastro de Nova Conta
1. Abra o app (vai para tela de login)
2. Clique em "Cadastre-se"
3. Preencha: Nome, Email e Senha
4. Clique em "Cadastrar"
5. Conta criada e login automático! ✅

### 2. Login
1. Digite email e senha
2. Clique em "Entrar"
3. Se credenciais corretas, acessa área privada ✅

### 3. Persistência
- Os dados ficam salvos no AsyncStorage
- Mesmo fechando o app, você continua logado
- Use "Sair" para fazer logout

### 4. Rotas Privadas
- `/home` e `/profile` são rotas privadas
- Só acessíveis após login
- Tentativa de acesso sem login → redireciona para login

---

## 🔐 Recursos de Segurança

- ✅ Validação de email (regex)
- ✅ Senha mínimo 6 caracteres
- ✅ Confirmação de senha
- ✅ Verificação de email duplicado
- ✅ Proteção automática de rotas

---

## 💾 AsyncStorage

### O que é salvo:
- **Usuário logado** - Dados do usuário atual
- **Banco de usuários** - Todos os usuários cadastrados

### Funções disponíveis:
- `saveUser()` - Salvar usuário logado
- `getUser()` - Obter usuário logado
- `removeUser()` - Remover usuário (logout)
- `getAllUsers()` - Listar todos os usuários
- `saveNewUser()` - Cadastrar novo usuário
- `validateLogin()` - Validar credenciais

---

## 🎨 Diferenças da V1

| Recurso | V1 (Navigation) | V2 (Expo Router) |
|---------|----------------|------------------|
| Navegação | React Navigation | Expo Router |
| Persistência | ❌ Não | ✅ AsyncStorage |
| Cadastro | Simples | Completo com validação |
| Rotas | Manual | File-based (automático) |
| Tabs | ❌ Não | ✅ Sim |
| Proteção | Context manual | Automática no layout |

---

## 🔄 Fluxo de Navegação

```
App Inicia
    ↓
AuthContext carrega dados do AsyncStorage
    ↓
Usuário logado? 
    ├─ SIM → (tabs)/home
    └─ NÃO → (auth)/login
              ↓
       Fazer cadastro? 
              ├─ SIM → (auth)/register → Login automático → (tabs)/home
              └─ NÃO → Login → (tabs)/home
```

---

## 📚 Tecnologias

- **Expo SDK 51+**
- **Expo Router** - Navegação moderna
- **AsyncStorage** - Storage local
- **React Native** - Framework
- **JavaScript** - Linguagem

---

## 🐛 Troubleshooting

### Erro de dependências
```bash
npm install --legacy-peer-deps
```

### Limpar cache
```bash
npx expo start --clear
```

### Resetar AsyncStorage
- Entre no app
- Vá em Perfil → Sair
- Dados serão limpos

---

## 🚀 Próximos Passos

- [ ] Integrar com API backend
- [ ] Adicionar foto de perfil
- [ ] Recuperação de senha
- [ ] Criptografia de senha (bcrypt)
- [ ] Modo escuro
- [ ] Animações de transição

---

**Desenvolvido com ❤️ usando Expo Router + AsyncStorage**

