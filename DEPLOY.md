# 🚀 Guia de Deploy

Este documento descreve como fazer deploy automático do bot em plataformas cloud.

## ⚡ Opção 1: Railway (RECOMENDADO)

Railway oferece deploy automático, é fácil e rápido.

### Passo 1: Preparar Repositório GitHub

```bash
# Inicializar Git (se ainda não fez)
git init
git add .
git commit -m "Initial commit: WhatsApp Bus Booking Bot"
git branch -M main
git remote add origin https://github.com/seu-usuario/whatsapp-bus-booking.git
git push -u origin main
```

### Passo 2: Deploy no Railway

1. Acessar https://railway.app
2. Clicar em "New Project"
3. Selecionar "Deploy from GitHub"
4. Conectar sua conta GitHub e selecionar o repositório
5. Railway detectará automaticamente que é um projeto Node.js
6. Clicar em "Deploy Now"

### Passo 3: Configurar Variáveis de Ambiente

1. No painel do Railway, ir para "Variables"
2. Adicionar:
   - `WHAPI_TOKEN`: seu token do WHAPI
   - `NODE_ENV`: production
3. Salvar

### Passo 4: Obter URL Pública

1. No painel, ir para "Settings"
2. Em "Domains", copiar a URL gerada (ex: `https://seu-projeto.railway.app`)
3. Esta é sua URL pública!

## 🎨 Opção 2: Render

### Passo 1: Preparar Repositório GitHub

(Mesmo procedimento da Opção 1)

### Passo 2: Deploy no Render

1. Acessar https://render.com
2. Clicar em "New Web Service"
3. Conectar repositório GitHub
4. Preencher:
   - **Name**: whatsapp-bus-booking
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Clicar em "Create Web Service"

### Passo 3: Configurar Variáveis

1. Em "Environment", adicionar:
   - `WHAPI_TOKEN`: seu token
   - `NODE_ENV`: production
2. Salvar

### Passo 4: Obter URL

A URL será exibida no topo do painel (ex: `https://seu-projeto.onrender.com`)

## 🚀 Opção 3: Fly.io

### Passo 1: Instalar CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### Passo 2: Login

```bash
flyctl auth login
```

### Passo 3: Launch

```bash
cd /home/ubuntu/whatsapp-bus-booking
flyctl launch
```

Responder as perguntas:
- App name: whatsapp-bus-booking
- Region: escolher mais próximo
- Postgres: não
- Redis: não

### Passo 4: Configurar Secrets

```bash
flyctl secrets set WHAPI_TOKEN="seu_token_aqui"
flyctl secrets set NODE_ENV="production"
```

### Passo 5: Deploy

```bash
flyctl deploy
```

## 📱 Configurar Webhook no WHAPI

Depois de fazer deploy, você precisa configurar o webhook no WHAPI:

1. Acessar https://whapi.cloud
2. Ir para **Webhooks** ou **Settings**
3. Adicionar novo webhook:
   - **URL**: `https://seu-dominio-aqui.com/whapi/webhook`
   - **Events**: Marcar `messages`
4. Salvar

### Exemplos de URLs

- **Railway**: `https://seu-projeto.railway.app/whapi/webhook`
- **Render**: `https://seu-projeto.onrender.com/whapi/webhook`
- **Fly.io**: `https://seu-projeto.fly.dev/whapi/webhook`

## ✅ Verificar Deploy

Após fazer deploy, testar:

```bash
# Health check
curl https://seu-dominio.com/health

# Status
curl https://seu-dominio.com/status

# Config
curl https://seu-dominio.com/config
```

Você deve receber respostas JSON.

## 🔄 Atualizar Após Mudanças

### Railway/Render
- Fazer push para GitHub
- Deploy automático acontece automaticamente

### Fly.io
```bash
git push
flyctl deploy
```

## 🐛 Troubleshooting

### Webhook não funciona
- Verificar se URL está correta
- Confirmar que `/health` responde com status 200
- Verificar logs no painel da plataforma

### Bot não responde
- Verificar se `WHAPI_TOKEN` está configurado
- Confirmar que webhook está ativado no WHAPI
- Ver logs: `flyctl logs` (Fly.io) ou painel da plataforma

### Erro 502/503
- Geralmente significa que servidor não está respondendo
- Verificar logs da plataforma
- Reiniciar aplicação no painel

## 📊 Monitoramento

### Railway
- Dashboard mostra CPU, memória, requisições
- Logs em tempo real

### Render
- Dashboard com métricas
- Logs disponíveis

### Fly.io
```bash
flyctl status
flyctl logs
flyctl metrics
```

## 💡 Dicas

1. **Sempre use variáveis de ambiente** para tokens e senhas
2. **Nunca commite** `.env` ou tokens no Git
3. **Teste localmente** antes de fazer push
4. **Monitore logs** após deploy
5. **Configure alertas** se a plataforma oferecer

## 🆘 Suporte

- Railway: https://railway.app/docs
- Render: https://render.com/docs
- Fly.io: https://fly.io/docs
- WHAPI: https://whapi.cloud/docs

---

**Pronto para produção!** 🎉
