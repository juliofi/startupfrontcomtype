import { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { FaEdit, FaTrash } from 'react-icons/fa'
import api from '../../services/api' // 👈 caminho para o arquivo que criou

interface Startup {
  nome: string
  ano: number
  slogan: string
}

export default function Cadastro() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [nome, setNome] = useState<string>('')
  const [ano, setAno] = useState<string>('')
  const [slogan, setSlogan] = useState<string>('')

  const handleCadastrar = async (): Promise<void> => {
    if (startups.length >= 8 || !nome || !ano || !slogan) return

    try {
      await api.post('/startup', {
        nome,
        ano: parseInt(ano), // backend espera Integer
        slogan
      })

      // Atualiza a lista após cadastro
      const response = await api.get('/startup')
      setStartups(response.data)

      // Limpa os campos
      setNome('')
      setAno('')
      setSlogan('')
    } catch (error) {
      console.error('Erro ao cadastrar startup:', error)
    }
  }

  // Carrega startups já cadastradas do banco ao abrir a página
  useEffect(() => {
    api.get('/startup')
      .then(response => setStartups(response.data))
      .catch(error => console.error('Erro ao buscar startups:', error))
  }, [])

  const handleRemover = (index: number): void => {
    const novas = [...startups]
    novas.splice(index, 1)
    setStartups(novas)
    // 🟡 Aqui você pode fazer DELETE no backend depois se quiser
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
