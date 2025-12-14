
import { RadioStation } from './types';

export const RADIO_STATIONS: RadioStation[] = [
  // --- ITALIA ---
  {
    id: 'it-1',
    name: 'RTL 102.5',
    url: 'https://shoutcast.rtl.it/rtl1025',
    genre: 'Hits / News',
    country: 'Italy',
    color: '#ef4444',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RTL&backgroundColor=ef4444'
  },
  {
    id: 'it-2',
    name: 'RDS 100% Grandi Successi',
    url: 'https://icestreaming.rds.radio/rds/mp3',
    genre: 'Top 40',
    country: 'Italy',
    color: '#f97316',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RDS&backgroundColor=f97316'
  },
  {
    id: 'it-3',
    name: 'Radio 105',
    url: 'http://icecast.unitedradio.it/Radio105.mp3',
    genre: 'Urban / Comedy',
    country: 'Italy',
    color: '#facc15',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=105&backgroundColor=facc15&chars=3'
  },
  {
    id: 'it-4',
    name: 'Virgin Radio',
    url: 'http://icecast.unitedradio.it/Virgin.mp3',
    genre: 'Rock Style',
    country: 'Italy',
    color: '#991b1b',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=VR&backgroundColor=991b1b'
  },
  {
    id: 'it-5',
    name: 'Radio Italia',
    url: 'https://radioitaliasmi.p.cdn.web.sas.tem-energy.com/radioitaliasmi.mp3',
    genre: 'Solo Musica Italiana',
    country: 'Italy',
    color: '#ffffff',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RI&backgroundColor=111111'
  },
  {
    id: 'it-6',
    name: 'R101',
    url: 'http://icecast.unitedradio.it/R101.mp3',
    genre: 'Adult Contemporary',
    country: 'Italy',
    color: '#2563eb',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=R101&backgroundColor=2563eb'
  },
  {
    id: 'it-7',
    name: 'Radio Kiss Kiss',
    url: 'https://ice02.fluidstream.net/kkitalia.mp3',
    genre: 'Pop / Soul',
    country: 'Italy',
    color: '#ec4899',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=KK&backgroundColor=ec4899'
  },
  {
    id: 'it-8',
    name: 'Radio Monte Carlo',
    url: 'http://icecast.unitedradio.it/RMC.mp3',
    genre: 'Classy / Jazz',
    country: 'Italy',
    color: '#d4af37',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RMC&backgroundColor=d4af37'
  },
  {
    id: 'it-9',
    name: 'Radio 24',
    url: 'https://shoutcast.radio24.it/radio24_mp3',
    genre: 'News / Talk',
    country: 'Italy',
    color: '#16a34a',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=R24&backgroundColor=16a34a'
  },
  {
    id: 'it-10',
    name: 'Rai Radio 1',
    url: 'http://icestreaming.rai.it/1.mp3',
    genre: 'Public / News',
    country: 'Italy',
    color: '#0284c7',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RAI1&backgroundColor=0284c7'
  },

  // --- GENRE SPECIALS (Latin, Blues, Jazz) ---
  {
    id: 'gn-1',
    name: '181.fm Bachata',
    url: 'https://listen.181fm.com/181-bachata_128k.mp3',
    genre: 'Bachata',
    country: 'Global',
    color: '#be123c',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BAC&backgroundColor=be123c'
  },
  {
    id: 'gn-2',
    name: '181.fm Salsa',
    url: 'https://listen.181fm.com/181-salsa_128k.mp3',
    genre: 'Salsa',
    country: 'Global',
    color: '#c2410c',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SAL&backgroundColor=c2410c'
  },
  {
    id: 'gn-3',
    name: '181.fm True Blues',
    url: 'https://listen.181fm.com/181-blues_128k.mp3',
    genre: 'Blues',
    country: 'USA',
    color: '#1e3a8a',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BLU&backgroundColor=1e3a8a'
  },
  {
    id: 'gn-4',
    name: 'Radio Swiss Jazz',
    url: 'https://stream.srg-ssr.ch/m/rsj/mp3_128',
    genre: 'Jazz / Swing',
    country: 'Switzerland',
    color: '#78350f',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SWJ&backgroundColor=78350f'
  },
  {
    id: 'gn-5',
    name: 'ABC Jazz',
    url: 'https://live-radio01.mediahubaustralia.com/2JAZ/mp3/',
    genre: 'Modern Jazz',
    country: 'Australia',
    color: '#065f46',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ABC&backgroundColor=065f46'
  },
  {
    id: 'gn-6',
    name: '181.fm Reggae',
    url: 'https://listen.181fm.com/181-reggae_128k.mp3',
    genre: 'Reggae Roots',
    country: 'Jamaica/Global',
    color: '#15803d',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=REG&backgroundColor=15803d'
  },

  // --- UK ---
  {
    id: 'uk-1',
    name: 'Capital FM London',
    url: 'https://media-ice.musicradio.com/CapitalMP3',
    genre: 'Hit Music',
    country: 'UK',
    color: '#3b82f6',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CAP&backgroundColor=3b82f6'
  },
  {
    id: 'uk-2',
    name: 'Heart London',
    url: 'https://media-ice.musicradio.com/HeartLondonMP3',
    genre: 'Pop / Variety',
    country: 'UK',
    color: '#ef4444',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=HRT&backgroundColor=ef4444'
  },
  {
    id: 'uk-3',
    name: 'LBC News',
    url: 'https://media-ice.musicradio.com/LBCUKMP3',
    genre: 'Leading Britain\'s Conversation',
    country: 'UK',
    color: '#1e293b',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=LBC&backgroundColor=1e293b'
  },
  {
    id: 'uk-4',
    name: 'Classic FM',
    url: 'https://media-ice.musicradio.com/ClassicFMMP3',
    genre: 'Classical',
    country: 'UK',
    color: '#64748b',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CFM&backgroundColor=64748b'
  },
  {
    id: 'uk-5',
    name: 'Smooth Radio',
    url: 'https://media-ice.musicradio.com/SmoothUKMP3',
    genre: 'Relaxing Music',
    country: 'UK',
    color: '#8b5cf6',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SM&backgroundColor=8b5cf6'
  },
  {
    id: 'uk-6',
    name: 'Radio X',
    url: 'https://media-ice.musicradio.com/RadioXUKMP3',
    genre: 'Indie / Rock',
    country: 'UK',
    color: '#10b981',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=RADX&backgroundColor=10b981'
  },
  {
    id: 'uk-7',
    name: 'Gold Radio',
    url: 'https://media-ice.musicradio.com/GoldMP3',
    genre: 'Greatest Hits',
    country: 'UK',
    color: '#fbbf24',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GOLD&backgroundColor=fbbf24'
  },
  {
    id: 'uk-8',
    name: 'Capital XTRA',
    url: 'https://media-ice.musicradio.com/CapitalXTRAMP3',
    genre: 'Urban / Hip Hop',
    country: 'UK',
    color: '#000000',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=XTRA&backgroundColor=333333'
  },

  // --- SPAIN ---
  {
    id: 'es-1',
    name: 'LOS40',
    url: 'https://25633.live.streamtheworld.com/LOS40_SC',
    genre: 'Top 40',
    country: 'Spain',
    color: '#eab308',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=L40&backgroundColor=eab308'
  },
  {
    id: 'es-2',
    name: 'Cadena 100',
    url: 'https://cadena100-cope-rrcast.flumotion.com/cope/cadena100-low.mp3',
    genre: 'Pop / Rock',
    country: 'Spain',
    color: '#14b8a6',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=C100&backgroundColor=14b8a6'
  },
  {
    id: 'es-3',
    name: 'Europa FM',
    url: 'https://icecast-streaming.atresmedia.com/europafm_mp3_128',
    genre: 'Pop 2000s-Today',
    country: 'Spain',
    color: '#f43f5e',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EU&backgroundColor=f43f5e'
  },
  {
    id: 'es-4',
    name: 'Rock FM',
    url: 'https://rockfm-cope-rrcast.flumotion.com/cope/rockfm-low.mp3',
    genre: 'Classic Rock',
    country: 'Spain',
    color: '#000000',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ROCK&backgroundColor=000000'
  },
  {
    id: 'es-5',
    name: 'Kiss FM',
    url: 'https://kissfm.kissfmradio.cires21.com/kissfm.mp3',
    genre: 'Best Ballads',
    country: 'Spain',
    color: '#db2777',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=KISS&backgroundColor=db2777'
  },
  {
    id: 'es-6',
    name: 'Cadena Dial',
    url: 'https://20853.live.streamtheworld.com/CADENADIAL.mp3',
    genre: 'Spanish Pop',
    country: 'Spain',
    color: '#166534',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DIAL&backgroundColor=166534'
  },
  {
    id: 'es-7',
    name: 'Loca FM',
    url: 'http://audio-online.net:23500/live',
    genre: 'Electronic / 90s',
    country: 'Spain',
    color: '#8b5cf6',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=LOCA&backgroundColor=8b5cf6'
  },

  // --- USA / GLOBAL ---
  {
    id: 'us-1',
    name: 'KEXP Seattle',
    url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
    genre: 'Alternative / Indie',
    country: 'USA',
    color: '#f59e0b',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=KEXP&backgroundColor=f59e0b'
  },
  {
    id: 'us-2',
    name: 'KCRW Eclectic',
    url: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_e24_internet_radio',
    genre: 'Eclectic / Culture',
    country: 'USA',
    color: '#0ea5e9',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=KCRW&backgroundColor=0ea5e9'
  },
  {
    id: 'us-3',
    name: 'Hot 97',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WQHTFM.mp3',
    genre: 'Hip Hop',
    country: 'USA',
    color: '#dc2626',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=HOT&backgroundColor=dc2626'
  },
  {
    id: 'us-4',
    name: 'WQXR New York',
    url: 'https://stream.wqxr.org/wqxr',
    genre: 'Classical',
    country: 'USA',
    color: '#475569',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=WQXR&backgroundColor=475569'
  },
  {
    id: 'us-5',
    name: 'Jazz24',
    url: 'https://live.wostreaming.net/direct/ppm-jazz24mp3-ibc1',
    genre: 'Jazz',
    country: 'USA',
    color: '#78350f',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=JAZZ&backgroundColor=78350f'
  },
  {
    id: 'us-6',
    name: 'SomaFM Groove Salad',
    url: 'https://ice1.somafm.com/groovesalad-128-mp3',
    genre: 'Ambient / Downtempo',
    country: 'USA',
    color: '#84cc16',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SOMA&backgroundColor=84cc16'
  },
  {
    id: 'us-7',
    name: 'WFMU',
    url: 'https://stream0.wfmu.org/freeform-128k.mp3',
    genre: 'Freeform',
    country: 'USA',
    color: '#6366f1',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=WFMU&backgroundColor=6366f1'
  },
  {
    id: 'us-8',
    name: 'Bloomberg Radio',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WBBRJE.mp3',
    genre: 'Business / News',
    country: 'USA',
    color: '#0f172a',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BB&backgroundColor=0f172a'
  },

  // --- LATIN AMERICA ---
  {
    id: 'lat-1',
    name: 'Aspen 102.3',
    url: 'https://26683.live.streamtheworld.com/ASPEN.mp3',
    genre: 'Classic Hits',
    country: 'Argentina',
    color: '#0284c7',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ASP&backgroundColor=0284c7'
  },
  {
    id: 'lat-2',
    name: 'Los 40 Mexico',
    url: 'https://24263.live.streamtheworld.com/LOS40_MEXICO_SC',
    genre: 'Latin Pop',
    country: 'Mexico',
    color: '#eab308',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MX40&backgroundColor=eab308'
  },
  {
    id: 'lat-3',
    name: 'Alfa 91.3',
    url: 'https://26163.live.streamtheworld.com/XHAF_FMAAC_SC',
    genre: 'Pop / Rock',
    country: 'Mexico',
    color: '#f97316',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ALFA&backgroundColor=f97316'
  },
  {
    id: 'lat-4',
    name: 'Radio Mitre',
    url: 'https://26693.live.streamtheworld.com/RADIO_MITRE_SC',
    genre: 'Talk / News',
    country: 'Argentina',
    color: '#1e293b',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MIT&backgroundColor=1e293b'
  },
  {
    id: 'lat-5',
    name: 'Studio 92',
    url: 'https://19233.live.streamtheworld.com/STUDIO92_SC',
    genre: 'Pop / Reggaeton',
    country: 'Peru',
    color: '#ef4444',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=S92&backgroundColor=ef4444'
  },

  // --- VIBES & OTHERS ---
  {
    id: 'vb-1',
    name: 'Ibiza Global Radio',
    url: 'https://listenssl.ibizaglobalradio.com:8024/ibizaglobalradio.mp3',
    genre: 'House / Electronic',
    country: 'Spain/Global',
    color: '#06b6d4',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IBZ&backgroundColor=06b6d4'
  },
  {
    id: 'vb-2',
    name: 'Defected Radio',
    url: 'https://22193.live.streamtheworld.com/DEFECTED_RADIO.mp3',
    genre: 'House Music',
    country: 'UK/Global',
    color: '#171717',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DEF&backgroundColor=171717'
  },
  {
    id: 'vb-3',
    name: 'BBC World Service',
    url: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    genre: 'World News',
    country: 'Global',
    color: '#b91c1c',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BBC&backgroundColor=b91c1c'
  },
  {
    id: 'vb-4',
    name: 'FIP Radio',
    url: 'https://icecast.radiofrance.fr/fip-midfi.mp3',
    genre: 'Eclectic',
    country: 'France',
    color: '#ec4899',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FIP&backgroundColor=ec4899'
  },
];
