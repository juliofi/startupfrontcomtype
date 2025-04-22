import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import styles from './styles.module.css'

interface Batalha {
    id: number
    startupA: {
        id: number
        nome: string
    }
    startupB: {
        id: number
        nome: string
    }
    pontuacaoA: number
    pontuacaoB: number
    finalizada: boolean
    vencedora: string | null
}



export default function Administrar() {
    const [batalha, setBatalha] = useState<Batalha | null>(null)
    const [carregando, setCarregando] = useState(true)

    const navigate = useNavigate()


    const handleFinalizar = async () => {
        if (!batalha) return

        let pontosA = batalha.pontuacaoA
        let pontosB = batalha.pontuacaoB


        eventos.forEach((_, index) => {
            if (checksA[index]) pontosA += pontuacoes[index]
            if (checksB[index]) pontosB += pontuacoes[index]
        })

        // Shark Fight
        if (pontosA === pontosB) {
            const vencedorAleatorio = Math.random() < 0.5 ? 'A' : 'B'
            if (vencedorAleatorio === 'A') pontosA += 2
            else pontosB += 2
        }

        const vencedora =
            pontosA > pontosB ? batalha.startupA.nome :
                pontosB > pontosA ? batalha.startupB.nome : null

        if (!vencedora) {
            alert("Erro ao determinar a vencedora.")
            return
        }

        const pontuacaoFinalA = vencedora === batalha.startupA.nome ? pontosA + 30 : pontosA
        const pontuacaoFinalB = vencedora === batalha.startupB.nome ? pontosB + 30 : pontosB

        // Mapear contadores a partir dos checkboxes
        const contPitchA = Number(checksA[0])
        const contBugA = Number(checksA[1])
        const contTracaoA = Number(checksA[2])
        const contInvestidorA = Number(checksA[3])
        const contPenalidadeA = Number(checksA[4])

        const contPitchB = Number(checksB[0])
        const contBugB = Number(checksB[1])
        const contTracaoB = Number(checksB[2])
        const contInvestidorB = Number(checksB[3])
        const contPenalidadeB = Number(checksB[4])

        setCarregando(true) // Mostra "Carregando..." enquanto finaliza

        try {

            setCarregando(true)
            // 1. Finaliza a batalha
            await api.put(`/torneio/batalha/${batalha.id}`, {
                id: batalha.id,
                pontuacaoA: pontuacaoFinalA,
                pontuacaoB: pontuacaoFinalB,
                finalizada: true,
                vencedora: vencedora
            })

            await api.put(`/startup/${batalha.startupA.id}`, {
                pontuacao: pontuacaoFinalA,
                contPitch: contPitchA,
                contBug: contBugA,
                contTracao: contTracaoA,
                contInvestidor: contInvestidorA,
                contPenalidade: contPenalidadeA
            })

            await api.put(`/startup/${batalha.startupB.id}`, {
                pontuacao: pontuacaoFinalB,
                contPitch: contPitchB,
                contBug: contBugB,
                contTracao: contTracaoB,
                contInvestidor: contInvestidorB,
                contPenalidade: contPenalidadeB
            })





            navigate('/sorteio')
        } catch (error) {
            console.error("Erro ao finalizar batalha:", error)
            alert("Erro ao finalizar batalha.")
            setCarregando(false) // <- Em caso de erro, esconde manualmente
        }
    }



    useEffect(() => {
        setCarregando(false) // <- Em caso de erro, esconde manualmente
        const batalhaSalva = localStorage.getItem('batalhaSelecionada')
        if (batalhaSalva) {
            const batalhaCarregada: Batalha = JSON.parse(batalhaSalva)
            setBatalha(batalhaCarregada)
            setPontosA(batalhaCarregada.pontuacaoA)
            setPontosB(batalhaCarregada.pontuacaoB)
        }
    }, [])




    const eventos = [
        'Pitch convincente',
        'Produto com bugs',
        'Boa tração de usuário',
        'Investidor irritado',
        'Fake news no pitch'
    ]

    const [pontosA, setPontosA] = useState<number>(0)
    const [pontosB, setPontosB] = useState<number>(0)
    const [checksA, setChecksA] = useState<boolean[]>(Array(eventos.length).fill(false))
    const [checksB, setChecksB] = useState<boolean[]>(Array(eventos.length).fill(false))

    const pontuacoes = [6, -4, 3, -6, -8]


    if (!batalha) return null
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Coluna de eventos à esquerda */}
                <div className={styles.eventos}>
                    {eventos.map((evento, i) => (
                        <div key={i} className={styles.evento}>{evento}</div>
                    ))}
                </div>

                {/* Painel das duas startups */}
                <div className={styles.paineis}>
                    {/* Painel Startup A */}
                    <div className={styles.startup}>
                        <span className={styles.tituloStartup} >{batalha?.startupA.nome}</span>
                        <div className={styles.pontuacao}>
                            <span>{pontosA}</span><small>pts</small>
                        </div>
                        <div className={styles.checkboxes}>
                            {eventos.map((_, i) => (
                                <input
                                    key={i}
                                    type="checkbox"
                                    checked={checksA[i]}
                                    onChange={() => {
                                        const novo = [...checksA]
                                        novo[i] = !novo[i]
                                        setChecksA(novo)

                                        const total = batalha.pontuacaoA + novo.reduce((acc, marcado, idx) => acc + (marcado ? pontuacoes[idx] : 0), 0)
                                        setPontosA(total)
                                    }}
                                />
                            ))}

                        </div>
                    </div>

                    {/* Painel Startup B */}
                    <div className={styles.startup}>
                        <span className={styles.tituloStartup} >{batalha?.startupB.nome}</span>
                        <div className={styles.pontuacao}>
                            <span>{pontosB}</span><small>pts</small>
                        </div  >
                        <div className={styles.checkboxes}>
                            {eventos.map((_, i) => (
                                <input
                                    key={i}
                                    type="checkbox"
                                    checked={checksB[i]}
                                    onChange={() => {
                                        const novo = [...checksB]
                                        novo[i] = !novo[i]
                                        setChecksB(novo)

                                        const total = batalha.pontuacaoB + novo.reduce((acc, marcado, idx) => acc + (marcado ? pontuacoes[idx] : 0), 0)
                                        setPontosB(total)
                                    }}
                                />
                            ))}

                        </div>

                    </div>
                </div>

                <div className={styles.pontosGabarito}>
                    <span>(+6)</span>
                    <span>(-4)</span>
                    <span>(+3)</span>
                    <span>(-6)</span>
                    <span>(-8)</span>
                </div>
            </div>
            <button
                className={styles.finalizar}
                onClick={handleFinalizar}
                disabled={carregando}
            >
                {carregando && <span className={styles.loader}></span>}
                <span style={{ marginLeft: carregando ? '8px' : '0' }}>finalizar</span>
            </button>

        </div>
    )
}
