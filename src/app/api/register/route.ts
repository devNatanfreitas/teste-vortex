import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseServer';


export async function POST(request: NextRequest) {
  try {
    const { name, email, password, referralCode } = await request.json();

    // Validações básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email deve ter um formato válido' },
        { status: 400 }
      );
    }

    // Validação de senha
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Senha deve ter no mínimo 8 caracteres' },
        { status: 400 }
      );
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      return NextResponse.json(
        { error: 'Senha deve conter letras e números' },
        { status: 400 }
      );
    }

   
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      );
    }

    
    const userReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Criar usuário
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password, 
        referral_code: userReferralCode,
        score: 0
      })
      .select()
      .single();

    if (userError) {
      console.error('Erro ao criar usuário:', userError);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    // Se foi indicado por alguém
    if (referralCode) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id, score')
        .eq('referral_code', referralCode)
        .single();

      if (referrer) {
        // Incrementar pontuação do indicador
        await supabase
          .from('users')
          .update({ score: referrer.score + 1 })
          .eq('id', referrer.id);

        // Registrar a indicação
        await supabase
          .from('referrals')
          .insert({
            referrer_id: referrer.id,
            referred_id: newUser.id
          });
      }
    }

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referral_code,
        score: newUser.score
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
