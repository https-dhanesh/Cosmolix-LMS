export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: 'cosmolix_admin' | 'teacher' | 'student';
      tenantId?: string;
      domain?: string;
    }
  }
}