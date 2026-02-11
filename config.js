// Carregar variáveis de ambiente (apenas em desenvolvimento)
import dotenv from 'dotenv';

// Configurar dotenv para carregar variáveis de ambiente
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  WHAPI_TOKEN: process.env.WHAPI_TOKEN || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  WHAPI_BASE_URL: 'https://gate.whapi.cloud',
};

// Debug: Logar configurações
console.log('=== CONFIG LOADED ===');
console.log('PORT:', CONFIG.PORT);
console.log('NODE_ENV:', CONFIG.NODE_ENV);
console.log('WHAPI_TOKEN exists:', !!CONFIG.WHAPI_TOKEN);
console.log('WHAPI_TOKEN length:', CONFIG.WHAPI_TOKEN.length);
console.log('WHAPI_BASE_URL:', CONFIG.WHAPI_BASE_URL);
console.log('====================');

// Dados MOCK de cidades - 101 rotas disponíveis
export const CITIES = {
  1: { name: 'Afonso Cláudio', code: 'ES' },
  2: { name: 'Alegre', code: 'ES' },
  3: { name: 'Aracaju', code: 'SE' },
  4: { name: 'Belo Horizonte', code: 'MG' },
  5: { name: 'Belém', code: 'PA' },
  6: { name: 'Brasília', code: 'DF' },
  7: { name: 'Cachoeiro de Itapemirim', code: 'ES' },
  8: { name: 'Campina Grande', code: 'PB' },
  9: { name: 'Campinas', code: 'SP' },
  10: { name: 'Campos dos Goytacazes', code: 'RJ' },
  11: { name: 'Caruaru', code: 'PE' },
  12: { name: 'Feira de Santana', code: 'BA' },
  13: { name: 'Fortaleza', code: 'CE' },
  14: { name: 'Guarabira', code: 'PB' },
  15: { name: 'Guarapari', code: 'ES' },
  16: { name: 'Iúna', code: 'ES' },
  17: { name: 'Juiz de Fora', code: 'MG' },
  18: { name: 'Jundiaí', code: 'SP' },
  19: { name: 'Patos', code: 'PB' },
  20: { name: 'Recife', code: 'PE' },
  21: { name: 'Rio de Janeiro', code: 'RJ' },
  22: { name: 'Salvador', code: 'BA' },
  23: { name: 'Santos', code: 'SP' },
  24: { name: 'São João da Barra', code: 'RJ' },
  25: { name: 'São José dos Campos', code: 'SP' },
  26: { name: 'São Paulo', code: 'SP' },
  27: { name: 'Serra', code: 'ES' },
  28: { name: 'Teófilo Otoni', code: 'MG' },
  29: { name: 'Teresina', code: 'PI' },
  30: { name: 'Timbaúba', code: 'PE' },
  31: { name: 'Vitória', code: 'ES' },
  32: { name: 'Volta Redonda', code: 'RJ' },
  33: { name: 'Curitiba', code: 'PR' },
  34: { name: 'Florianópolis', code: 'SC' },
  35: { name: 'Porto Alegre', code: 'RS' },
  36: { name: 'Maceió', code: 'AL' },
  37: { name: 'Goiânia', code: 'GO' },
  38: { name: 'Niterói', code: 'RJ' },
  39: { name: 'Macaé', code: 'RJ' },
  40: { name: 'Muqui', code: 'ES' },
  41: { name: 'Itaperuna', code: 'RJ' },
  42: { name: 'Vitória da Conquista', code: 'BA' },
  43: { name: 'Anápolis', code: 'GO' },
  44: { name: 'Governador Valadares', code: 'MG' },
  45: { name: 'Caicó', code: 'RN' },
  46: { name: 'Itajaí', code: 'SC' },
  47: { name: 'Marataízes', code: 'ES' },
  48: { name: 'Parnaíba', code: 'PI' },
  49: { name: 'Picos', code: 'PI' },
  50: { name: 'São Luís', code: 'MA' },
  51: { name: 'Duque de Caxias', code: 'RJ' },
  52: { name: 'São Caetano do Sul', code: 'SP' },
  53: { name: 'Balneário Camboriú', code: 'SC' },
  54: { name: 'Muriaé', code: 'MG' },
  55: { name: 'Atílio Vivacqua', code: 'ES' },
  56: { name: 'Mimoso do Sul', code: 'ES' },
  57: { name: 'Arcoverde', code: 'PE' },
  58: { name: 'Jaguaribe', code: 'CE' },
  59: { name: 'Itabuna', code: 'BA' },
  60: { name: 'João Pessoa', code: 'PB' },
  61: { name: 'João Monlevade', code: 'MG' },
  62: { name: 'Aparecida', code: 'SP' },
  63: { name: 'Sete Lagoas', code: 'MG' },
  64: { name: 'Joinville', code: 'SC' },
  65: { name: 'Juazeiro do Norte', code: 'CE' },
  66: { name: 'Palmares', code: 'PE' },
  67: { name: 'Alagoa Grande', code: 'PB' },
  68: { name: 'Ipu', code: 'CE' },
  69: { name: 'Teresina', code: 'PI' },
  70: { name: 'Guaraciaba', code: 'CE' },
  71: { name: 'Três Marias', code: 'MG' },
  72: { name: 'Natal', code: 'RN' },
  73: { name: 'Curvelo', code: 'MG' },
  74: { name: 'Niterói', code: 'RJ' },
  75: { name: 'Rio das Ostras', code: 'RJ' },
  76: { name: 'Iconha', code: 'ES' },
  77: { name: 'Camaçari', code: 'BA' },
  78: { name: 'Paulo Afonso', code: 'BA' },
  79: { name: 'Sobral', code: 'CE' },
  80: { name: 'Ipatinga', code: 'MG' },
  81: { name: 'Itaobim', code: 'MG' },
  82: { name: 'Teófilo Otoni', code: 'MG' },
  83: { name: 'Manhumirim', code: 'MG' },
  84: { name: 'Caratinga', code: 'MG' },
  85: { name: 'Cataguases', code: 'MG' },
  86: { name: 'Miracatu', code: 'SP' },
  87: { name: 'Floriano', code: 'PI' },
  88: { name: 'Uberlândia', code: 'MG' },
  89: { name: 'Remanso', code: 'BA' },
  90: { name: 'Barro', code: 'CE' },
  91: { name: 'Timóteo', code: 'MG' },
  92: { name: 'Salgueiro', code: 'PE' },
  93: { name: 'Barra Mansa', code: 'RJ' },
  94: { name: 'Leopoldina', code: 'MG' },
  95: { name: 'Nanuque', code: 'MG' },
  96: { name: 'Oricuri', code: 'PE' },
  97: { name: 'Serra Talhada', code: 'PE' },
  98: { name: 'Floresta', code: 'PE' },
  99: { name: 'Taubaté', code: 'SP' },
  100: { name: 'Bacabal', code: 'MA' },
  101: { name: 'Surubim', code: 'PE' },
};

