import jwt from 'jsonwebtoken';

export interface TokenData {
  userId: string;
  email: string;
  name: string;
}

export function createToken(userData: TokenData): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET não configurado no .env');
  }

  return jwt.sign(userData, secret, {
    expiresIn: '1d',
  });
}

export function verifyToken(token: string): TokenData | null {
  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET não configurado no .env');
    }

    const decoded = jwt.verify(token, secret) as TokenData;
    return decoded;
  } catch (error) {
    console.log('Token inválido:', error);
    return null;
  }
}