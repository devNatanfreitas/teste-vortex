import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseServer';
import bcrypt from 'bcryptjs';


export async function POST(request: NextRequest) {
  try {
    const { name, email, password, referralCode } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email deve ter um formato válido' },
        { status: 400 }
      );
    }

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

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword, 
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

    if (referralCode) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id, score, email')
        .eq('referral_code', referralCode)
        .single();

      if (referrer) {
       
        if (referrer.email === email) {
          return NextResponse.json(
            { error: 'Não é possível usar seu próprio código de referência' },
            { status: 400 }
          );
        }

        
        const { data: existingReferral } = await supabase
          .from('referrals')
          .select('id')
          .eq('referrer_id', referrer.id)
          .eq('referred_email', email)
          .single();

        if (existingReferral) {
          return NextResponse.json(
            { error: 'Este email já foi referenciado por este usuário' },
            { status: 400 }
          );
        }

        await supabase
          .from('users')
          .update({ score: referrer.score + 1 })
          .eq('id', referrer.id);

        await supabase
          .from('referrals')
          .insert({
            referrer_id: referrer.id,
            referred_id: newUser.id,
            referred_email: email
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
