import jwt from 'jsonwebtoken';

// Dados que vão dentro do token
export interface TokenData {
  userId: string;
  email: string;
  name: string;
}

// Função para CRIAR um token JWT
export function createToken(userData: TokenData): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET não configurado no .env');
  }

  return jwt.sign(userData, secret, {
    expiresIn: '1d', // Expira em 1 dia
  });
}

// Função para VERIFICAR se um token é válido
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