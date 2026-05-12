import React from "react";
import styles from "./styles.css"

const Ebit = () => {
    return (
        <>
            <a id="seloEbit" href="http://www.ebit.com.br/93443" target="_blank" data-noop="redir(this.href);">
                <img className={styles['ebit-img']} src="https://newimgebit-a.akamaihd.net/ebitBR/selo/img_93443.png"/>
            </a>
            <script type="text/javascript" id="getSelo" src="https://imgs.ebit.com.br/ebitBR/selo-ebit/js/getSelo.js?93443">
            </script>
        </>
    )
}

export default Ebit
