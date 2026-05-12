import React, { useState } from 'react';
import style from './styles.css';

import CreditCards from './payments/CreditCards';
import Pix from './payments/Pix';
import Boleto from './payments/Boleto';
import { TabHeader } from './tab-header';

export default function InfoPayments() {
  const [index, setIndex] = useState<number>(0)


  return (
    <div className={style.modalPagamentoTabs}>
      <TabHeader index={index} setIndex={setIndex} />

      <div className={style.tabContent} hidden={index !== 0}>
        <CreditCards />
      </div>
      <div className={style.tabContent} hidden={index !== 1}>
        <Pix />
      </div>
      <div className={style.tabContent} hidden={index !== 2}>
        <Boleto />
      </div>
      <div className={style.tabContent} hidden={index !== 3}>
        <CreditCards />
      </div>

    </div>
  )
}
