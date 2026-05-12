import React from 'react'
import style from './styles.css'
import InfoPayments from './InfoPayments'

type Props = {
  fecharModal: any,
}

export default function Modal({ fecharModal }: Props) {
  return (
    <>
      <div className={style.modalPagamentoOverlay}>
        <div className={style.modalPagamentoContainer}>
          <div className={style.containerHeaderTitle}>
            <button onClick={fecharModal} className={style.btnCloseModalPagamento}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7.23985L1.50554 11.7343C1.32841 11.9114 1.12177 12 0.885609 12C0.649446 12 0.442804 11.9114 0.265683 11.7343C0.0885611 11.5572 0 11.3506 0 11.1144C0 10.8782 0.0885611 10.6716 0.265683 10.4945L4.76015 6L0.265683 1.50554C0.0885611 1.32841 0 1.12177 0 0.885609C0 0.649446 0.0885611 0.442804 0.265683 0.265683C0.442804 0.0885611 0.649446 0 0.885609 0C1.12177 0 1.32841 0.0885611 1.50554 0.265683L6 4.76015L10.4945 0.265683C10.6716 0.0885611 10.8782 0 11.1144 0C11.3506 0 11.5572 0.0885611 11.7343 0.265683C11.9114 0.442804 12 0.649446 12 0.885609C12 1.12177 11.9114 1.32841 11.7343 1.50554L7.23985 6L11.7343 10.4945C11.9114 10.6716 12 10.8782 12 11.1144C12 11.3506 11.9114 11.5572 11.7343 11.7343C11.5572 11.9114 11.3506 12 11.1144 12C10.8782 12 10.6716 11.9114 10.4945 11.7343L6 7.23985Z" fill="#303030" />
              </svg>


            </button>
            <h2 className={style.titleModalPagamento}>Opções de Pagamento</h2>
          </div>
          <div className={style.infosPagamentos}>
            <InfoPayments />
          </div>
        </div>
      </div>
    </>
  )
}
