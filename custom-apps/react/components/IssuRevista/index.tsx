import React from "react";
import styles from './styles.css'

interface RevistaIssudProps {
  htmlDate: string;
}
export function IssuRevista({ htmlDate }: RevistaIssudProps) {
  return (
    <div className={styles.containerAppIssu}>
      <div className={styles.contentAppIssu}>
        <span className={styles.ScriptAppIssu}>
          <div contentEditable='false' dangerouslySetInnerHTML={{ __html: htmlDate }} />
        </span>
      </div>
    </div>
  );
}

IssuRevista.schema = {
  title: "Campo para adicionar Script Issu",
  description: "Campo para adicionar/receber HTML",
  type: "object",
  properties: {
    htmlDate: {
      addHTML: "Adicionar o HTML",
      description: "Adicione o script no input",
      type: "string"
    },

  },
};
