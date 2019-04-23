import { Unit } from './unit';
import { Floor } from './floor';

export const UNITS: Unit[] = [
  { id: 'senior-matriz', name: 'Senior Matriz', infos: 'R. São Paulo, 825 - Victor Konder, Blumenau - SC' },
  { id: 'senior-sp', name: 'Filial SP' },
  { id: 'senior-spi', name: 'Filial SPI', infos: 'R. Teste, 293 - Centro, Indaiatuba - SP' },
  { id: 'softran', name: 'Softran Joinville' },
  { id: 'mega-curitiba', name: 'Mega Curitiba' },
  { id: 'mega-rj', name: 'Mega RJ' },
  { id: 'mega-natal', name: 'Mega Natal' },
  { id: 'wms-sp', name: 'WMS SP' },
  { id: 'wms-rj', name: 'WMS RJ' },
  { id: 'head-spi', name: 'Head' }
];

export const FLOORS: Floor[] = [
  { id: 'terreo', name: 'Térreo' },
  { id: '1-andar', name: '1º andar' },
  { id: '2-andar', name: '2º andar' },
  { id: '3-andar', name: '3º andar' },
  { id: '4-andar', name: '4º andar' },
  { id: '5-andar', name: '5º andar' }
];