import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import api from '../../services/api'

export default function Home() {
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(false)

  const handleStart = async () => {
    setCarregando(true)

    try {
      localStorage.clear(); // <- apaga o estado salvo no navegador
      await api.delete('/torneio/reset')
      navigate('/cadastro')
    } catch (error) {
      console.error('Erro ao resetar torneio:', error)
      setCarregando(false)
    }
  }

  return (
    <div className={styles.container}>
      {!carregando ? (
        <>
          <h1 className={styles.titulo}>Startup Rush</h1>
          <button className={styles.botao} onClick={handleStart}>iniciar</button>
        </>
      ) : (
        <div className={styles.apagandoContainer}>
          <p className={styles.msg}>apagando o último torneio...</p>
          <span className={styles.loader}></span>
        </div>
      )}
    </div>
  )
}
