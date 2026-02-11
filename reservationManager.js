import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const reservations = new Map();
const QR_DIR = './qr_codes';

// Criar diretório de QR codes se não existir
if (!fs.existsSync(QR_DIR)) {
  fs.mkdirSync(QR_DIR, { recursive: true });
}

export class ReservationManager {
  static generateReservationCode() {
    // Código numérico curto (4 dígitos)
    const numericCode = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    // Código alfanumérico (ex: RM-2F5FK6US)
    const alphanumericCode = 'RM-' + uuidv4().substring(0, 8).toUpperCase();

    return {
      numericCode,
      alphanumericCode,
    };
  }

  static async createReservation(phoneNumber, tripData) {
    const { numericCode, alphanumericCode } = this.generateReservationCode();

    const reservation = {
      id: uuidv4(),
      phoneNumber,
      numericCode,
      alphanumericCode,
      tripData,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutos
      status: 'pending',
      qrCodePath: null,
    };

    // Gerar QR Code
    const qrCodePath = path.join(QR_DIR, `${alphanumericCode}.png`);

    try {
      await QRCode.toFile(qrCodePath, alphanumericCode, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 300,
      });

      reservation.qrCodePath = qrCodePath;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }

    reservations.set(alphanumericCode, reservation);
    return reservation;
  }

  static getReservation(alphanumericCode) {
    const reservation = reservations.get(alphanumericCode);

    if (!reservation) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() > reservation.expiresAt) {
      reservations.delete(alphanumericCode);
      return null;
    }

    return reservation;
  }

  static getQRCodePath(alphanumericCode) {
    const reservation = this.getReservation(alphanumericCode);
    return reservation ? reservation.qrCodePath : null;
  }

  static getReservationDetails(alphanumericCode) {
    const reservation = this.getReservation(alphanumericCode);

    if (!reservation) {
      return null;
    }

    const timeRemaining = Math.max(0, Math.floor((reservation.expiresAt - Date.now()) / 1000));

    return {
      numericCode: reservation.numericCode,
      alphanumericCode: reservation.alphanumericCode,
      tripData: reservation.tripData,
      createdAt: new Date(reservation.createdAt).toLocaleString('pt-BR'),
      expiresIn: `${Math.floor(timeRemaining / 60)}min ${timeRemaining % 60}s`,
      status: reservation.status,
    };
  }

  static formatReservationMessage(reservation) {
    const details = this.getReservationDetails(reservation.alphanumericCode);

    if (!details) {
      return 'Pré-reserva expirada';
    }

    const trip = reservation.tripData;
    const totalPrice =
      trip.price * trip.seats +
      (trip.seatType === 'semi-leito' ? 40 * trip.seats : trip.seatType === 'leito' ? 80 * trip.seats : 0);

    return `✅ PRÉ-RESERVA CONFIRMADA

📋 Código Numérico: ${details.numericCode}
🔐 Código: ${details.alphanumericCode}

🚌 Detalhes da Viagem:
• Origem: ${trip.origin}
• Destino: ${trip.destination}
• Data: ${trip.date}
• Horário: ${trip.time}
• Assentos: ${trip.seats}
• Tipo: ${trip.seatType}
• Viação: ${trip.company}

💰 Valor Total: R$ ${totalPrice.toFixed(2)}

⏰ Válido por: ${details.expiresIn}

📍 Mostre o QR Code no guichê da lotérica para confirmar a reserva.`;
  }
}
