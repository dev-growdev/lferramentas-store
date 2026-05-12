import React, { useState } from 'react'

import styles from './styles.css'

interface FormData {
  name: string
  telephone: string
  email: string
  acepptNews: boolean
  acceptPrivacity: boolean
  construcaoCivil: boolean
  epi: boolean
  ferramentasManuais: boolean
  ferramentasEletricasBateria: boolean
  jardimAgricola: boolean
  limpeza: boolean
  soldas: boolean
  outras: boolean
  others?: string
}

const INTERESTS = [
  { name: 'construcaoCivil', label: 'Construção Civil' },
  { name: 'epi', label: 'EPI' },
  { name: 'ferramentasManuais', label: 'Ferramentas Manuais' },
  {
    name: 'ferramentasEletricasBateria',
    label: 'Ferramentas Elétricas/ Bateria',
  },
  { name: 'jardimAgricola', label: 'Jardim e Agrícola' },
  { name: 'limpeza', label: 'Limpeza' },
  { name: 'soldas', label: 'Soldas' },
  { name: 'outras', label: 'Outras' },
]

const NewsletterBlackFriday = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    telephone: '',
    email: '',
    acepptNews: false,
    acceptPrivacity: false,
    construcaoCivil: false,
    epi: false,
    ferramentasManuais: false,
    ferramentasEletricasBateria: false,
    jardimAgricola: false,
    limpeza: false,
    soldas: false,
    outras: false,
    others: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verifica se o checkbox de aceitar os termos de privacidade está marcado
    if (!formData.acceptPrivacity) {
      alert('Você precisa aceitar os termos de privacidade para prosseguir.')

      return
    }

    if (formData.outras && !formData.others) {
      alert('Por favor, informe seu interesse na seção "Outras".')

      return
    }

    try {
      const interests =
        INTERESTS.filter(
          opt =>
            opt.name !== 'outras' && formData[opt.name as keyof typeof formData]
        ).map(opt => opt.label) ?? []

      if (formData.outras && formData.others) {
        interests.push(formData.others)
      }

      // Enviar os dados para a entidade NB do Master Data
      const response = await fetch('/api/dataentities/NB/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          telephone: formData.telephone,
          email: formData.email,
          acepptNews: formData.acepptNews,
          acceptPrivacity: formData.acceptPrivacity,
          interests: interests.join(', '),
        }),
      })

      if (response.ok) {
        alert('Cadastro realizado com sucesso!')
        // Resetar os campos do formulário após o envio bem-sucedido
        setFormData({
          name: '',
          telephone: '',
          email: '',
          acepptNews: false,
          acceptPrivacity: false,
          construcaoCivil: false,
          epi: false,
          ferramentasManuais: false,
          ferramentasEletricasBateria: false,
          jardimAgricola: false,
          limpeza: false,
          soldas: false,
          outras: false,
        })
      } else {
        alert('Houve um problema ao enviar o cadastro. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error)
      alert('Erro ao enviar os dados. Verifique sua conexão e tente novamente.')
    }
  }

  return (
    <form className={styles.bfForm} onSubmit={handleSubmit}>
      <div className={styles.bfFormInputs}>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          className={styles.input}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.input}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telephone"
          placeholder="Telefone"
          className={styles.input}
          value={formData.telephone}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.bfFormCheckboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="acepptNews"
            className={styles.checkbox}
            checked={formData.acepptNews}
            onChange={handleChange}
          />
          Aceito receber comunicações de ofertas da LF ao me cadastrar.
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="acceptPrivacity"
            className={styles.checkbox}
            checked={formData.acceptPrivacity}
            onChange={handleChange}
            required
          />
          <div>
            Li e aceito os{' '}
            <a
              target="_blank"
              href="https://ajuda.lfmaquinaseferramentas.com.br/hc/pt-br/articles/360051506314-Polit%C3%ADca-de-Privacidade-e-Seguran%C3%A7a"
            >
              termos de Privacidade e Segurança.
            </a>
          </div>
        </label>
      </div>
      <div>
        <p className={styles.bfFormTitle}>
          Quais ofertas você gostaria de ver na Black Friday da LF este ano?
        </p>
      </div>
      <div className={`flex ${styles.bfFormMultipleCheckbox}`}>
        {INTERESTS.map(opt => (
          <label
            className={`${styles.checkboxLabel} ${styles.checkboxLabelMultiple}`}
            key={opt.name}
          >
            <input
              type="checkbox"
              name={opt.name}
              className={styles.checkbox}
              checked={Boolean(formData[opt.name as keyof FormData])}
              onChange={handleChange}
            />
            {opt.label}
          </label>
        ))}
      </div>
      {formData?.outras && (
        <div>
          <div
            className={`${styles.bfFormInputs} ${styles.bfFormOthersInput} items-center`}
          >
            <p className={styles.bfFormAuxiliaryText}>
              Se marcou Outras, informe qual(is):
            </p>
            <input
              type="text"
              name="others"
              placeholder="Escreva seu interesse aqui..."
              className={styles.input}
              value={formData.others}
              onChange={handleChange}
              disabled={!formData.outras}
            />
          </div>
        </div>
      )}
      <div className={styles.bfFormSubmit}>
        <button type="submit" className={styles.bfFormButtonSubmit}>
          CADASTRAR
        </button>
      </div>
    </form>
  )
}

export default NewsletterBlackFriday
