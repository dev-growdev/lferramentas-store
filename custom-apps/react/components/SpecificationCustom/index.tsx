import React from 'react'
import { useProduct } from 'vtex.product-context'
import ReactMarkdown from 'react-markdown';

import styles from "./styles.css"

interface Item {
  name: string;
  values: string[];
}
const SpecificationCustom = () => {
  const ctx = useProduct()
  const specification: Item[] = ctx?.product?.properties as Item[] || []
  const composition = specification?.filter((item: { name: string }) => item?.name === 'Composição')?.[0]?.values?.[0]

  const specificationValues = ["Itens inclusos", "Indicações"]
  const specificationValuesExcluded = [
    'Medidas do Produto',
    'Cuidados',
    'Composição',
    'Tabela de Medidas',
    'NetshoesProductGroup'
  ]

  const filteredSpecificationValues = specification?.filter((item: { name: string }) => specificationValues.includes(item.name));
  const filteredSpecificationValuesExcluded = specification?.filter((item: { name: string }) => !specificationValuesExcluded.includes(item.name));

  const [expandedAccordion, setExpandedAccordion] = React.useState<string | null>(null);

  const handleAccordionToggle = (name: string) => {
    if (expandedAccordion === name) {
      setExpandedAccordion(null);
    } else {
      setExpandedAccordion(name);
    }
  };

  return (
    <div>
      {composition && (
        <div className={styles.containerComposition}>
          <h4 className={styles.titleComposition}>Composição:</h4>
          <ReactMarkdown className={styles.textComposition}>{composition}</ReactMarkdown>
        </div>
      )}

      {filteredSpecificationValues.length > 0 && (
        <div className={styles.containerAccordionSpecificationCustom}>
          {filteredSpecificationValues.map(({ name, values }) => (
            <div className={`${styles.accordionItemSpecificationCustom} ${styles.accordionItemSpecificationCustom}-${name}`} key={name}>
              <h4 className={styles.accordionTitleSpecificationCustom} onClick={() => handleAccordionToggle(name)}>{name}</h4>
              {expandedAccordion === name && (
                <div className={styles.accordionTextContainerSpecificationCustom}>
                  <ReactMarkdown>{values[0]}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          <div className={styles.accordionItemSpecificationCustom}>
            <h4 className={styles.accordionTitleSpecificationCustom} onClick={() => handleAccordionToggle("caracteristicas")}>Características</h4>

            {expandedAccordion === "caracteristicas" &&

              filteredSpecificationValuesExcluded.map(({ name, values }) => (

                <div className={styles.accordionValuesSpecificationCustom} key={name}>
                  <strong>{name}</strong>

                  <div className={styles.accordionTextContainerSpecificationCustom}>
                    <ReactMarkdown>{values[0]}</ReactMarkdown>
                  </div>

                </div>
              ))


            }


          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificationCustom;
