import { RadioStation } from './types';

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: '1',
    name: 'Radio Paradise',
    url: 'https://stream.radioparadise.com/mp3-192',
    genre: 'Eclectic Rock',
    country: 'USA',
    color: '#38bdf8', // Sky blue
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RP&backgroundColor=38bdf8&chars=1'
  },
  {
    id: '2',
    name: 'RTL 102.5',
    url: 'https://shoutcast.rtl.it/rtl1025',
    genre: 'Italian Hits',
    country: 'Italy',
    color: '#ef4444', // Red
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RTL&backgroundColor=ef4444&chars=1'
  },
  {
    id: '3',
    name: 'LoFi Hip Hop',
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
    genre: 'Chill Beats',
    country: 'Global',
    color: '#a855f7', // Purple
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=LF&backgroundColor=a855f7&chars=1'
  },
  {
    id: '4',
    name: 'Radio Ibiza',
    url: 'https://vis.shoutcast.com/RadioIbiza?lang=it-IT%2Cit%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7',
    genre: 'House / Dance',
    country: 'Italy',
    color: '#22c55e', // Green
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IB&backgroundColor=22c55e&chars=1'
  },
  {
    id: '5',
    name: 'Smooth Jazz',
    url: 'https://us4.internet-radio.com/proxy/wsjf?mp=/stream;',
    genre: 'Jazz Lounge',
    country: 'USA',
    color: '#f59e0b', // Amber
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ&backgroundColor=f59e0b&chars=1'
  },
  {
    id: '6',
    name: 'Groove Salad',
    url: 'https://ice1.somafm.com/groovesalad-128-mp3',
    genre: 'Ambient',
    country: 'USA',
    color: '#14b8a6', // Teal
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GS&backgroundColor=14b8a6&chars=1'
  },
  {
    id: '7',
    name: 'RDS',
    url: 'https://icestreaming.rds.radio/rds/mp3',
    genre: 'Top 40',
    country: 'Italy',
    color: '#f97316', // Orange
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RDS&backgroundColor=f97316&chars=1'
  },
  {
    id: '8',
    name: 'Classic FM',
    url: 'https://media-ice.musicradio.com/ClassicFMMP3',
    genre: 'Classical',
    country: 'UK',
    color: '#e2e8f0', // Slate
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CF&backgroundColor=64748b&chars=1'
  }
];