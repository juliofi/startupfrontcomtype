import { useState } from 'react'
import styles from './styles.module.css'
import { FaEdit, FaTrash } from 'react-icons/fa'

interface Startup {
  nome: string
  ano: string
  slogan: string
}

export default function Cadastro(){
  const [startups, setStartups] = useState<Startup[]>([])
  const [nome, setNome] = useState<string>('')
  const [ano, setAno] = useState<string>('')
  const [slogan, setSlogan] = useState<string>('')

  const handleCadastrar = (): void => {
    if (startups.length >= 8 || !nome || !ano || !slogan) return
    setStartups([...startups, { nome, ano, slogan }])
    setNome('')
    setAno('')
    setSlogan('')
  }

  const handleRemover = (index: number): void => {
    const novas = [...startups]
    novas.splice(index, 1)
    setStartups(novas)
  }

  return (
    <div className={styles.container}>
      <h1>Cadastro de Startups</h1>

      <div className={styles.lista}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.item}>
            <span>{i + 1}. {startups[i]?.nome || ''}</span>
            {startups[i] && (
              <span className={styles.icones}>
                <FaEdit className={styles.icone} />
                <FaTrash className={styles.icone} onClick={() => handleRemover(i)} />
              </span>
            )}
          </div>
        ))}
      </div>

      <div className={styles.form}>
        <div className={styles.linha}>
          <input
            className={styles.inputNome}
            type="text"
            placeholder="nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
          <input
            className={styles.inputAno}
            type="text"
            placeholder="ano"
            value={ano}
            onChange={e => setAno(e.target.value)}
          />
        </div>
        <input
          className={styles.inputSlogan}
          type="text"
          placeholder="slogan"
          value={slogan}
          onChange={e => setSlogan(e.target.value)}
        />
        <button onClick={handleCadastrar}>cadastrar</button>
      </div>

      <button className={styles.prosseguir}>prosseguir</button>
    </div>
  )
}
