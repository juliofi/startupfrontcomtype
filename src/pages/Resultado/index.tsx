import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Coluna from '../../components/Coluna'
import api from '../../services/api'

interface Startup {
  id: number
  nome: string
  pontuacao: number
  contPitch: number
  contBug: number
  contTracao: number
  contInvestidor: number
  contPenalidade: number
}

export default function Resultado() {
  const [ranking, setRanking] = useState<Startup[]>([])
  const [carregando, setCarregando] = useState(false)


  const handleReset = async () => {
    setCarregando(true)
    try {
      await api.delete('/torneio/reset')
      window.location.href = '/cadastro'
    } catch (error) {
      console.error("Erro ao resetar torneio:", error)
      setCarregando(false)
    }
  }




  useEffect(() => {
    api.get<Startup[]>('/torneio/ranking')
      .then(response => setRanking(response.data))
      .catch(error => console.error("Erro ao carregar ranking:", error))
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Coluna titulo="Ranking" infos={ranking.map(s => s.nome)} />
        <Coluna titulo="Pontos" infos={ranking.map(s => `${s.pontuacao}`)} />
        <Coluna titulo="Bugs" infos={ranking.map(s => `${s.contBug}`)} />
        <Coluna titulo="Pitches" infos={ranking.map(s => `${s.contPitch}`)} />
        <Coluna titulo="Trações" infos={ranking.map(s => `${s.contTracao}`)} />
        <Coluna titulo="Investidores Irritados" infos={ranking.map(s => `${s.contInvestidor}`)} />
        <Coluna titulo="Penalidades" infos={ranking.map(s => `${s.contPenalidade}`)} />
      </div>
      {carregando ? (
        <div className={styles.loaderContainer}>
          <span className={styles.loader}></span>
        </div>
      ) : (
        <button className={styles.resetar} onClick={handleReset} disabled={carregando}>
          {carregando && <span className={styles.loader}></span>}
          resetar
        </button>


      )}

    </div>
  )
}
