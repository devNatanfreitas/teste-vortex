'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './register.module.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/profile');
      return;
    }

    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email deve ter um formato válido';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
      } else {
        const hasLetter = /[a-zA-Z]/.test(formData.password);
        const hasNumber = /\d/.test(formData.password);
        if (!hasLetter || !hasNumber) {
          newErrors.password = 'Senha deve conter letras e números';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referralCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error });
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      
      router.push('/profile');

    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErrors({ general: 'Erro interno do servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1 className="page-title">Criar Conta</h1>
        
        {referralCode && (
          <div className="referral-info">
            <p>✨ Você foi indicado por alguém! Após o cadastro, seu indicador ganhará 1 ponto.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="name" className="label">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Digite seu nome"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="Digite seu email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="label">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="Digite sua senha"
            />
            {errors.password && <span className="error">{errors.password}</span>}
            <small className="password-hint">
              Mínimo 8 caracteres, contendo letras e números
            </small>
          </div>

          {errors.general && (
            <div className="general-error">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e1e5e9' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Já tem uma conta?{' '}
            <a href="/login" className="link">
              Fazer login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterForm />
    </Suspense>
  );
}