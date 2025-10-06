'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  
  const router = useRouter();

  
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const userSession = localStorage.getItem('userSession');
      
      if (token && userSession) {
        const session = JSON.parse(userSession);
        if (session.loggedIn) {
          setIsAlreadyLoggedIn(true);
          router.push('/profile');
          return;
        }
      }
    };

  
    checkLoginStatus();

    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userSession' || e.key === 'token') {
        checkLoginStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

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

    
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const session = JSON.parse(userSession);
      if (session.loggedIn) {
        setErrors({ general: 'Você já está logado em outra aba. Faça logout primeiro ou use a aba já logada.' });
        return;
      }
    }

    if (!formData.email || !formData.password) {
      setErrors({ general: 'Email e senha são obrigatórios' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ general: 'Você já está logado em outra aba ou navegador. Faça logout primeiro.' });
        } else {
          setErrors({ general: data.error });
        }
        return;
      }
   
      localStorage.setItem('token', data.token);
      
     
      localStorage.setItem('userSession', JSON.stringify({
        userId: data.user.id,
        loggedIn: true,
        timestamp: Date.now()
      }));

      router.push('/profile');

    } catch (error) {
      console.error('Erro no login:', error);
      setErrors({ general: 'Erro interno do servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1 className="page-title">Entrar</h1>
        
        {isAlreadyLoggedIn && (
          <div className="warning-message" style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '12px',
            margin: '0 0 20px 0',
            color: '#856404'
          }}>
            ⚠️ Você já está logado em outra aba. Redirecionando...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              placeholder="Digite seu email"
              disabled={isAlreadyLoggedIn}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="label">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              placeholder="Digite sua senha"
              disabled={isAlreadyLoggedIn}
            />
          </div>

          {errors.general && (
            <div className="general-error">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isAlreadyLoggedIn}
            className="btn btn-primary"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e1e5e9' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Não tem uma conta?{' '}
            <a href="/register" className="link">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}