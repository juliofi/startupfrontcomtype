import styles from './styles.module.css'
import { useEffect, useState } from 'react'

interface Batalha {
    startupA: {
        nome: string
    }
    startupB: {
        nome: string
    }
}


export default function Administrar() {
    const [batalha, setBatalha] = useState<Batalha | null>(null)

    useEffect(() => {
        const batalhaSalva = localStorage.getItem('batalhaSelecionada')
        if (batalhaSalva) {
            setBatalha(JSON.parse(batalhaSalva))
        }
    }, [])

    const eventos = [
        'Pitch convincente',
        'Produto com bugs',
        'Boa tração de usuário',
        'Investidor irritado',
        'Fake news no pitch'
    ]

    const [pontosA, setPontosA] = useState(70)
    const [pontosB, setPontosB] = useState(70)
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

                                        const total = 70 + novo.reduce((acc, marcado, idx) => acc + (marcado ? pontuacoes[idx] : 0), 0)
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

                                        const total = 70 + novo.reduce((acc, marcado, idx) => acc + (marcado ? pontuacoes[idx] : 0), 0)
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

            <button className={styles.finalizar}>finalizar</button>
        </div>
    )
}
