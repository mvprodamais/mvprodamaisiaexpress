# 🧪 Guia de Testes

Este documento descreve como testar o bot de forma manual e automatizada.

## 🏃 Teste Rápido Local

### 1. Iniciar Servidor

```bash
cd /home/ubuntu/whatsapp-bus-booking
npm install
PORT=3000 node server.js
```

Você verá:
```
╔════════════════════════════════════════════════════════════════╗
║  🚌 WhatsApp Bus Booking Bot                                  ║
║  Status: ✅ Servidor rodando                                  ║
║  Porta: 3000                                                    ║
╚════════════════════════════════════════════════════════════════╝
```

### 2. Testar Endpoints

Em outro terminal:

```bash
# Health check
curl http://localhost:3000/health

# Status
curl http://localhost:3000/status

# Config
curl http://localhost:3000/config
```

## 📨 Simular Mensagens do WHAPI

### Teste 1: Menu Inicial

```bash
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {
        "body": "Oi"
      }
    }]
  }'
```

**Resposta esperada**: Menu inicial com opções 1 e 2

### Teste 2: Fluxo Completo

Simular conversa passo a passo:

```bash
# Passo 1: Usuário escolhe "Consultar passagem"
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {"body": "1"}
    }]
  }'

# Passo 2: Escolher origem (São Paulo)
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {"body": "1"}
    }]
  }'

# Passo 3: Escolher destino (Rio de Janeiro)
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {"body": "2"}
    }]
  }'

# Passo 4: Tipo de viagem (Só ida)
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {"body": "1"}
    }]
  }'

# Passo 5: Data (25/12)
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {"body": "25/12"}
    }]
  }'

# Passo 6: Período (Manhã)
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {"body": "1"}
    }]
  }'

# Passo 7: Assentos (2)
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {"body": "2"}
    }]
  }'

# Passo 8: Tipo de poltrona (Convencional)
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {"body": "1"}
    }]
  }'

# Passo 9: Escolher viagem (Opção 1)
curl -X POST http://localhost:3000/whapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "5511987654321",
      "text": {"body": "1"}
    }]
  }'
```

**Resultado esperado**: 
- Pré-reserva gerada
- QR Code criado em `qr_codes/`
- Mensagem com código numérico e alfanumérico

## 🎯 Teste com Postman

### Importar Collection

1. Abrir Postman
2. Criar nova Collection: "WhatsApp Bot"
3. Adicionar requisições:

**Request 1: Health Check**
- Método: GET
- URL: `http://localhost:3000/health`

**Request 2: Status**
- Método: GET
- URL: `http://localhost:3000/status`

**Request 3: Webhook - Menu Inicial**
- Método: POST
- URL: `http://localhost:3000/whapi/webhook`
- Body (JSON):
```json
{
  "messages": [{
    "from": "5511987654321",
    "text": {"body": "Oi"}
  }]
}
```

## 📱 Teste Real com WhatsApp

### Pré-requisitos

1. ✅ Servidor rodando em produção (Railway/Render/Fly.io)
2. ✅ Token WHAPI configurado
3. ✅ Webhook configurado no WHAPI
4. ✅ Número de telefone conectado

### Procedimento

1. Abrir WhatsApp
2. Enviar mensagem para o número configurado
3. Seguir o fluxo conversacional
4. Verificar se recebe:
   - Mensagens de texto
   - QR Code como imagem
   - Códigos de pré-reserva

### Exemplo de Conversa Real

```
[Você] Oi
[Bot] Bem-vindo! 👋
      Escolha uma opção:
      1️⃣ Consultar passagem
      2️⃣ Como funciona

[Você] 1
[Bot] 🏙️ De onde você quer sair?
      1 - São Paulo
      2 - Rio de Janeiro
      3 - Belo Horizonte
      Ou digite o nome da cidade:

[Você] São Paulo
[Bot] 🏙️ Para onde você quer ir?
      1 - São Paulo
      2 - Rio de Janeiro
      3 - Belo Horizonte
      Ou digite o nome da cidade:

[Você] 2
[Bot] ✈️ Tipo de viagem:
      1 - Só ida
      2 - Ida e volta

[Você] 1
[Bot] 📅 Data de saída
      Digite no formato DD/MM (ex: 25/12)

[Você] 25/12
[Bot] ⏰ Qual período você prefere?
      1 - Manhã (06:00-12:00)
      2 - Tarde (12:00-18:00)
      3 - Noite (18:00-23:59)

[Você] 1
[Bot] 👥 Quantos assentos você precisa?
      Digite um número de 1 a 5

[Você] 2
[Bot] 💺 Qual tipo de poltrona?
      1 - Convencional (R$ 0)
      2 - Semi-leito (R$ 40)
      3 - Leito (R$ 80)

[Você] 1
[Bot] 🚌 Opções de viagem disponíveis:
      1 - 06:00 (6h30min)
         Viação Cometa
         R$ 89.90
      
      2 - 12:30 (6h45min)
         Viação 1001
         R$ 129.90
      
      3 - 19:00 (7h00min)
         Viação Gontijo
         R$ 169.90
      
      Digite o número da opção desejada (1, 2 ou 3)

[Você] 1
[Bot] ✅ Viagem selecionada!
      06:00 - Viação Cometa
      R$ 89.90
      
      Gerando pré-reserva...

[Bot] ✅ PRÉ-RESERVA CONFIRMADA
      
      📋 Código Numérico: 4729
      🔐 Código: RM-2F5FK6US
      
      🚌 Detalhes da Viagem:
      • Origem: São Paulo
      • Destino: Rio de Janeiro
      • Data: 25/12
      • Horário: 06:00
      • Assentos: 2
      • Tipo: convencional
      • Viação: Viação Cometa
      
      💰 Valor Total: R$ 179.80
      
      ⏰ Válido por: 10min 0s
      
      📍 Mostre o QR Code no guichê da lotérica para confirmar a reserva.

[Bot] [Imagem do QR Code]
      📱 Código: 4729
      🔐 RM-2F5FK6US
      
      Mostre no guichê da lotérica!
```

## 🔍 Verificar Logs

### Local
```bash
# Ver saída do servidor (já está no terminal)
# Procurar por:
# - "Webhook received:"
# - "Mensagem de [número]:"
# - "Imagem enviada para"
```

### Railway
```bash
# No painel Railway, clicar em "Logs"
# Ou via CLI (se instalado):
railway logs
```

### Render
```bash
# No painel Render, clicar em "Logs"
```

### Fly.io
```bash
flyctl logs
```

## ✅ Checklist de Testes

- [ ] Servidor inicia sem erros
- [ ] `/health` retorna 200
- [ ] `/status` retorna informações
- [ ] Webhook recebe mensagens
- [ ] Menu inicial aparece
- [ ] Fluxo conversacional funciona
- [ ] QR Code é gerado
- [ ] Pré-reserva é criada
- [ ] Códigos são únicos
- [ ] Sessão expira após 30 minutos
- [ ] Múltiplos usuários funcionam simultaneamente
- [ ] Imagens são enviadas (com WHAPI_TOKEN)

## 🐛 Debug

Se algo não funcionar:

1. **Verificar logs** do servidor
2. **Confirmar WHAPI_TOKEN** está configurado
3. **Testar endpoints** com curl
4. **Verificar formato** das mensagens
5. **Reiniciar servidor** se necessário

## 📊 Métricas para Monitorar

- Tempo de resposta do webhook
- Taxa de erro
- Número de sessões ativas
- Número de pré-reservas geradas
- Uso de memória

---

**Testes completos = Deploy seguro!** ✅
