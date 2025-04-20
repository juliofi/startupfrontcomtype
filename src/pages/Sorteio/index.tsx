import { useState } from 'react'
import Chaveamento from '../../components/Chaveamento'
import styles from './styles.module.css'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

interface Startup {
  id: number
  nome: string
  slogan: string
  ano: number
}

interface Batalha {
  id: number
  startupA: Startup
  startupB: Startup
  pontuacaoA: number
  pontuacaoB: number
  finalizada: boolean
  vencedora: Startup | null
  selecionada?: boolean // só existe no front
}

export default function Sorteio() {
  const navigate = useNavigate()

  const handleAdministrar = () => {
    const batalhaSelecionada = batalhas.find(b => b.selecionada)

    if (!batalhaSelecionada) {
      alert('Selecione uma batalha para administrar.')
      return
    }

    localStorage.setItem('batalhaSelecionada', JSON.stringify(batalhaSelecionada))
    navigate('/administrar')
  }


  const [batalhas, setBatalhas] = useState<Batalha[]>([])

  const embaralhar = async () => {
    try {
      const response = await api.post<Batalha[]>('/torneio/iniciar')

      const batalhasComSelecao = response.data.map((batalha, i) => ({
        ...batalha,
        selecionada: i === 0
      }))

      setBatalhas(batalhasComSelecao)
    } catch (error) {
      console.error('Erro ao embaralhar batalhas:', error)
    }
  }

  const selecionarBatalha = (index: number) => {
    setBatalhas(batalhas.map((b, i) => ({
      ...b,
      selecionada: i === index
    })))
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Batalhas</h1>

      <Chaveamento
        batalhas={batalhas.map(b => ({
          startupA: b.startupA.nome,
          startupB: b.startupB.nome,
          selecionada: !!b.selecionada
        }))}
        onSelecionar={selecionarBatalha}
      />

      <div className={styles.botoes}>
        <button className={styles.embaralhar} onClick={embaralhar}>embaralhar</button>
        <button className={styles.administrar} onClick={handleAdministrar} >administrar</button>
      </div>

    </div>
  )
}
