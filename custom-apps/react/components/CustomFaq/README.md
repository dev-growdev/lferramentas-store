# CustomFaq

## Um app de perguntas e respostas para páginas institucionais e PDPs.

### Propriedades do app:

| Prop name    | Type            | Description    | Default value                                                                                                                               |
| ------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | 
| `questions`      | `array`       | Perguntas         |         |
| `flex-direction`      | `enum`       | Direção das perguntas em CSS         |     `row`    |
| `justify-content`      | `enum`       | Espaçamento entre as perguntas |   `space-between`      |
| `align-items`      | `string`       | Alinhamento horizontal         |   `center`      |
| `closePrev`      | `boolean`       | Fechar pergunta anterior ao abrir a próxima |     `false`    |
| `iconColor`      | `string`       | Cor em hexadecimal do ícone   |    #000     |
| `icon`      | `string`       | Campo de upload do ícone   |     `image-uploader`    |



Props do item(`CustomFaqQuestions`) de perguntas `questions`

| Prop name    | Type            | Description    | Default value                                                                                                                               |
| ------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | 
| `title`      | `string`       | Pergunta |   `Pergunta`      |
| `response`      | `string`       | Resposta da pergunta |   `Lorem ipsum`      |
| `colorQ`      | `string`       | Cor personalizada da pergunta |         |
| `colorQIcon`      | `boolean`       | Aplicar cor personalizado ao ícone? |    `false`     |
| `colorR`      | `string`       | Cor pernalizada em hexadecímal |         |


Basta chamar o custom-faq como children em um flex-layout

```
"flex-layout.col#container-content-and-title-institucional-duvidas-frequentes": {
    "title": "Container Titulo E Conteudo",
    "props": {
      "preventVerticalStretch": true,
      "blockClass": [
        "container__conteudo-institucional-desktop"
      ]
    },
    "children": [
      "rich-text#titulo-institucional-duvidas-frequentes",
      "custom-faq"
    ]
  }
```


Crie um arquivo chamado de custom-faq e crie as perguntas seguindo o seguinte exemplo:

```
{
  "custom-faq": {
    "props": {
      "questions": [
        {
          "__editorItemTitle": "Pergunta 01",
          "response": "Lorem ipsum dolor sit amet. Id cumque quia est voluptatem quas quo magni nemo in commodi consequuntur cum veritatis nulla ea velit mollitia. Eum illo deleniti et delectus facilis ut nulla rerum sit enim perspiciatis et ipsam omnis ut quaerat optio et quia itaque.",
          "colorQIcon": false
        },
        {
          "__editorItemTitle": "Pergunta 02",
          "response": "Lorem ipsum dolor sit amet. Id cumque quia est voluptatem quas quo magni nemo in commodi consequuntur cum veritatis nulla ea velit mollitia. Eum illo deleniti et delectus facilis ut nulla rerum sit enim perspiciatis et ipsam omnis ut quaerat optio et quia itaque.",
          "colorQIcon": false
        },
        {
          "__editorItemTitle": "Pergunta 03",
          "response": "Lorem ipsum dolor sit amet. Id cumque quia est voluptatem quas quo magni nemo in commodi consequuntur cum veritatis nulla ea velit mollitia. Eum illo deleniti et delectus facilis ut nulla rerum sit enim perspiciatis et ipsam omnis ut quaerat optio et quia itaque.",
          "colorQIcon": false
        },
        {
          "__editorItemTitle": "Pergunta 04",
          "response": "Lorem ipsum dolor sit amet. Id cumque quia est voluptatem quas quo magni nemo in commodi consequuntur cum veritatis nulla ea velit mollitia. Eum illo deleniti et delectus facilis ut nulla rerum sit enim perspiciatis et ipsam omnis ut quaerat optio et quia itaque.",
          "colorQIcon": false
        }
      ]
    }
  }
}

```


Este app consiste nos seguintes arquivos:

```
|_ custom-apps/
|  |_ messages/
|  |  |_ pt.json
|  |  |_ context.json
|  |_ react/
|  |  |_ components/
|  |  |  |_ CustomFaq/
|  |  |  |  |_ handles/
|  |  |  |  |  |_ index.ts
|  |  |  |  |_ index.tsx
|  |  |  |  |_ icon.tsx
|  |  |  |  |_ styles.css
|  |  |  |  |_ README.md
|  |  |_ context/
|  |  |  |_ CustomFaqContext.tsx
|  |  |_ messages/
|  |  |  |_ index.ts
|  |  |_ typings/
|  |  |  |_ types.d.ts
|  |  |_ CustomFaq.tsx
|  |_ store/
|  |  |_ contentSchema.json
|  |  |_ interfaces.json
```


### Dependências
`react-markdown` instalado a pasta React 


*Este app já vem preparado para cross border*
