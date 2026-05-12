# APP CHANGE TAG HELPER

App com propósito de alterar alguma tag da página (geralmente utilizado para fins de SEO e principalmente para footer MOBILE).

| Prop name | Type   | Default | Description                                                                                                  |
| --------- | ------ | ------- | ------------------------------------------------------------------------------------------------------------ |
| classIdentifier     | string   | null | Classe utilizada para identificar o elemento.                             |
| fromTag       | string   | null    | Tag que o elemento inicialmente possui (div, a, h1, p, etc). |
| toTag | string   |  null       | Nova tag que o elemento vai receber (div, a, h1, p, etc).                                                                                |
| setNewTagClass     | string |    null     | Utilizado para adicionar uma classe nova ao elemento(s) que esta sendo modificado. Exemplo: "vtex-store-components-3-x-infoCardHeadline--welcome-block-title", vai adicionar essa classe no elemento.
| changeOnlyFirstItem     | boolean   | false | Utilizado para limitar para editar apenas a primeira ocorrência da **classeIdentifier**.
| changeChildren     | boolean   | false | Quando habilitado vai alterar as tags dos filhos **classeIdentifier**. 

**Dicas**

- Adicione a chamada do app abaixo da ocorrência do elemento que quer atualizar, exemplo: 

```json
  "footer-layout.mobile": {
    "title": "Conteúdo Footer Mobile",
    "children": [
      "flex-layout.row#que-possui-como-filho-o-elemento-que-quero-atualizar",
      "change-tag-helper"
    ]
  },
   "change-tag-helper": {
    "props": {
      "classIdentifier": "vtex-menu-2-x-styledLinkContent--change-tag-helper__footer-menu--mobile",
      "fromTag": "div",
      "toTag": "h4"
    }
  }
```
- Sempre adicione uma classe nova no bloco para utilizar como identificador, exemplo:
```html
    <div class="vtex-...--elementoPai">
        <span class="vtex-...--elementoFilho vtex-...--classe-que-vai-ser-utilizada-para-alterar"></span>
        <span class="vtex-...--elementoFilho"></span>
    </div>
```

**CUIDADO**

Ao habilitar **changeChildren** todos os elementos filhos (do primeiro nivel) vão ser alterados para a tag definida.

```html
    <div class="vtex-...--elementoPai vtex-...--classe-que-vai-ser-utilizada-para-alterar-os-filhos">
        <span class="vtex-...--elementoFilho-vai-ser-alterado-a-tag">
             Vai ter sua tag span alterada.
            <span class="vtex-...--elementoFilho-NÃO-vai-ser-alterado-a-tag">Não vai ter sua tag span alterada.</span>
        </span>
        <span class="vtex-...--elementoFilho-vai-ser-alterado-a-tag">
            Vai ter sua tag span alterada.
            <h2 class="vtex-...--elementoFilho-NÃO-vai-ser-alterado-a-tag">Não vai ter sua tag h2 alterada.</h2>
        </span>
    </div>
```

### Lojas que utilizam o APP

- Orfeu;
- Casa do Tenista;

