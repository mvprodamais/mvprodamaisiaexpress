import express from 'express';
import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { SessionManager } from './sessionManager.js';
import { ReservationManager } from './reservationManager.js';
import { WhapiManager } from './whapiManager.js';
import { ConversationFlow } from './conversationFlow.js';
import { CONVERSATION_STATES } from './config.js';

const app = express();
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// ROTAS DE WEBHOOK DO WHAPI
// ============================================================================

app.get('/whapi/webhook', (req, res) => {
  // Verificação do webhook (desafio do WHAPI)
  const token = req.query.token;
  const challenge = req.query.challenge;

  console.log('Webhook verification request:', { token, challenge });

  // Aqui você pode verificar o token se necessário
  // Por enquanto, apenas retornamos o challenge
  if (challenge) {
    res.send(challenge);
  } else {
    res.status(400).json({ error: 'Challenge not provided' });
  }
});

app.post('/whapi/webhook', async (req, res) => {
  try {
    const data = req.body;
    console.log('Webhook received:', JSON.stringify(data, null, 2));

    // Responder imediatamente ao WHAPI
    res.status(200).json({ success: true });

    // Processar mensagem de forma assíncrona
    if (data.messages && Array.isArray(data.messages)) {
      for (const message of data.messages) {
        await handleIncomingMessage(message);
      }
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// FUNÇÃO PARA PROCESSAR MENSAGENS RECEBIDAS
// ============================================================================

async function handleIncomingMessage(message) {
  try {
    // Extrair informações da mensagem (suportar ambos os formatos: inglês e português)
    const phoneNumber = message.from || message.de || message.phone_number;
    const userText = (message.text?.body || message.texto?.corpo || message.body || '').trim();

    if (!phoneNumber || !userText) {
      console.log('Mensagem incompleta, ignorando');
      return;
    }

    console.log(`Mensagem de ${phoneNumber}: ${userText}`);

    // Processar fluxo conversacional
    const result = ConversationFlow.handleUserMessage(phoneNumber, userText);

    // Enviar resposta
    if (result.response) {
      await WhapiManager.sendMessage(phoneNumber, result.response);
    }

    // Se foi selecionada uma viagem, gerar pré-reserva
    if (result.state === CONVERSATION_STATES.TRIP_SELECTED) {
      const sessionData = result.sessionData;

      const tripData = {
        origin: sessionData.origin,
        destination: sessionData.destination,
        date: sessionData.outboundDate,
        time: sessionData.selectedTrip.time,
        seats: sessionData.seats,
        seatType: sessionData.seatType,
        company: sessionData.selectedTrip.company,
        price: sessionData.selectedTrip.price,
      };

      // Criar pré-reserva
      const reservation = await ReservationManager.createReservation(phoneNumber, tripData);

      // Formatar mensagem com detalhes da reserva
      const reservationMessage = ReservationManager.formatReservationMessage(reservation);

      // Enviar mensagem com detalhes
      await WhapiManager.sendMessage(phoneNumber, reservationMessage);

      // Enviar QR Code como imagem
      if (reservation.qrCodePath && fs.existsSync(reservation.qrCodePath)) {
        const caption = `📱 Código: ${reservation.numericCode}\n🔐 ${reservation.alphanumericCode}\n\nMostre no guichê da lotérica!`;
        await WhapiManager.sendImage(phoneNumber, reservation.qrCodePath, caption);
      }

      // Limpar sessão após conclusão
      SessionManager.clearSession(phoneNumber);
    }
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
  }
}

// ============================================================================
// ROTAS DE UTILIDADE
// ============================================================================

// Servir QR Codes
app.get('/qr/:codigo', (req, res) => {
  try {
    const codigo = req.params.codigo;
    const qrPath = path.join('./qr_codes', `${codigo}.png`);

    if (!fs.existsSync(qrPath)) {
      return res.status(404).json({ error: 'QR Code não encontrado' });
    }

    res.setHeader('Content-Type', 'image/png');
    res.sendFile(path.resolve(qrPath));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Status do bot
app.get('/status', async (req, res) => {
  try {
    const whapiStatus = await WhapiManager.testConnection();

    res.json({
      status: 'running',
      timestamp: new Date().toISOString(),
      whapi: whapiStatus,
      webhookUrl: `${req.protocol}://${req.get('host')}/whapi/webhook`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Informações de configuração (apenas para debug)
app.get('/config', (req, res) => {
  res.json({
    port: CONFIG.PORT,
    nodeEnv: CONFIG.NODE_ENV,
    whapiConfigured: !!CONFIG.WHAPI_TOKEN,
    webhookUrl: `${req.protocol}://${req.get('host')}/whapi/webhook`,
  });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

const PORT = CONFIG.PORT;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🚌 WhatsApp Bus Booking Bot                                  ║
║                                                                ║
║  Status: ✅ Servidor rodando                                  ║
║  Porta: ${PORT}                                                    ║
║  Ambiente: ${CONFIG.NODE_ENV}                                      ║
║                                                                ║
║  Webhook URL:                                                  ║
║  http://localhost:${PORT}/whapi/webhook                         ║
║                                                                ║
║  Health Check:                                                 ║
║  http://localhost:${PORT}/health                                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);

  // Verificar configuração do WHAPI
  if (!CONFIG.WHAPI_TOKEN) {
    console.warn(`
⚠️  AVISO: WHAPI_TOKEN não está configurado!

Para que o bot funcione, você precisa:
1. Obter o token do WHAPI em https://whapi.cloud
2. Configurar a variável de ambiente WHAPI_TOKEN
3. Reiniciar o servidor

Exemplo:
  export WHAPI_TOKEN="seu_token_aqui"
  node server.js
    `);
  } else {
    console.log('✅ WHAPI_TOKEN configurado com sucesso!');
  }
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
