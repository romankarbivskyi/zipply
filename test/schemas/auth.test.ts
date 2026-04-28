import { describe, it, expect } from 'vitest';
import { getAuthSchema, resetPasswordSchema, updatePasswordSchema } from '@/schemas/auth';

describe('Auth Schemas', () => {
  describe('getAuthSchema', () => {
    it('validates valid sign-in data', () => {
      const signInSchema = getAuthSchema('sign-in');
      const result = signInSchema.safeParse({ email: 'test@test.com', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email for sign-in', () => {
      const signInSchema = getAuthSchema('sign-in');
      const result = signInSchema.safeParse({ email: 'test', password: 'password123' });
      expect(result.success).toBe(false);
    });

    it('validates valid sign-up data', () => {
      const signUpSchema = getAuthSchema('sign-up');
      const result = signUpSchema.safeParse({ 
        email: 'test@test.com', 
        password: 'password123', 
        confirmPassword: 'password123' 
      });
      expect(result.success).toBe(true);
    });

    it('rejects sign-up data if passwords do not match', () => {
      const signUpSchema = getAuthSchema('sign-up');
      const result = signUpSchema.safeParse({ 
        email: 'test@test.com', 
        password: 'password123', 
        confirmPassword: 'password456' 
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match');
      }
    });

    it('rejects weak passwords for sign-up and sign-in', () => {
      const signUpSchema = getAuthSchema('sign-up');
      const result1 = signUpSchema.safeParse({ email: 'test@test.com', password: '12345678', confirmPassword: '12345678' });
      expect(result1.success).toBe(false);
      const result2 = signUpSchema.safeParse({ email: 'test@test.com', password: 'password', confirmPassword: 'password' });
      expect(result2.success).toBe(false);
      const result3 = signUpSchema.safeParse({ email: 'test@test.com', password: 'pass1', confirmPassword: 'pass1' });
      expect(result3.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('validates matching strong passwords', () => {
      const result = resetPasswordSchema.safeParse({ password: 'password123', confirmPassword: 'password123' });
      expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const result = resetPasswordSchema.safeParse({ password: 'password123', confirmPassword: 'password456' });
      expect(result.success).toBe(false);
    });
  });

  describe('updatePasswordSchema', () => {
    it('validates correct update data', () => {
      const result = updatePasswordSchema.safeParse({ 
        currentPassword: 'oldpassword123', 
        newPassword: 'newpassword123', 
        confirmPassword: 'newpassword123' 
      });
      expect(result.success).toBe(true);
    });

    it('rejects mismatched new passwords', () => {
      const result = updatePasswordSchema.safeParse({ 
        currentPassword: 'oldpassword123', 
        newPassword: 'newpassword123', 
        confirmPassword: 'newpassword456' 
      });
      expect(result.success).toBe(false);
    });
  });
});