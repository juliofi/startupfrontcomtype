import styles from './styles.module.css'

interface Batalha {
    startupA: { nome: string; pontuacao: number }
    startupB: { nome: string; pontuacao: number }
    selecionada: boolean
    finalizada: boolean
}

interface Props {
    batalhas: Batalha[]
    onSelecionar: (index: number) => void
}

export default function Chaveamento({ batalhas, onSelecionar }: Props) {
    return (
        <div className={styles.container}>
            {batalhas.map((batalha, index) => (
                <div
                    key={index}
                    className={`
                  ${styles.batalha} 
                  ${batalha.selecionada ? styles.ativa : ''} 
                  ${batalha.finalizada ? styles.finalizada : ''}
                `}
                    onClick={() => {
                        if (!batalha.finalizada) onSelecionar(index)
                    }}
                >

                    <div className={styles.startupA}>
                        {batalha.startupA.nome} - {batalha.startupA.pontuacao} pts
                    </div>
                    <div className={styles.startupB}>
                        {batalha.startupB.nome} - {batalha.startupB.pontuacao} pts
                    </div>

                </div>
            ))}
        </div>
    )
}
