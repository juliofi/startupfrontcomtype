import styles from './styles.module.css'

interface Batalha {
    startupA: string
    startupB: string
    selecionada: boolean
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
                    className={`${styles.batalha} ${batalha.selecionada ? styles.ativa : ''}`}
                    onClick={() => onSelecionar(index)}
                >
                    <div className={styles.startup}>{batalha.startupA}</div>
                    <div className={styles.startup}>{batalha.startupB}</div>
                </div>
            ))}
        </div>
    )
}
