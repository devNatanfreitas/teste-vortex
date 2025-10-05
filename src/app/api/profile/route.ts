import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseServer';
import { verifyToken } from '../../../lib/jwt';

export async function GET(request: NextRequest) {
  try {
  
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    
    const userData = verifyToken(token || '');

    if (!userData) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }

  
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.userId) 
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referral_code,
        score: user.score
      }
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