// Dados MOCK de viações - 5 principais
export const BUS_COMPANIES = [
  { id: 1, name: 'Nova Itapemirim', logo: '🚌' },
  { id: 2, name: 'Pássaro Marrom', logo: '🚌' },
  { id: 3, name: 'Cometa', logo: '🚌' },
  { id: 4, name: '1001', logo: '🚌' },
  { id: 5, name: 'Expresso Nordeste', logo: '🚌' },
];

// Dados MOCK de viagens (horários e preços)
export const MOCK_TRIPS = [
  {
    id: 1,
    time: '06:00',
    duration: '6h30min',
    price: 89.90,
    company: 'Nova Itapemirim',
    seats: 42,
    type: 'convencional',
  },
  {
    id: 2,
    time: '12:30',
    duration: '6h45min',
    price: 129.90,
    company: 'Pássaro Marrom',
    seats: 38,
    type: 'semi-leito',
  },
  {
    id: 3,
    time: '19:00',
    duration: '7h00min',
    price: 169.90,
    company: 'Cometa',
    seats: 30,
    type: 'leito',
  },
  {
    id: 4,
    time: '08:15',
    duration: '7h15min',
    price: 99.90,
    company: '1001',
    seats: 40,
    type: 'convencional',
  },
  {
    id: 5,
    time: '14:45',
    duration: '8h00min',
    price: 139.90,
    company: 'Expresso Nordeste',
    seats: 35,
    type: 'semi-leito',
  },
];

// Estados possíveis da conversa
export const CONVERSATION_STATES = {
  INITIAL: 'initial',
  ORIGIN_SELECTED: 'origin_selected',
  DESTINATION_SELECTED: 'destination_selected',
  TRIP_TYPE_SELECTED: 'trip_type_selected',
  OUTBOUND_DATE_SELECTED: 'outbound_date_selected',
  RETURN_DATE_SELECTED: 'return_date_selected',
  PERIOD_SELECTED: 'period_selected',
  SEATS_SELECTED: 'seats_selected',
  SEAT_TYPE_SELECTED: 'seat_type_selected',
  TRIPS_SHOWN: 'trips_shown',
  TRIP_SELECTED: 'trip_selected',
  COMPLETED: 'completed',
};

// Períodos do dia
export const PERIODS = {
  morning: { name: 'Manhã', value: 'morning', hours: '06:00-12:00' },
  afternoon: { name: 'Tarde', value: 'afternoon', hours: '12:00-18:00' },
  night: { name: 'Noite', value: 'night', hours: '18:00-23:59' },
};

// Tipos de poltrona
export const SEAT_TYPES = {
  convencional: { name: 'Convencional', value: 'convencional', price: 0 },
  'semi-leito': { name: 'Semi-leito', value: 'semi-leito', price: 40 },
  leito: { name: 'Leito', value: 'leito', price: 80 },
};
