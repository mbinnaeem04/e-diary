import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('Auth & Cryptography Unit Tests', () => {
  const JWT_SECRET = 'test_jwt_secret_12345';

  it('should correctly hash and verify passwords using bcryptjs', async () => {
    const password = 'mySecretPassword123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    assert.notStrictEqual(password, hash);
    const isValid = await bcrypt.compare(password, hash);
    assert.strictEqual(isValid, true);

    const isInvalid = await bcrypt.compare('wrongPassword', hash);
    assert.strictEqual(isInvalid, false);
  });

  it('should correctly sign and verify JWT tokens', () => {
    const payload = { id: 'user_1234567890' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    assert.strictEqual(typeof token, 'string');

    const decoded = jwt.verify(token, JWT_SECRET);
    assert.strictEqual(decoded.id, payload.id);
  });

  it('should reject invalid or tampered JWT tokens', () => {
    const token = jwt.sign({ id: 'user_1' }, JWT_SECRET);
    assert.throws(() => {
      jwt.verify(token, 'wrong_secret');
    });
  });
});
