import { CITIES, MOCK_TRIPS, CONVERSATION_STATES } from './config.js';
import { SessionManager } from './sessionManager.js';

export class ConversationFlow {
  static getInitialMenu() {
    return `Bem-vindo! 👋

Escolha uma opção:

1️⃣ Consultar passagem
2️⃣ Como funciona`;
  }

  static getOriginMenu() {
    let menu = '🏙️ De onde você quer sair?\n\n';
    Object.entries(CITIES).forEach(([key, city]) => {
      menu += `${key} - ${city.name}\n`;
    });
    menu += '\nOu digite o nome da cidade:';
    return menu;
  }

  static getDestinationMenu() {
    let menu = '🏙️ Para onde você quer ir?\n\n';
    Object.entries(CITIES).forEach(([key, city]) => {
      menu += `${key} - ${city.name}\n`;
    });
    menu += '\nOu digite o nome da cidade:';
    return menu;
  }

  static getTripTypeMenu() {
    return `✈️ Tipo de viagem:

1 - Só ida
2 - Ida e volta`;
  }

  static getDateMenu(label = 'Data da viagem') {
    return `📅 ${label}

Digite no formato DD/MM (ex: 25/12)`;
  }

  static getPeriodMenu() {
    return `⏰ Qual período você prefere?

1 - Manhã (06:00-12:00)
2 - Tarde (12:00-18:00)
3 - Noite (18:00-23:59)`;
  }

  static getSeatsMenu() {
    return `👥 Quantos assentos você precisa?

Digite um número de 1 a 5`;
  }

  static getSeatTypeMenu() {
    return `💺 Qual tipo de poltrona?

1 - Convencional (R$ 0)
2 - Semi-leito (R$ 40)
3 - Leito (R$ 80)`;
  }

  static getTripsMenu(trips, seatType) {
    let menu = '🚌 Opções de viagem disponíveis:\n\n';

    trips.forEach((trip, index) => {
      const seatTypePrice = seatType === 'semi-leito' ? 40 : seatType === 'leito' ? 80 : 0;
      const totalPrice = trip.price + seatTypePrice;

      menu += `${index + 1} - ${trip.time} (${trip.duration})\n`;
      menu += `   ${trip.company}\n`;
      menu += `   R$ ${totalPrice.toFixed(2)}\n\n`;
    });

    menu += 'Digite o número da opção desejada (1, 2 ou 3)';
    return menu;
  }

  static getHowItWorks() {
    return `ℹ️ COMO FUNCIONA

1️⃣ Você consulta passagens disponíveis
2️⃣ Escolhe a opção que melhor se encaixa
3️⃣ Recebe um código e QR Code
4️⃣ Vai até a lotérica mais próxima
5️⃣ Mostra o código ou QR Code no guichê
6️⃣ Paga e confirma a reserva

Pronto! Você tem 10 minutos para confirmar.

Quer consultar uma passagem? Digite "1"`;
  }

  static parseUserInput(input) {
    return input.trim().toLowerCase();
  }

  static validateCityInput(input) {
    const numInput = parseInt(input);
    if (CITIES[numInput]) {
      return { valid: true, city: CITIES[numInput], code: numInput };
    }

    // Buscar por nome
    for (const [code, city] of Object.entries(CITIES)) {
      if (city.name.toLowerCase().includes(input)) {
        return { valid: true, city, code };
      }
    }

    return { valid: false };
  }

  static validateDateInput(input) {
    const regex = /^(\d{2})\/(\d{2})$/;
    const match = input.match(regex);

    if (!match) {
      return { valid: false };
    }

    const day = parseInt(match[1]);
    const month = parseInt(match[2]);

    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return { valid: false };
    }

