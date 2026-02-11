# 🚌 WhatsApp Bus Booking Bot

MVP de bot de WhatsApp para consulta e pré-reserva de passagens de ônibus usando WHAPI.

## 🎯 Funcionalidades

- ✅ Fluxo conversacional completo (origem → destino → datas → assentos → tipo de poltrona)
- ✅ Geração de pré-reserva com código numérico e alfanumérico
- ✅ Geração de QR Code em tempo real
- ✅ Envio de imagens via WhatsApp
- ✅ Gerenciamento de sessões por telefone
- ✅ Dados MOCK de viações e horários
- ✅ Integração com WHAPI

## 📋 Pré-requisitos

- Node.js 18+
- Conta WHAPI (https://whapi.cloud)
- Token do WHAPI

## 🚀 Instalação Local

### 1. Clonar/Preparar o Projeto

```bash
cd /home/ubuntu/whatsapp-bus-booking
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Editar `.env` e adicionar seu token WHAPI:

```
PORT=3000
WHAPI_TOKEN=seu_token_whapi_aqui
NODE_ENV=development
```

### 3. Executar Localmente

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 🌐 Deploy Automático

### Opção 1: Railway (Recomendado)

1. Acessar https://railway.app
2. Criar novo projeto
3. Conectar repositório GitHub
4. Configurar variáveis de ambiente:
   - `WHAPI_TOKEN`: seu token WHAPI
   - `NODE_ENV`: production
5. Railway fará deploy automático

### Opção 2: Render

1. Acessar https://render.com
2. Criar novo "Web Service"
3. Conectar repositório GitHub
4. Configurar:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Adicionar variáveis de ambiente
6. Deploy automático

### Opção 3: Fly.io

```bash
# Instalar CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy
flyctl launch
```

## 🔧 Configuração do WHAPI

### 1. Obter Token

1. Acessar https://whapi.cloud
2. Fazer login
3. Ir para **Settings** → **API Keys**
4. Gerar novo token
5. Copiar e guardar em local seguro

### 2. Configurar Webhook

1. No painel WHAPI, ir para **Webhooks**
2. Adicionar novo webhook:
   - **URL**: `https://seu-dominio.com/whapi/webhook`
   - **Events**: Marcar `messages`
3. Salvar

### 3. Conectar Número de Telefone

1. No WHAPI, ir para **Devices** ou **Phone Numbers**
2. Adicionar seu número de WhatsApp Business
3. Verificar número (código enviado via SMS)

## 📱 Testando o Bot

### Via WhatsApp

1. Enviar mensagem para o número configurado no WHAPI
2. Bot responde com menu inicial
3. Seguir o fluxo conversacional

### Exemplo de Conversa

```
Usuário: Oi
Bot: Bem-vindo! 👋
     Escolha uma opção:
     1️⃣ Consultar passagem
     2️⃣ Como funciona

Usuário: 1
Bot: 🏙️ De onde você quer sair?
     1 - São Paulo
     2 - Rio de Janeiro
     3 - Belo Horizonte

Usuário: 1
Bot: 🏙️ Para onde você quer ir?
     1 - São Paulo
     2 - Rio de Janeiro
     3 - Belo Horizonte

Usuário: 2
Bot: ✈️ Tipo de viagem:
     1 - Só ida
     2 - Ida e volta

Usuário: 1
Bot: 📅 Data de saída
     Digite no formato DD/MM (ex: 25/12)

Usuário: 25/12
Bot: ⏰ Qual período você prefere?
     1 - Manhã (06:00-12:00)
     2 - Tarde (12:00-18:00)
     3 - Noite (18:00-23:59)

Usuário: 1
Bot: 👥 Quantos assentos você precisa?
     Digite um número de 1 a 5

Usuário: 2
Bot: 💺 Qual tipo de poltrona?
     1 - Convencional (R$ 0)
     2 - Semi-leito (R$ 40)
     3 - Leito (R$ 80)

Usuário: 1
Bot: 🚌 Opções de viagem disponíveis:
     1 - 06:00 (6h30min)
        Viação Cometa
        R$ 89.90
     ...

Usuário: 1
Bot: ✅ PRÉ-RESERVA CONFIRMADA
     📋 Código Numérico: 4729
     🔐 Código: RM-2F5FK6US
     ... (detalhes da viagem)
     
     [QR Code enviado como imagem]
```

## 📊 Estrutura do Projeto

```
whatsapp-bus-booking/
├── server.js                 # Servidor Express principal
├── config.js                 # Configurações e constantes
├── sessionManager.js         # Gerenciamento de sessões
├── conversationFlow.js       # Lógica do fluxo conversacional
├── reservationManager.js     # Gerenciamento de pré-reservas e QR Codes
├── whapiManager.js          # Integração com WHAPI
├── package.json             # Dependências
├── .env.example             # Exemplo de variáveis de ambiente
├── .gitignore               # Arquivos a ignorar no Git
├── README.md                # Este arquivo
└── qr_codes/                # Pasta para armazenar QR Codes gerados
```

## 🔌 API Endpoints

### Webhook
- **GET** `/whapi/webhook` - Verificação do webhook (desafio WHAPI)
- **POST** `/whapi/webhook` - Receber mensagens do WHAPI

### Utilidade
- **GET** `/health` - Health check
- **GET** `/status` - Status do bot e WHAPI
- **GET** `/config` - Informações de configuração
- **GET** `/qr/:codigo` - Servir imagem do QR Code

## 🛠️ Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|------------|
| `PORT` | Porta do servidor | Não (padrão: 3000) |
| `WHAPI_TOKEN` | Token de autenticação WHAPI | Sim |
| `NODE_ENV` | Ambiente (development/production) | Não (padrão: development) |

## 📝 Fluxo de Dados

```
WhatsApp User
    ↓
WHAPI Webhook
    ↓
/whapi/webhook (POST)
    ↓
ConversationFlow.handleUserMessage()
    ↓
SessionManager (armazena estado)
    ↓
WhapiManager.sendMessage()
    ↓
WhatsApp User
```

## 🔄 Gerenciamento de Sessão

- Cada usuário (número de telefone) tem uma sessão única
- Sessões expiram após 30 minutos de inatividade
- Dados armazenados em memória (MVP)
- Para produção, considere usar Redis ou banco de dados

## 🎫 Pré-Reserva

- Validade: 10 minutos
- Código Numérico: 4 dígitos (ex: 4729)
- Código Alfanumérico: RM-XXXXXXXX (ex: RM-2F5FK6US)
- QR Code: PNG com código alfanumérico
- Armazenado em memória durante a validade

## 🐛 Troubleshooting

### Webhook não verifica
- Verificar se URL é acessível publicamente
- Confirmar que responde com status 200
- Verificar logs do servidor

### Bot não responde
- Verificar se WHAPI_TOKEN está configurado
- Confirmar que webhook está ativado no WHAPI
- Verificar se número de telefone está conectado

### Erro ao enviar imagem
- Confirmar que arquivo QR Code foi gerado
- Verificar permissões de leitura do arquivo
- Verificar se WHAPI_TOKEN tem permissão para enviar imagens

## 📞 Suporte

Para dúvidas sobre WHAPI: https://whapi.cloud/docs

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para apresentação executiva**
