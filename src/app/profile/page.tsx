'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

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

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Tentar carregar do localStorage primeiro
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Atualizar dados do servidor para ter pontuação mais recente
          const response = await fetch(`/api/profile?userId=${userData.id}`);
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } else {
          // Se não há usuário logado, redirecionar para login
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // Atualização automática da pontuação a cada 10 segundos
  useEffect(() => {
    if (!user) return;

    const updateScore = async () => {
      try {
        const response = await fetch(`/api/profile?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          // Só atualiza se a pontuação mudou
          if (data.user.score !== user.score) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            setLastUpdate(new Date());
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar pontuação automaticamente:', error);
      }
    };

    // Atualizar a cada 10 segundos
    const interval = setInterval(updateScore, 10000);

    // Limpar o interval quando o componente for desmontado
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
      // Fallback para navegadores mais antigos
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
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleRefreshScore = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/profile?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Erro ao atualizar pontuação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
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
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meu Perfil</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className={styles.userName}>{user.name}</h2>
          <p className={styles.userEmail}>{user.email}</p>
        </div>

        <div className={styles.scoreSection}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreHeader}>
              <h3>Pontuação Atual</h3>
              <button 
                onClick={handleRefreshScore} 
                className={styles.refreshButton}
                disabled={isLoading}
                title="Atualizar pontuação"
              >
                🔄
              </button>
            </div>
            <div className={styles.scoreValue}>
              {user.score}
              <span className={styles.scoreLabel}>pontos</span>
            </div>
            {lastUpdate && (
              <div className={styles.lastUpdate}>
                Última atualização: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            <div className={styles.autoUpdateInfo}>
              ✨ Atualização automática a cada 10 segundos
            </div>
          </div>
        </div>

        <div className={styles.referralSection}>
          <h3 className={styles.sectionTitle}>Seu Link de Indicação</h3>
          <p className={styles.referralDescription}>
            Compartilhe este link e ganhe 1 ponto para cada pessoa que se cadastrar!
          </p>
          
          <div className={styles.referralLinkContainer}>
            <input
              type="text"
              value={referralLink}
              readOnly
              className={styles.referralLinkInput}
            />
            <button
              onClick={handleCopyReferralLink}
              className={`${styles.copyButton} ${copySuccess ? styles.copySuccess : ''}`}
            >
              {copySuccess ? '✓ Copiado!' : '📋 Copiar Link'}
            </button>
          </div>

          {copySuccess && (
            <div className={styles.copyMessage}>
              Link copiado para a área de transferência!
            </div>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Código de Indicação</span>
            <span className={styles.statValue}>{user.referralCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
}