    return { valid: true, date: input };
  }

  static validateNumericInput(input, min = 1, max = 3) {
    const num = parseInt(input);
    return num >= min && num <= max ? { valid: true, value: num } : { valid: false };
  }

  static getFilteredTrips(period) {
    // Filtrar viagens por período
    const periodHours = {
      morning: { start: 6, end: 12 },
      afternoon: { start: 12, end: 18 },
      night: { start: 18, end: 24 },
    };

    const hours = periodHours[period];
    if (!hours) return MOCK_TRIPS;

    return MOCK_TRIPS.filter((trip) => {
      const [tripHour] = trip.time.split(':').map(Number);
      return tripHour >= hours.start && tripHour < hours.end;
    });
  }

  static handleUserMessage(phoneNumber, userInput) {
    const session = SessionManager.getSession(phoneNumber);
    const state = session.state;
    const input = this.parseUserInput(userInput);

    let response = null;
    let nextState = state;
    let dataToSave = {};

    switch (state) {
      case CONVERSATION_STATES.INITIAL:
        if (input === '1') {
          response = this.getOriginMenu();
          nextState = CONVERSATION_STATES.ORIGIN_SELECTED;
        } else if (input === '2') {
          response = this.getHowItWorks();
          nextState = CONVERSATION_STATES.INITIAL;
        } else {
          response = `❌ Opção inválida. ${this.getInitialMenu()}`;
        }
        break;

      case CONVERSATION_STATES.ORIGIN_SELECTED:
        const originValidation = this.validateCityInput(input);
        if (originValidation.valid) {
          dataToSave.origin = originValidation.city.name;
          response = this.getDestinationMenu();
          nextState = CONVERSATION_STATES.DESTINATION_SELECTED;
        } else {
          response = `❌ Cidade não encontrada. ${this.getOriginMenu()}`;
        }
        break;

      case CONVERSATION_STATES.DESTINATION_SELECTED:
        const destValidation = this.validateCityInput(input);
        if (destValidation.valid) {
          dataToSave.destination = destValidation.city.name;
          response = this.getTripTypeMenu();
          nextState = CONVERSATION_STATES.TRIP_TYPE_SELECTED;
        } else {
          response = `❌ Cidade não encontrada. ${this.getDestinationMenu()}`;
        }
        break;

      case CONVERSATION_STATES.TRIP_TYPE_SELECTED:
        const tripTypeValidation = this.validateNumericInput(input, 1, 2);
        if (tripTypeValidation.valid) {
          dataToSave.tripType = tripTypeValidation.value === 1 ? 'one-way' : 'round-trip';
          response = this.getDateMenu('Data de saída');
          nextState = CONVERSATION_STATES.OUTBOUND_DATE_SELECTED;
        } else {
          response = `❌ Opção inválida. ${this.getTripTypeMenu()}`;
        }
        break;

      case CONVERSATION_STATES.OUTBOUND_DATE_SELECTED:
        const outboundDateValidation = this.validateDateInput(input);
        if (outboundDateValidation.valid) {
          dataToSave.outboundDate = outboundDateValidation.date;

          if (SessionManager.getData(phoneNumber, 'tripType') === 'round-trip') {
            response = this.getDateMenu('Data de retorno');
            nextState = CONVERSATION_STATES.RETURN_DATE_SELECTED;
          } else {
            response = this.getPeriodMenu();
            nextState = CONVERSATION_STATES.PERIOD_SELECTED;
          }
        } else {
          response = `❌ Data inválida. ${this.getDateMenu('Data de saída')}`;
        }
        break;

      case CONVERSATION_STATES.RETURN_DATE_SELECTED:
        const returnDateValidation = this.validateDateInput(input);
        if (returnDateValidation.valid) {
          dataToSave.returnDate = returnDateValidation.date;
          response = this.getPeriodMenu();
          nextState = CONVERSATION_STATES.PERIOD_SELECTED;
        } else {
          response = `❌ Data inválida. ${this.getDateMenu('Data de retorno')}`;
        }
        break;

      case CONVERSATION_STATES.PERIOD_SELECTED:
        const periodValidation = this.validateNumericInput(input, 1, 3);
        if (periodValidation.valid) {
          const periodMap = { 1: 'morning', 2: 'afternoon', 3: 'night' };
          dataToSave.period = periodMap[periodValidation.value];
          response = this.getSeatsMenu();
          nextState = CONVERSATION_STATES.SEATS_SELECTED;
        } else {
          response = `❌ Opção inválida. ${this.getPeriodMenu()}`;
        }
        break;

      case CONVERSATION_STATES.SEATS_SELECTED:
        const seatsValidation = this.validateNumericInput(input, 1, 5);
        if (seatsValidation.valid) {
          dataToSave.seats = seatsValidation.value;
          response = this.getSeatTypeMenu();
          nextState = CONVERSATION_STATES.SEAT_TYPE_SELECTED;
        } else {
          response = `❌ Número inválido. ${this.getSeatsMenu()}`;
        }
        break;

      case CONVERSATION_STATES.SEAT_TYPE_SELECTED:
        const seatTypeValidation = this.validateNumericInput(input, 1, 3);
        if (seatTypeValidation.valid) {
          const seatTypeMap = { 1: 'convencional', 2: 'semi-leito', 3: 'leito' };
          dataToSave.seatType = seatTypeMap[seatTypeValidation.value];

          const filteredTrips = this.getFilteredTrips(SessionManager.getData(phoneNumber, 'period'));
          dataToSave.availableTrips = filteredTrips;

          response = this.getTripsMenu(filteredTrips, dataToSave.seatType);
          nextState = CONVERSATION_STATES.TRIPS_SHOWN;
        } else {
          response = `❌ Opção inválida. ${this.getSeatTypeMenu()}`;
        }
        break;

      case CONVERSATION_STATES.TRIPS_SHOWN:
        const tripValidation = this.validateNumericInput(input, 1, 3);
        if (tripValidation.valid) {
          const trips = SessionManager.getData(phoneNumber, 'availableTrips');
          const selectedTrip = trips[tripValidation.value - 1];

          if (selectedTrip) {
            dataToSave.selectedTrip = selectedTrip;
            response = `✅ Viagem selecionada!\n\n${selectedTrip.time} - ${selectedTrip.company}\nR$ ${selectedTrip.price.toFixed(2)}\n\nGerando pré-reserva...`;
            nextState = CONVERSATION_STATES.TRIP_SELECTED;
          } else {
            response = `❌ Opção inválida. ${this.getTripsMenu(SessionManager.getData(phoneNumber, 'availableTrips'), SessionManager.getData(phoneNumber, 'seatType'))}`;
          }
        } else {
          response = `❌ Opção inválida. ${this.getTripsMenu(SessionManager.getData(phoneNumber, 'availableTrips'), SessionManager.getData(phoneNumber, 'seatType'))}`;
        }
        break;

      default:
        response = this.getInitialMenu();
        nextState = CONVERSATION_STATES.INITIAL;
    }

    // Salvar dados na sessão
    Object.entries(dataToSave).forEach(([key, value]) => {
      SessionManager.setData(phoneNumber, key, value);
    });

    // Atualizar estado
    SessionManager.setState(phoneNumber, nextState);

    return {
      response,
      state: nextState,
      sessionData: SessionManager.getAllData(phoneNumber),
    };
  }
}
