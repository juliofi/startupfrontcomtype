import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

export default function Home() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/cadastro') // Ajuste para a próxima página se necessário
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Startup Rush</h1>
      <button className={styles.botao} onClick={handleStart}>começar</button>
    </div>
  )
}
