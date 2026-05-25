import { ScissorsIcon, SparklesIcon, NailCareIcon, LeafIcon, RazorIcon, LipstickIcon } from '../components/icons'
import type { Service } from '../types'

export const SERVICES: Service[] = [
  { id: 'hair', label: 'Hair Styling', icon: ScissorsIcon },
  { id: 'beauty', label: 'Beauty Treatment', icon: SparklesIcon },
  { id: 'nails', label: 'Nail Care', icon: NailCareIcon },
  { id: 'skin', label: 'Skin Care', icon: LeafIcon },
  { id: 'barber', label: 'Barber', icon: RazorIcon },
  { id: 'makeup', label: 'Makeup', icon: LipstickIcon },
]

export const SERVICE_NAMES: string[] = ['Hair Styling', 'Beauty Treatment', 'Nail Care', 'Skin Care', 'Barber', 'Makeup']

export const WARSAW_DISTRICTS: string[] = [
  'Bemowo',
  'Białołęka',
  'Bielany',
  'Mokotów',
  'Ochota',
  'Praga-Południe',
  'Praga-Północ',
  'Rembertów',
  'Śródmieście',
  'Targówek',
  'Ursus',
  'Ursynów',
  'Wawer',
  'Wesoła',
  'Wilanów',
  'Włochy',
  'Wola',
  'Żoliborz',
]

export const DISTRICTS_WITH_ALL: string[] = ['All districts', ...WARSAW_DISTRICTS]
