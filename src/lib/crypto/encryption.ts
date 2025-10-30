import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits

// Encryption key'i environment variable'dan al
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }

  return Buffer.from(key, 'hex');
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

/**
 * GW2 API key'lerini AES-256-GCM ile encrypt eder
 */
export function encrypt(text: string): EncryptedData {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * Encrypted GW2 API key'i decrypt eder
 */
export function decrypt(encryptedData: EncryptedData): string {
  const key = getEncryptionKey();

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(encryptedData.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Encryption key'in geçerli olup olmadığını kontrol eder
 */
export function validateEncryptionKey(): boolean {
  try {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 64) return false;

    // Test encryption/decryption
    const testData = 'test-encryption-key-validation';
    const encrypted = encrypt(testData);
    const decrypted = decrypt(encrypted);

    return decrypted === testData;
  } catch {
    return false;
  }
}

/**
 * Yeni encryption key generate eder (setup için)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}
