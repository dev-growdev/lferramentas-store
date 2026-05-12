import React, { useEffect, useState } from 'react'
import style from './styles.css'
import Modal from './Modal'

export default function PaymentModal() {
  const [openModalPagamento, setOpenModalPagamento] = useState<boolean>(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenModalPagamento(false);
      }
    };

    if (openModalPagamento) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openModalPagamento]);



  return (
    <div>
      <button onClick={() => setOpenModalPagamento(true)} className={style.btnActiveModal}>
        Mais opções de pagamento
      </button>
      {openModalPagamento && (
        <div className={style.mainOverlay} onClick={() => {
          setOpenModalPagamento(false)
        }} />
      )
      }
      {openModalPagamento && <Modal fecharModal={() => setOpenModalPagamento(false)} />}
    </div>
  )
}
