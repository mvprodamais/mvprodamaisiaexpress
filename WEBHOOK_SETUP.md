# 🔗 Configuração do Webhook WHAPI

## ✅ Seu Webhook URL

```
https://requestbin.whapi.cloud/19t6n3b1
```

Este é o endpoint onde o WHAPI enviará as mensagens que receber.

---

## 📋 Como Configurar no WHAPI

### Passo 1: Acessar Painel WHAPI

1. Ir para https://whapi.cloud
2. Fazer login com suas credenciais
3. Você estará no dashboard

### Passo 2: Localizar Webhooks

Procure por uma das seguintes opções:
- **Webhooks** (menu lateral)
- **Settings** → **Webhooks**
- **Integrations** → **Webhooks**

### Passo 3: Adicionar Novo Webhook

1. Clicar em "Add Webhook" ou "New Webhook"
2. Preencher os campos:

| Campo | Valor |
|-------|-------|
| **URL** | `https://requestbin.whapi.cloud/19t6n3b1` |
| **Events** | Marcar `messages` |
| **Active** | ✅ Ativado |

3. Clicar em "Save" ou "Create"

### Passo 4: Testar Webhook

1. No WHAPI, procurar por "Test Webhook" ou "Send Test"
2. Clicar para enviar uma mensagem de teste
3. Você deve receber uma resposta 200

---

## 🔄 Fluxo de Mensagens

```
WhatsApp User
    ↓
WHAPI recebe mensagem
    ↓
WHAPI envia para webhook URL
    ↓
https://requestbin.whapi.cloud/19t6n3b1
    ↓
Você vê a mensagem em RequestBin
```

---

## 📊 RequestBin

RequestBin é uma ferramenta para inspecionar webhooks. Você pode:

1. **Ver todas as requisições** enviadas
2. **Inspecionar headers** e body
3. **Testar integração** antes de usar seu próprio servidor

### Acessar RequestBin

1. Ir para https://requestbin.whapi.cloud/19t6n3b1
2. Você verá todas as requisições POST recebidas
3. Clicar em cada uma para ver detalhes

---

## 🧪 Teste Rápido

### 1. Enviar Mensagem de Teste

```bash
# Simular mensagem do WHAPI
curl -X POST https://requestbin.whapi.cloud/19t6n3b1 \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {
        "body": "Oi, bot!"
      }
    }]
  }'
```

### 2. Verificar no RequestBin

1. Acessar https://requestbin.whapi.cloud/19t6n3b1
2. Você verá a requisição POST
3. Clicar para ver detalhes completos

---

## 🔐 Segurança

### Verificação de Origem

Para garantir que as mensagens vêm realmente do WHAPI:

1. WHAPI envia header `Authorization` com token
2. Você pode verificar esse token no seu servidor
3. Rejeitar requisições sem token válido

### Exemplo de Verificação

```javascript
app.post('/whapi/webhook', (req, res) => {
  const authHeader = req.headers.authorization;
  
  // Verificar se token é válido
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Processar mensagem
  // ...
});
```

---

## 📝 Estrutura da Mensagem

Quando o WHAPI envia uma mensagem, o formato é:

```json
{
  "messages": [
    {
      "from": "5511987654321",
      "id": "wamid.xxxxx",
      "timestamp": 1234567890,
      "type": "text",
      "text": {
        "body": "Conteúdo da mensagem"
      }
    }
  ]
}
```

---

## 🚀 Próximo Passo: Deploy em Servidor Real

Quando estiver pronto, você pode:

1. **Deploy no Railway/Render/Fly.io**
2. **Atualizar webhook URL** no WHAPI para sua URL pública
3. **Testar fluxo completo** no WhatsApp

### Exemplo de URL Pública

```
https://seu-projeto.railway.app/whapi/webhook
```

---

## ✅ Checklist

- [ ] Acessei WHAPI
- [ ] Encontrei seção de Webhooks
- [ ] Adicionei novo webhook
- [ ] Configurei URL: `https://requestbin.whapi.cloud/19t6n3b1`
- [ ] Selecionei evento `messages`
- [ ] Salvei webhook
- [ ] Testei webhook
- [ ] Recebi resposta 200
- [ ] Acessei RequestBin para ver requisições

---

## 🆘 Troubleshooting

### Webhook não verifica
- [ ] Confirmar que URL está correta
- [ ] Verificar se RequestBin está acessível
- [ ] Tentar novamente

### Não vejo requisições no RequestBin
- [ ] Confirmar que webhook está ativado no WHAPI
- [ ] Verificar se número de WhatsApp está conectado
- [ ] Enviar mensagem de teste

### Erro 404 ou 500
- [ ] Verificar URL do webhook
- [ ] Confirmar que RequestBin está online
- [ ] Tentar com URL diferente

---

## 📞 Suporte

- **WHAPI**: https://whapi.cloud/docs
- **RequestBin**: https://requestbin.com/docs
- **HTTP Status Codes**: https://httpwg.org/specs/rfc7231.html#status.codes

---

**Seu webhook está configurado e pronto para receber mensagens!** ✅
