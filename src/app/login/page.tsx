'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

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
        setErrors({ general: data.error });
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.token));
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
            />
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