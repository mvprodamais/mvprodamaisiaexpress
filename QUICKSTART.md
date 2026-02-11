# ⚡ Quick Start - Bot de Passagens WhatsApp

Guia rápido para colocar o bot em produção em 5 minutos.

## 🎯 Resumo

Este é um bot de WhatsApp para consultar e reservar passagens de ônibus. Funciona 100% dentro do WhatsApp, sem necessidade de site ou app.

## 📋 O que você precisa

1. ✅ Conta WHAPI (https://whapi.cloud)
2. ✅ Token WHAPI (você obtém após login)
3. ✅ Número de WhatsApp Business (pode ser seu número pessoal)
4. ✅ GitHub (para deploy automático)

## 🚀 Deploy em 3 Passos

### Passo 1: Preparar Código

```bash
# Clonar ou copiar este projeto
cd /home/ubuntu/whatsapp-bus-booking

# Fazer commit no Git
git init
git add .
git commit -m "WhatsApp Bus Booking Bot"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/whatsapp-bus-booking.git
git push -u origin main
```

### Passo 2: Deploy no Railway (Recomendado)

1. Acessar https://railway.app
2. Clicar "New Project" → "Deploy from GitHub"
3. Selecionar seu repositório
4. Clicar "Deploy Now"
5. Aguardar deploy (2-3 minutos)

### Passo 3: Configurar Variáveis

1. No painel Railway, ir para "Variables"
2. Adicionar:
   ```
   WHAPI_TOKEN=seu_token_aqui
   NODE_ENV=production
   ```
3. Salvar

## 🔗 Obter URLs

Após deploy:

1. **URL Pública**: Copiar de "Domains" no Railway
   - Exemplo: `https://seu-projeto.railway.app`

2. **Webhook URL**: Adicionar `/whapi/webhook`
   - Exemplo: `https://seu-projeto.railway.app/whapi/webhook`

## 🔧 Configurar WHAPI

1. Acessar https://whapi.cloud
2. Ir para **Webhooks**
3. Adicionar webhook:
   - **URL**: `https://seu-projeto.railway.app/whapi/webhook`
   - **Events**: `messages`
4. Salvar

## 📱 Testar

1. Abrir WhatsApp
2. Enviar mensagem para seu número
3. Bot responde com menu

## 🎉 Pronto!

Seu bot está funcionando! Agora:

- Usuários podem consultar passagens
- Recebem pré-reserva com QR Code
- Código válido por 10 minutos
- Tudo dentro do WhatsApp

## 📚 Documentação Completa

- **README.md** - Documentação detalhada
- **DEPLOY.md** - Instruções de deploy
- **TESTING.md** - Como testar

## 🆘 Problemas?

### Bot não responde
- [ ] Verificar se WHAPI_TOKEN está configurado
- [ ] Confirmar webhook URL está correta
- [ ] Ver logs no painel Railway

### Webhook não verifica
- [ ] Confirmar que URL é acessível (testar no navegador)
- [ ] Verificar se responde com status 200

### Imagens não enviam
- [ ] Confirmar que WHAPI_TOKEN está correto
- [ ] Verificar permissões no WHAPI

## 💡 Próximos Passos

Depois que estiver funcionando:

1. **Customizar dados** - Editar cidades, viações, preços em `config.js`
2. **Adicionar banco de dados** - Persistir reservas (usar MongoDB/PostgreSQL)
3. **Integrar com sistema real** - Conectar com API de viações
4. **Melhorar UI** - Adicionar emojis, formatação, botões

## 📞 Suporte

- WHAPI Docs: https://whapi.cloud/docs
- Railway Docs: https://railway.app/docs
- Node.js: https://nodejs.org/docs

---

**Você consegue! 🚀**
