import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import { webcrypto } from 'crypto';

if (!global.crypto) {
  (global as any).crypto = webcrypto;
}
