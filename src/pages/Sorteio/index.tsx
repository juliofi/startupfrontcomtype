import { useEffect, useState } from 'react'
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


  const handleReset = async () => {
    const confirmar = confirm("Tem certeza que deseja resetar o torneio? Isso apagará todas as startups e batalhas.")
    if (!confirmar) return

    try {
      await api.delete('/torneio/reset')
      alert('Torneio resetado com sucesso!')
      setBatalhas([]) // limpa a tela
    } catch (error) {
      console.error("Erro ao resetar torneio:", error)
      alert("Erro ao resetar torneio.")
    }
  }


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

  useEffect(() => {
    const carregarBatalhas = async () => {
      try {
        const response = await api.get<Batalha[]>('/torneio/batalhas')
        if (response.data.length > 0) {
          const batalhasCarregadas = response.data.map(b => ({ ...b }))
          
          setBatalhas(batalhasCarregadas)
        }
      } catch (error) {
        alert('Erro ao carregar batalhas. Tente novamente.')
        console.error(error)
      }
    }

    carregarBatalhas()
  }, [])

  useEffect(() => {
    const todasFinalizadas = batalhas.length > 0 && batalhas.every(b => b.finalizada)

    if (todasFinalizadas) {
      api.post<Batalha[]>('/torneio/proxima-fase')
        .then(response => {
          if (response.data.length === 0) {
            // Torneio terminou — redireciona para /resultado
            navigate('/resultado')
            return
          }

          const novasBatalhas = response.data.map(b => ({
            ...b
          }))
          
          setBatalhas(novasBatalhas)
        })
        .catch(err => {
          console.error("Erro ao avançar para próxima fase:", err)
          alert("Erro ao avançar para próxima fase. Tente novamente.")
        })
    }
  }, [batalhas])




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


  const algumaFinalizada = batalhas.some(b => b.finalizada)

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Batalhas</h1>

      <Chaveamento
        batalhas={batalhas.map(b => ({
          startupA: {
            nome: b.startupA.nome,
            pontuacao: b.pontuacaoA
          },
          startupB: {
            nome: b.startupB.nome,
            pontuacao: b.pontuacaoB
          },
          selecionada: !!b.selecionada,
          finalizada: b.finalizada
        }))}
        onSelecionar={selecionarBatalha}
      />




      <div className={styles.botoes}>

        <button className={styles.resetar} onClick={handleReset}>resetar</button>

        <button
          className={styles.embaralhar}
          onClick={embaralhar}
          disabled={algumaFinalizada}
        >
          embaralhar
        </button>

        <button className={styles.administrar} onClick={handleAdministrar} >administrar</button>
      </div>

    </div>
  )
}
