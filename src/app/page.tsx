import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.welcome}>
          <h1>Bem-vindo</h1>
          <p>Sistema de indicações com pontuação</p>
        </div>
        
        <div className={styles.navigation}>
          <Link href="/register" className={styles.navButton}>
            Criar Conta
          </Link>
          <Link href="/login" className={styles.navButton}>
            Fazer Login
          </Link>
        </div>
      </main>
    </div>
  );
}
