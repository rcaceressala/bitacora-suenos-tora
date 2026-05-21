import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bitacorasuenos.app',
  appName: 'Bitácora de Sueños',
  webDir: 'out',
  server: {
    url: 'https://bitacora-suenos-tora.vercel.app',
    cleartext: false,
  },
};

export default config;
