import styles from './styles.module.css'

interface Props {
  titulo: string
  infos: string[]
}

export default function Coluna({ titulo, infos }: Props) {
  return (
    <div className={styles.coluna}>
      <span className={styles.titulo}>{titulo}</span>
      <div className={styles.infos}>
        {infos.map((info, i) => (
          <span key={i}>{info}</span>
        ))}
      </div>
    </div>
  )
}
