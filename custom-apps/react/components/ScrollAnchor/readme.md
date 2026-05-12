# Como utilizar o app ScrollAnchor? 🤔

Para utilizar esse app, você deverá fazer a seguinte chamada na página onde deseja que ocorra o scroll:

```
 "flex-layout.row#exemplos-scroll-anchor": {
  "children": [
    "rich-text#texto1",
    "rich-text#texto2",
    "scroll-anchor#texto-teste1__para__SEO-home",
    "scroll-anchor#texto-teste2__para__SEO-depart-man"
  ]
},
```

Bloco:

```
"scroll-anchor#texto-teste2__para__SEO-depart-man": {
  "props": {
    "navigateTo": "/man",
    "link": ".vtex-rich-text-0-x-paragraph--teste-menu2",
    "anchor": ".vtex-rich-text-0-x-strong--text-seo-departament-title"
  }
}
```
Esse exemplo está disponível no arquivo `exemplo-scroll-anchor` dentro dos components da home, no boilerplate.


## Atenção para as props:
- `navigateTo:` *(opcional)* Essa prop serve para mudar de página antes de scrollar. Observe o uso no exemplo acima. 
- `link:` Aqui você deve adicionar a classe ou id do elemento em que fará o CLIQUE. Atente-se para que a classe/id seja única na página.
- `anchor:` Aqui você deve adicionar a classe ou id do elemento que você deseja ancorar após o clique. Atente-se para que a classe/id seja única na página.

Tanto em `link` quanto em `anchor` a string adicionada irá para um `document.querySelector`, então não se esqueça de adicionar o `.` (classe) ou `#` (id) conforme necessário.

## Eu tenho vários links, e agora?

Faça uma chamada `scroll-anchor#link` para cada um deles, modificando o nome após a #. Dica: se tiver muitos links com esse comportamento, crie uma pasta só com as chamadas e crie nomes que facilitem a identificação de qual é o link e pra onde está sendo ancorado (exemplo disponível na loja Savegnago).
