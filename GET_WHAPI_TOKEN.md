# 🔑 Como Obter Token WHAPI

Guia passo a passo para gerar seu token de autenticação WHAPI.

## 📱 Pré-requisitos

- Conta WHAPI criada (https://whapi.cloud)
- Já fez login na plataforma

## 🎯 Passo a Passo

### 1. Acessar Painel WHAPI

1. Ir para https://whapi.cloud
2. Fazer login com suas credenciais
3. Você será redirecionado para o dashboard

### 2. Localizar Seção de API

Procure por uma das seguintes opções no menu:

- **API Keys**
- **Settings** → **API**
- **Integrations** → **API**
- **Developer** → **API Keys**

(A localização pode variar conforme atualização do WHAPI)

### 3. Gerar Novo Token

1. Clicar em "Generate Token" ou "Create API Key"
2. Uma janela pode aparecer pedindo:
   - **Name**: "WhatsApp Bus Bot" (ou qualquer nome)
   - **Permissions**: Selecionar:
     - ✅ Send Messages
     - ✅ Receive Messages
     - ✅ Send Images
     - ✅ Manage Webhooks
3. Clicar em "Generate" ou "Create"

### 4. Copiar Token

O token será exibido como:

```
Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Ou simplesmente:

```
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANTE**: Copiar e guardar em local seguro! Não compartilhe com ninguém.

## 🔒 Guardar Token com Segurança

### Opção 1: Variável de Ambiente Local

```bash
# No seu computador, criar arquivo .env
echo "WHAPI_TOKEN=seu_token_aqui" > .env
```

### Opção 2: Arquivo Seguro

```bash
# Criar arquivo protegido
echo "seu_token_aqui" > ~/.whapi_token
chmod 600 ~/.whapi_token
```

### Opção 3: Gerenciador de Senhas

Usar 1Password, LastPass, ou similar para guardar.

## 🚀 Usar Token no Deploy

### Railway

1. No painel Railway, ir para "Variables"
2. Adicionar nova variável:
   - **Key**: `WHAPI_TOKEN`
   - **Value**: `seu_token_aqui`
3. Salvar

### Render

1. No painel Render, ir para "Environment"
2. Adicionar:
   - **Key**: `WHAPI_TOKEN`
   - **Value**: `seu_token_aqui`
3. Salvar

### Fly.io

```bash
flyctl secrets set WHAPI_TOKEN="seu_token_aqui"
```

## ✅ Verificar Token

Após configurar, testar se está funcionando:

```bash
# Substituir SEU_TOKEN
curl -H "Authorization: Bearer SEU_TOKEN" \
  https://api.whapi.cloud/profile
```

Se retornar informações do seu perfil, o token está correto! ✅

## 🔄 Renovar Token

Se o token expirar ou você quiser gerar um novo:

1. Voltar à seção de API Keys no WHAPI
2. Procurar pelo token antigo
3. Clicar em "Revoke" ou "Delete"
4. Gerar novo token
5. Atualizar em todos os lugares onde estava configurado

## 🆘 Problemas

### Token não funciona
- [ ] Verificar se foi copiado corretamente (sem espaços)
- [ ] Confirmar que não expirou
- [ ] Tentar gerar novo token

### Não consigo encontrar a seção de API
- [ ] Procurar no menu lateral
- [ ] Verificar se há aba "Settings" ou "Developer"
- [ ] Contatar suporte WHAPI (https://whapi.cloud/support)

### Token expirou
- [ ] Gerar novo token
- [ ] Atualizar em todas as plataformas (Railway, Render, etc)

## 📋 Checklist

- [ ] Acessei https://whapi.cloud
- [ ] Fiz login
- [ ] Encontrei seção de API Keys
- [ ] Gerei novo token
- [ ] Copiei o token
- [ ] Guardei em local seguro
- [ ] Configurei no Railway/Render/Fly.io
- [ ] Testei se funciona

## 🎉 Próximo Passo

Depois de obter o token:

1. Configurar em seu servidor (Railway/Render/Fly.io)
2. Configurar webhook no WHAPI
3. Conectar número de WhatsApp
4. Testar bot

---

**Você conseguiu! Agora é só configurar no servidor.** 🚀
