import axios from 'axios';
import { CONFIG } from './config.js';
import fs from 'fs';

// Criar instância do axios com configuração correta
const api = axios.create({
  baseURL: CONFIG.WHAPI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${CONFIG.WHAPI_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export class WhapiManager {
  static async sendMessage(phoneNumber, message) {
    try {
      if (!CONFIG.WHAPI_TOKEN) {
        console.error('❌ WHAPI_TOKEN não configurado');
        return false;
      }

      // Formatar número: remover caracteres especiais
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      console.log(`📤 Enviando mensagem para ${formattedPhone}...`);
      console.log(`📝 Mensagem: ${message}`);

      // Usar endpoint correto do WHAPI com formato correto
      const response = await api.post('/messages/text', {
        typing_time: 0,
        to: formattedPhone,
        body: message,
      });

      console.log(`✅ Mensagem enviada com sucesso para ${formattedPhone}`);
      console.log(`📊 Resposta:`, response.data);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem via WHAPI:');
      console.error('Status:', error.response?.status);
      console.error('Dados:', error.response?.data);
      console.error('Mensagem:', error.message);
      return false;
    }
  }

  static async sendImage(phoneNumber, imagePath, caption = '') {
    try {
      if (!CONFIG.WHAPI_TOKEN) {
        console.error('❌ WHAPI_TOKEN não configurado');
        return false;
      }

      // Verificar se arquivo existe
      if (!fs.existsSync(imagePath)) {
        console.error(`❌ Arquivo não encontrado: ${imagePath}`);
        return false;
      }

      const formattedPhone = phoneNumber.replace(/\D/g, '');

      console.log(`📤 Enviando imagem para ${formattedPhone}...`);

      // Ler arquivo como buffer
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      // Usar endpoint correto do WHAPI para imagens
      const response = await api.post('/messages/image', {
        typing_time: 0,
        to: formattedPhone,
        image: base64Image,
        caption: caption || undefined,
      });

      console.log(`✅ Imagem enviada com sucesso para ${formattedPhone}`);
      console.log(`📊 Resposta:`, response.data);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar imagem via WHAPI:');
      console.error('Status:', error.response?.status);
      console.error('Dados:', error.response?.data);
      console.error('Mensagem:', error.message);
      return false;
    }
  }

  static async sendMessageWithImage(phoneNumber, message, imagePath) {
    // Enviar mensagem de texto primeiro
    await this.sendMessage(phoneNumber, message);

    // Depois enviar a imagem com legenda
    if (imagePath && fs.existsSync(imagePath)) {
      // Extrair apenas a legenda da mensagem (última parte)
      const caption = message.split('\n').slice(-3).join('\n');
      await this.sendImage(phoneNumber, imagePath, caption);
    }
  }

  static async testConnection() {
    try {
      if (!CONFIG.WHAPI_TOKEN) {
        console.warn('⚠️ WHAPI_TOKEN não configurado');
        return { success: false, message: 'WHAPI_TOKEN não configurado' };
      }

      console.log('🔍 Testando conexão com WHAPI...');

      const response = await api.get('/profile');
      
      console.log('✅ Conexão com WHAPI bem-sucedida!');
      console.log('📊 Dados do perfil:', response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Erro ao testar conexão com WHAPI:');
      console.error('Status:', error.response?.status);
      console.error('Dados:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }
}
