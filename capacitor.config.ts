import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mounika.ipc',
  appName: 'ipc',
  webDir: 'build',
  server: {
    cleartext: true,
    allowNavigation: ['103.168.19.67'] // your backend IP
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
