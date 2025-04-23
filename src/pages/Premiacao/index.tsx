import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Confetti from 'react-confetti'   


interface Startup {
    id: number
    nome: string
    pontuacao: number
    ano: number
    slogan: string
}


export default function Premiacao() {
    const [ranking, setRanking] = useState<Startup[]>([])
    const [mostrarTerceiro, setMostrarTerceiro] = useState(false)
    const [mostrarSegundo, setMostrarSegundo] = useState(false)
    const [mostrarPrimeiro, setMostrarPrimeiro] = useState(false)

    const handleReiniciar = () => {
        window.location.href = '/'
    }



    useEffect(() => {
        const dados = localStorage.getItem('rankingFinal')
        if (dados) {
            try {
                const parsed = JSON.parse(dados)
                setRanking(parsed)
            } catch (e) {
                console.error("Erro ao ler ranking do localStorage:", e)
            }
        }
    }, [])






    useEffect(() => {
        const t1 = setTimeout(() => setMostrarTerceiro(true), 1000)
        const t2 = setTimeout(() => setMostrarSegundo(true), 2000)
        const t3 = setTimeout(() => setMostrarPrimeiro(true), 3500)
        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
        }
    }, [])

    return (
        <div className={styles.container}>

            {mostrarPrimeiro && ranking[0] && (
                <h1 className={styles.tituloVencedora}>{ranking[0].nome}</h1>
            )}

            {mostrarPrimeiro && <Confetti />}

            <div className={styles.podio}>
                {mostrarSegundo && (
                    <div className={`${styles.colocacao} ${styles.segundo}`}>
                        🥈 {ranking[1]?.nome}
                    </div>
                )}
                {mostrarPrimeiro && (
                    <div className={`${styles.colocacao} ${styles.primeiro}`}>
                        🥇 {ranking[0]?.nome}
                    </div>
                )}
                {mostrarTerceiro && (
                    <div className={`${styles.colocacao} ${styles.terceiro}`}>
                        🥉 {ranking[2]?.nome}
                    </div>
                )}
            </div>

            {mostrarPrimeiro && ranking[0] && (
                <>
                    <div className={styles.infos}>
                        <h2 className={styles.slogan}>"{ranking[0].slogan}"</h2>
                        <p className={styles.detalhes}>
                            A <strong>{ranking[0].nome}</strong> foi fundada em {ranking[0].ano} e é a vencedora do <strong>Startup Rush 2025</strong>.
                        </p>
                    </div>

                    <button className={`${styles.resetar} ${styles.resetarAtrasado}`} onClick={handleReiniciar}>
                        reiniciar
                    </button>

                </>
            )}
        </div>
    )

}
