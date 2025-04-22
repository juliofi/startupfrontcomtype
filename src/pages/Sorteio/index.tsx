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
  const [batalhas, setBatalhas] = useState<Batalha[]>([])
  const [carregando, setCarregando] = useState(true)
  const selecionarBatalha = (index: number) => {
    setBatalhas(batalhas.map((b, i) => ({
      ...b,
      selecionada: i === index
    })))
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



  useEffect(() => {
    const carregarBatalhas = async () => {
      try {
        const response = await api.get<Batalha[]>('/torneio/batalhas')
  
        // Se já havia uma batalha selecionada, preserva a seleção
        setBatalhas(prev => {
          const selecionadaId = prev.find(b => b.selecionada)?.id
  
          const batalhasCarregadas = response.data.map(b => ({
            ...b,
            selecionada: b.id === selecionadaId
          }))
  
          return batalhasCarregadas
        })
      } catch (error) {
        alert('Erro ao carregar batalhas. Tente novamente.')
        console.error(error)
      } finally {
        setCarregando(false)
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



  const algumaFinalizada = batalhas.some(b => b.finalizada)

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Batalhas</h1>
      {carregando && (
        <div className={styles.loaderContainer}>
          <span className={styles.loader}></span>
        </div>
      )}

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

        <button className={styles.administrar} onClick={handleAdministrar} >administrar</button>
      </div>

    </div>
  )
}
