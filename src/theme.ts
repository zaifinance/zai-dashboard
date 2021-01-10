import { rgba } from 'polished'
import { ThemeProps } from './components/Theme'

export const lightTheme: Partial<ThemeProps> = {
  padUnit: 12,

  textColor: rgba(0, 0, 0, 1),
  textColorLight: rgba(0, 0, 0, 0.6),
  textColorLightest: rgba(0, 0, 0, 0.3),

  baseColor: '#ffffff',
  backgroundColor: '#ffffff',
  backgroundColorLight: '#ffffff',

  colorPairs: [
    { start: '#ff9068', end: '#fd746c' },
    { start: '#fc5c7d', end: '#6a82fb' },
  ],
}

export const darkTheme: Partial<ThemeProps> = {
  padUnit: 12,

  textColor: rgba(255, 255, 255, 1),
  textColorLight: rgba(255, 255, 255, 0.6),
  textColorLightest: rgba(255, 255, 255, 0.3),

  baseColor: '#000000',
  // backgroundColor: 'rgba(0, 0, 0, .8)',
  backgroundColor: '#0a0a0a',
  backgroundColorLight: '#2a2a2a',

  colorPairs: [
    { start: '#ff9068', end: '#fd746c' },
    { start: '#fc5c7d', end: '#6a82fb' },
  ],
}

export const colorsElectric = [
  { start: '#2bd1fc', end: '#89fffd' },
  { start: '#e978c0', end: '#f093ce' },
]

export const colorsElectricBW = [
  {
    start: '#2bd1fc',
    end: '#181818',
  },
  {
    start: '#e978c0',

    end: '#111',
  },
]

export const colorsGreenBW = [
  {
    start: '#00b09b',
    end: '#181818',
  },
  {
    start: '#00F260',
    end: '#111',
  },
]

export const colorsGreen = [
  { start: '#00b09b', end: '#08ec79' },
  { start: '#00F260', end: '#0575E6' },
]

export const colorsElectric2 = [
  { start: '#2bd1fc', end: '#89fffd' },
  { start: '#e978c0', end: '#dc72e6' },
]

export const defaultColorsBW = [
  {
    start: '#181818',
    end: '#222',
  },
  {
    start: '#262633',
    end: '#111',
  },
]

export const colorsBW = [
  {
    start: '#e8e8e8',
    end: '#ddd',
  },
  {
    start: '#dadacc',
    end: '#eee',
  },
]
