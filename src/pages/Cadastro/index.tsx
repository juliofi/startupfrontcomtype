import { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { FaTrash } from 'react-icons/fa'
import api from '../../services/api' // 👈 caminho para o arquivo que criou
import { useNavigate } from 'react-router-dom'


interface Startup {
  id: number
  nome: string
  ano: number
  slogan: string
}

export default function Cadastro() {
  const navigate = useNavigate()
  const [startups, setStartups] = useState<Startup[]>([])
  const [nome, setNome] = useState<string>('')
  const [ano, setAno] = useState<string>('')
  const [slogan, setSlogan] = useState<string>('')
  const [carregando, setCarregando] = useState(false)
  const [carregandoProsseguir, setCarregandoProsseguir] = useState(false)



  const cadastrarStartupsTeste = async () => {
    const nomes = ["Primeira", "Segunda", "Terceira", "Quarta", "Quinta", "Sexta", "Sétima", "Oitava"];

    for (const nome of nomes) {
      try {
        await api.post('/startup', {
          nome,
          ano: 123,
          slogan: '123',
          pontuacao: 70
        });
      } catch (error) {
        console.error(`Erro ao cadastrar ${nome}`, error);
      }
    }

    // Atualiza a lista após cadastro
    const response = await api.get('/startup');
    setStartups(response.data);
  };

  const handleProsseguir = async () => {
    if (![4, 8].includes(startups.length)) {
      alert('É necessário ter 4 ou 8 startups cadastradas para iniciar o torneio.')
      return
    }

    setCarregandoProsseguir(true)

    try {
      await api.post('/torneio/iniciar')
      navigate('/batalhas')
    } catch (error) {
      console.error('Erro ao iniciar o torneio:', error)
      alert('Erro ao iniciar o torneio.')
      setCarregandoProsseguir(false)
    }
  }




  const handleCadastrar = async (): Promise<void> => {
    if (startups.length >= 8 || !nome || !ano || !slogan) return

    setCarregando(true)

    try {
      await api.post('/startup', {
        nome,
        ano: parseInt(ano),
        slogan,
        pontuacao: 70
      })

      const response = await api.get('/startup')
      setStartups(response.data)

      setNome('')
      setAno('')
      setSlogan('')
    } catch (error) {
      console.error('Erro ao cadastrar startup:', error)
    } finally {
      setCarregando(false)
    }
  }

  // Carrega startups já cadastradas do banco ao abrir a página
  useEffect(() => {
    api.get('/startup')
      .then(response => setStartups(response.data))
      .catch(error => console.error('Erro ao buscar startups:', error))
  }, [])

  const handleRemover = async (index: number): Promise<void> => {
    const startup = startups[index]
    if (!startup?.id) return

    try {
      // 1. Deleta todas as batalhas relacionadas com essa startup
      await api.delete(`/torneio/batalhas-da-startup/${startup.id}`)

      // 2. Agora sim, deleta a startup
      await api.delete(`/startup/${startup.id}`)

      // 3. Atualiza a lista
      const response = await api.get('/startup')
      setStartups(response.data)
    } catch (error) {
      console.error('Erro ao deletar startup:', error)
    }
  }


  return (
    <div className={styles.container}>
      <h1 className={styles.titulo} >Cadastro de Startups</h1>

      <div className={styles.lista}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.item}>
            <span>
              <span className={styles.numero}>{i + 1}.</span>{' '}
              {startups[i]?.nome || ''}
            </span>
            {startups[i] && (
              <span className={styles.icones}>
                <FaTrash
                  className={styles.icone}
                  onClick={() => handleRemover(i)}
                />
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
        <button
          className={styles.cadastrar}
          onClick={handleCadastrar}
          disabled={carregando}
        >
          {carregando && <span className={styles.loader}></span>}
          <span style={{ marginLeft: carregando ? '8px' : '0' }}>cadastrar</span>
        </button>

      </div>

      {carregandoProsseguir ? (
        <div className={styles.loaderContainer}>
          <span className={styles.loaderPreta}></span>
        </div>
      ) : (
        <button className={styles.prosseguir} onClick={handleProsseguir}>
          prosseguir
        </button>
      )}

      <button onClick={cadastrarStartupsTeste} className={styles.teste}>
        teste
      </button>
    </div>
  )
}
