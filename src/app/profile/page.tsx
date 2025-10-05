'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  score: number;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const router = useRouter();


  const loadUserData = async () => {
    try {
      // Se já tem usuário carregado, só atualiza o score
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);

      if (!token) {
        console.log('Sem token - redirecionando para login');
        router.push('/login');
        return;
      }

      // Tenta acessar a API
      console.log('Fazendo requisição para API...');
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos da API:', data);
        
        // Se já tem user e o score é diferente, atualiza
        if (user && data.user.score !== user.score) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          setLastUpdate(new Date());
        } else if (!user) {
          // Se não tem user ainda, define pela primeira vez
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          setLastUpdate(new Date());
        }
      } else {
        console.log('Erro na API - removendo tokens e redirecionando');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }

    } catch (error) {
      console.error('Erro:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Atualiza automaticamente a cada 10 segundos
    const interval = setInterval(() => {
      loadUserData();
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const handleCopyReferralLink = async () => {
    if (!user) return;

    const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleRefreshScore = async () => {
    if (!user) return;
    
    setIsLoading(true);
    await loadUserData();
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user.referralCode}`;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="header">
          <h1 className="title">Meu Perfil</h1>
          <button onClick={handleLogout} className="logout-button">
            Sair
          </button>
        </div>

        <div className="user-info">
          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <h2 className="user-name">{user?.name || 'Nome não disponível'}</h2>
          <p className="user-email">{user?.email || 'Email não disponível'}</p>
        </div>

        <div className="score-section">
          <div className="score-card">
            <div className="score-header">
              <h3>Pontuação Atual</h3>
              <button 
                onClick={handleRefreshScore} 
                className="refresh-button"
                disabled={isLoading}
                title="Atualizar pontuação"
              >
                🔄
              </button>
            </div>
            <div className="score-value">
              {user.score}
              <span className="score-label">pontos</span>
            </div>
            {lastUpdate && (
              <div className="last-update">
                Última atualização: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
         
          </div>
        </div>

        <div className="referral-section">
          <h3 className="section-title">Seu Link de Indicação</h3>
          <p className="referral-description">
            Compartilhe este link e ganhe 1 ponto para cada pessoa que se cadastrar!
          </p>
          
          <div className="referral-link-container">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="referral-link-input"
            />
            <button
              onClick={handleCopyReferralLink}
              className={`copy-button ${copySuccess ? 'copy-success' : ''}`}
            >
              {copySuccess ? '✓ Copiado!' : '📋 Copiar Link'}
            </button>
          </div>

          {copySuccess && (
            <div className="copy-message">
              Link copiado para a área de transferência!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}