![Logo](https://i.postimg.cc/BnZphTT4/4378745.png)

<span id="top"></span>
<br />

## Navegação

----
#### Usabilidade
- <a href="#sobre">Sobre o menu</a>
- <a href="#niveis">Arvore do Menu - Níveis</a>
- <a href="#demo1">1. AvantiMenu - Arvore do Menu</a>
      - <a href="#demo-niveis">1.0. Níveis</a>
      - <a href="#demo-nome">1.1. Nome</a>
      - <a href="#demo-tipo">1.2. Tipo</a>
      - <a href="#demo-mobile">1.3. Visível em Mobile</a>
      - <a href="#demo-desktop">1.4. Visível em Desktop</a>
      - <a href="#demo-departmentBar">1.5. Exibir na barra de Departamentos</a>
      - <a href="#demo-menuBar">1.6. Exibir na barra de menu</a>
      - <a href="#demo-onHover">1.7. Submenu aberto no hover</a>
      - <a href="#demo-highlight">1.8. Destaque?</a>
      - <a href="#demo-seeAll">1.9. Exibir 'Ver Tudo'</a>
      - <a href="#demo-target">1.10. Abrir em nova guia?</a>
      - <a href="#demo-href">1.11. href / slug</a>
      - <a href="#demo-tagTitle">1.12. Título</a>
      - <a href="#demo-banner">1.13. Banner</a>
      - <a href="#demo-menuicon">1.14. Icone na barra de menu</a>
      - <a href="#demo-hasname">1.15. Exibir nome da Categoria</a>
      - <a href="#demo-order">1.16. Ordenação</a>
- <a href="#demo2">2. AvantiMenu - Configurações _(Desktop)_</a>
      - <a href="#demo-desk-config">2.0. Configurações</a>
      - <a href="#demo-desk-menutype">2.1. Estilo de Menu</a>
      - <a href="#demo-desk-departDef">2.2. Departamentos</a>
      - <a href="#demo-desk-banners">2.3. Banners</a>
      - <a href="#demo-desk-seeall">2.4. Texto do botão 'Ver Tudo'</a>
      - <a href="#demo-desk-depart">2.5. Nome do Departamento</a>
      - <a href="#demo-desk-departicon">2.6. Icone do Departamento</a>
      - <a href="#demo-desk-bannersize">2.7. Altura / Largura máxima dos banners</a>
      - <a href="#demo-desk-secondDef">2.8. Exibir Nível 2</a>
      - <a href="#demo-desk-thirdDef">2.9. Exibir Nível 3</a>
      - <a href="#demo-desk-secondMaxItems">2.10. Máximo de items no Nível 2</a>
      - <a href="#demo-desk-thirdMaxItems">2.11. Máximo de items no Nível 3</a>
- <a href="#demo3">3. AvantiMenu - Configurações _(Mobile)_</a>
      - <a href="#demo-mob-config">3.0. Configurações</a>
      - <a href="#demo-mob-type">3.1. Estilo de Menu</a>
      - <a href="#demo-mob-burguericon">3.2. Menu Hamburguer (Abrir menu)</a>
      - <a href="#demo-mob-title">3.3. Título do menu</a>
      - <a href="#demo-mob-close">3.4. Menu Close (Fechar menu)</a>
      - <a href="#demo-mob-linksh">3.5. Links personalizados (Menu Header)</a>
      - <a href="#demo-mob-logout">3.6. Texto / Exibir botão de Logout</a>
      - <a href="#demo-mob-linksf">3.7. Links personalizados (Menu Footer)</a>
      - <a href="#demo-mob-back">3.8. Texto do botão 'Voltar'</a>
      - <a href="#demo-mob-seeall">3.9. Texto do botão 'Ver Tudo'</a>
      - <a href="#demo-mob-secondDef">3.10. Exibir Nível 2</a>
      - <a href="#demo-mob-thirdDef">3.11. Exibir Nível 3</a>
      - <a href="#demo-mob-secondMaxItems">3.12. Máximo de items no Nível 2</a>
      - <a href="#demo-mob-thirdMaxItems">3.13. Máximo de items no Nível 3</a>

#### Desenvolvedor
- <a href="#install">Instalação</a>
     - <a href="#install1">1. Raiz do repositório do menu</a>
     - <a href="#install2">2. Abra o repositório do menu em seu VSCODE</a>
     - <a href="#install3">3. Nos arquivos da store-theme do repositório do menu</a>
     - <a href="#install4">4. Na store-theme do seu projeto</a>
     - <a href="#install5">5. Copiando os arquivos para o repositório de seu projeto</a>
     - <a href="#install6">6. No arquivo manifest.json da store-theme do seu projeto</a>
     - <a href="#install7">7. Adicionando os blocos no header.jsonc na sua store-theme</a>
     - <a href="#install8">Subindo o app</a>
- <a href="#handles">CSS Handles</a>
- <a href="#props">Propriedades do Contexto</a>
     - <a href="#props1">1 - useAvantiMenu()</a>
     - <a href="#props2">2 - useAvantiMenuDesktop()</a>
     - <a href="#props3">3 - useAvantiMenuMobile()</a>
- <a href="#tree">Arvore de diretórios / arquivos</a>
- <a href="#infos">Considerações Finais</a>

<br /><br />

----
# Usabilidade
----

<span id="sobre"></span>

<br />

## Sobre o menu: <a href="#top">🔝</a>

O Avanti-menu permite criar, mover, editar e excluir seus itens de menu, categorias, subcategorias e etc... de forma otimizada através do **Site Editor**.

A Arvore do menu é dividida em **3 níveis** com os seguintes campos para sua melhor personalização:

<br /><br />

----

<span id="niveis"></span>

<br />

## Arvore do Menu - Níveis <a href="#top">🔝</a>

### <a href="#demo-niveis">Primeiro Nível</a>:
- **<a href="#demo-nome">Nome</a>** _(Nome do Item que será exibido no menu de primeiro nível)_
- **<a href="#demo-tipo">Tipo</a>** _(Campo para selecionar o tipo do item entre "Customizado" ou "Categoria")_
  	- ``Customizado - Opção que permite a utilização do Segundo / Terceiro nível.``
  	- ``Categoria - Opção que permite usar uma categoria usando o ID (identificador numérico)``
- **<a href="#demo-mobile">Visível em Mobile</a>** _(Campo para ativar/desativar a exibição do Item em dispositivos Mobile)_
- **<a href="#demo-desktop">Visível em Desktop</a>** _(Campo para ativar/desativar a exibição do Item em dispositivos Desktop)_
- **<a href="#demo-departmentBar">Exibir na barra de Departamentos</a>** _(Campo para ativar/desativar a exibição do Item no menu de Departamentos "Padrão: ativado")_
- **<a href="#demo-menuBar">Exibir na barra de menu</a>** _(Campo para ativar/desativar a exibição do Item na barra principal de Mene "Padrão: desativado")_
- **<a href="#demo-onHover">Submenu aberto no hover</a>** _(Campo onde você ativar/desativar a exibição do Submenu na barra principal ao passar o mouse no nome do menu, "Padrão: Ativado")__
- **<a href="#demo-highlight">Destaque?</a>** _(Campo para ativar/desativar uma classe extra no item, campo especifico para Desenvolvimento, "Padrão: Desativado")_
- **<a href="#demo-seeAll">Exibir 'Ver Tudo'</a>** _(Campo para ativar/desativar a exibição do botão "Ver Tudo" no submenu)_
- **<a href="#demo-target">Abrir em nova guia?</a>** _(Campo para ativar/desativar a abertura do link em uma nova guia, "Padrão: Desativado")_
- **<a href="#demo-href">href / slug</a>** _(Campo onde será definido o link interno ou externo do item, exp: www.nomedosite.com.br ou /masculino)_
- **<a href="#demo-tagTitle">Título</a>** _(Campo para acrescentar um Título personalizado ao Link, exp: ``<a title="Seu Titulo aqui">``)_
- **<a href="#demo-banner">Banner</a>** _(Campo para upload de banner para menu em dispositivos Desktop. Obs: opção disponível de acordo com o Layout da loja)_
- **<a href="#demo-menuicon">Icone na barra de menu</a>** _(Campo para upload de Icone para menu na barra de menus. Obs: opção disponível de acordo com o Layout da loja)_

### <a href="#demo-niveis">Segundo Nível</a>:
- **<a href="#demo-nome">Nome</a>** _(Nome do Item que será exibido no menu de primeiro nível)_
- **<a href="#demo-mobile">Visível em Mobile</a>** _(Campo para ativar/desativar a exibição do Item em dispositivos Mobile)_
- **<a href="#demo-desktop">Visível em Desktop</a>** _(Campo para ativar/desativar a exibição do Item em dispositivos Desktop)_
- **<a href="#demo-highlight">Destaque?</a>** _(Campo para ativar/desativar uma classe extra no item, campo especifico para Desenvolvimento, "Padrão: Desativado")_
- **<a href="#demo-seeAll">Exibir 'Ver Tudo'</a>** _(Campo para ativar/desativar a exibição do botão "Ver Tudo" no submenu)_
- **<a href="#demo-target">Abrir em nova guia?</a>** _(Campo para ativar/desativar a abertura do link em uma nova guia, "Padrão: Desativado")_
- **<a href="#demo-href">href / slug</a>** _(Campo onde será definido o link interno ou externo do item, exp: www.nomedosite.com.br ou /masculino)_
- **<a href="#demo-tagTitle">Título</a>** _(Campo para acrescentar um Título personalizado ao Link, exp: ``<a title="Seu Titulo aqui">``)_

### <a href="#demo-niveis">Terceiro Nível</a>:
- **<a href="#demo-nome">Nome</a>** _(Nome do Item que será exibido no menu de primeiro nível)_
- **<a href="#demo-mobile">Visível em Mobile</a>** _(Campo para ativar/desativar a exibição do Item em dispositivos Mobile)_
- **<a href="#demo-desktop">Visível em Desktop</a>** _(Campo para ativar/desativar a exibição do Item em dispositivos Desktop)_
- **<a href="#demo-highlight">Destaque?</a>** _(Campo para ativar/desativar uma classe extra no item, campo especifico para Desenvolvimento, "Padrão: Desativado")_
- **<a href="#demo-target">Abrir em nova guia?</a>** _(Campo para ativar/desativar a abertura do link em uma nova guia, "Padrão: Desativado")_
- **<a href="#demo-href">href / slug</a>** _(Campo onde será definido o link interno ou externo do item, exp: www.nomedosite.com.br ou /masculino)_
- **<a href="#demo-tagTitle">Título</a>** _(Campo para acrescentar um Título personalizado ao Link, exp: ``<a title="Seu Titulo aqui">``)_

<br /><br />

<span id="demo1"></span>
<br />

## 1. AvantiMenu - Arvore do Menu <a href="#top">🔝</a>

---

<span id="demo-niveis"></span>
<br />

### 1.0. Níveis <a href="#top">🔝</a>
- Ambiente onde são feitos o cadastro dos departamentos do seu menu nas versões mobile / desktop, veja na imagem abaixo todos os níveis.

![niveis](https://i.postimg.cc/mZRyyWB9/Niveis.png)

<span id="demo-nome"></span>
<br />

### 1.1. Nome <a href="#top">🔝</a>
- Nome do item de menu que deverá ser exibido de acordo com as configurações, exemplo de ``uso / funcionamento`` na imagem abaixo.

![nome](https://i.postimg.cc/0jpCsSh5/1-demo-nome.gif)

<span id="demo-tipo"></span>
<br />

### 1.2. Tipo <a href="#top">🔝</a>
- Selecione o tipo no Primeiro nível, exemplo de ``uso / funcionamento`` na imagem abaixo:

![tipo](https://i.postimg.cc/Xq7vjSzZ/2-demo-tipo.gif)

<span id="demo-mobile"></span>
<br />

### 1.3. Visível em Mobile <a href="#top">🔝</a>
- Ative / Desative a exibição do item de menu em dispositivos Mobile, função disponível para todos os itens nos 3 níveis, exemplo de ``uso / funcionamento`` na imagem abaixo:

![mobile](https://i.postimg.cc/15VQp3wm/3-demo-mobile.gif)

<span id="demo-desktop"></span>
<br />

### 1.4. Visível em Desktop <a href="#top">🔝</a>
- Ative / Desative a exibição do item de menu em dispositivos Desktop, função disponível para todos os itens nos 3 níveis, exemplo de uso na imagem abaixo:

![desktop](https://i.postimg.cc/RCkMptM6/4-demo-desktop.gif)

<span id="demo-departmentBar"></span>
<br />

### 1.5. Exibir na barra de Departamentos <a href="#top">🔝</a>
- Ative / Desative a exibição do item de menu na barra de Departamentos, função disponível apenas no primeiro nível, exemplo de uso na imagem abaixo:

![departments](https://i.postimg.cc/MTcSd6Nm/5-demo-departments.gif)

<span id="demo-menuBar"></span>
<br />

### 1.6. Exibir na barra de menu <a href="#top">🔝</a>
- Ative / Desative a exibição do item de menu na barra de menu, função disponível apenas no primeiro nível, exemplo de uso na imagem abaixo:

![menubar](https://i.postimg.cc/BbGVHJ06/6-demo-menubar.gif)

<span id="demo-onHover"></span>
<br />

### 1.7. Submenu aberto no hover <a href="#top">🔝</a>
- Ative / Desative a exibição do submenu ao passar o mouse no menu, função disponível apenas para barra de menu, exemplo de uso na imagem abaixo:

![onhover](https://i.postimg.cc/g2wHz1CB/7-demo-hover.gif)

<span id="demo-highlight"></span>
<br />

### 1.8. Destaque? <a href="#top">🔝</a>
- Ative / Desative uma classe extra no item, campo especifico para Desenvolvimento, exemplo de uso na imagem abaixo:

![highlight](https://i.postimg.cc/KYbvb72H/15-demo-highlight.gif)

<span id="demo-seeAll"></span>
<br />

### 1.9. Exibir 'Ver Tudo' <a href="#top">🔝</a>
- Ative / Desative a exibição do botão 'Ver Tudo', função disponível no primeiro / segundo nível, exemplo de uso na imagem abaixo:

![seeall](https://i.postimg.cc/pTdTxM7m/8-demo-seeall.gif)

<span id="demo-target"></span>
<br />

### 1.10. Abrir em nova guia? <a href="#top">🔝</a>
- Ative / Desative a abertura do link em uma nova guia, exemplo de uso na imagem abaixo:
      - ``target="_self"``: O link abrirá na mesma guia
      - ``target="_blank"``: O link abrirá em uma nova guia

![target](https://i.postimg.cc/xCx0LWbw/16-demo-target.gif)

<span id="demo-href"></span>
<br />

### 1.11. href / slug <a href="#top">🔝</a>
- Link do seu menu personalizado, exemplo de uso na imagem abaixo.
    - href: (Hypertext Reference), que é o endereço de destino do link.
    - slug: (parte de uma URL), exemplo: seusite.com ``/seuslug``
  
![href](https://i.postimg.cc/fLFwNtmP/9-demo-href.gif)

<span id="demo-tagTitle"></span>
<br />

### 1.12. Título <a href="#top">🔝</a>
- Campo para inserir o título do seu link, exemplo de ``uso / funcionamento`` na imagem abaixo:
![seeall](https://i.postimg.cc/yY3TBM4p/10-demo-title.gif)

<span id="demo-banner"></span>
<br />

### 1.13. Banner <a href="#top">🔝</a>
- Campo para inserir o banner em seu submenu, exemplo de ``uso / funcionamento`` na imagem abaixo:

![banner](https://i.postimg.cc/4Nc0f8rP/11-demo-banner.gif)

<span id="demo-menuicon"></span>
<br />

### 1.14. Icone na barra de menu <a href="#top">🔝</a>
- Campo para inserir o banner em seu submenu, exemplo de ``uso / funcionamento`` na imagem abaixo:

![menuicon](https://i.postimg.cc/tCdzv8KK/12-demo-menu-icon.gif)

<span id="demo-hasname"></span>
<br />

### 1.15. Exibir nome da Categoria <a href="#top">🔝</a>
- Ative / Desative a exibição do nome da categoria, função disponível apenas para o ``Tipo: Categoria``, exemplo de uso na imagem abaixo:

![categoryname](https://i.postimg.cc/43ybdyYG/13-demo-category-name.gif)

<span id="demo-order"></span>
<br />

### 1.16. Ordenação <a href="#top">🔝</a>
- Mude a ordenação da forma que desejar, exemplo de ``uso / funcionamento`` na imagem abaixo:

![order](https://i.postimg.cc/mD8grxrz/14-demo-order.gif)

---
<span id="demo2"></span>
<br />

## 2. AvantiMenu - Configurações _(Desktop)_ <a href="#top">🔝</a>

---

<span id="demo-desk-config"></span>
<br />

### 2.0. Configurações <a href="#top">🔝</a>
- Ambiente para configurações do em dispositivos Desktop, veja a interface na imagem abaixo.

![config](https://i.postimg.cc/W1Bg28cG/configs-desktop.png)

<span id="demo-desk-type"></span>
<br />

### 2.1. Estilo de Menu (Opção exclusiva para Desenvolvedores) <a href="#top">🔝</a>
- Opção para o Desenvolvedor escolher a opção de menu mais semelhante ao menu do cliente para facilitar em seu desenvolvimento, exemplo de funcionamento na imagem abaixo.

![style](https://i.postimg.cc/Pf0mZNkQ/demo-desk-menutype.gif)

<span id="demo-desk-departDef"></span>
<br />

### 2.2. Departamentos <a href="#top">🔝</a>
- Ative / Desative a exibição da barra de departamentos, exemplo de uso na imagem abaixo:

![departDef](https://i.postimg.cc/fWPVFP2z/demo-desk-departmentdef.gif)

<span id="demo-desk-banners"></span>
<br />

### 2.3. Banners <a href="#top">🔝</a>
- Ative / Desative a exibição de todos os Banners, exemplo de uso na imagem abaixo:

![banners](https://i.postimg.cc/DzDzDJ6C/demo-desk-banners.gif)

<span id="demo-desk-seeall"></span>
<br />

### 2.4. Texto do botão 'Ver Tudo' <a href="#top">🔝</a>
- Campo para editar o texto do botão 'Ver Tudo', exemplo de ``uso / funcionamento`` na imagem abaixo:

![seeall](https://i.postimg.cc/1zDTxbcL/demo-desk-seeall.gif)

<span id="demo-desk-depart"></span>
<br />

### 2.5. Nome do Departamento <a href="#top">🔝</a>
- Campo para editar o texto Departamentos na barra de menu, exemplo de ``uso / funcionamento`` na imagem abaixo:

![departments](https://i.postimg.cc/cLRMdW2M/demo-desk-department.gif)

<span id="demo-desk-departicon"></span>
<br />

### 2.6. Icone do Departamento <a href="#top">🔝</a>
- Campo para inserir o icone na barra de Departamentos, exemplo de ``uso / funcionamento`` na imagem abaixo:

![departmenticon](https://i.postimg.cc/g0rV8hr4/demo-desk-departmenticon.gif)

<span id="demo-desk-bannersize"></span>
<br />

### 2.7. Altura / Largura máxima dos banners <a href="#top">🔝</a>
- Campo para editar a altura / largura máxima dos banners, exemplo de ``uso / funcionamento`` na imagem abaixo:

![bannersize](https://i.postimg.cc/0yK5S2PD/demo-desk-bannersize.gif)


<span id="demo-desk-secondDef"></span>
<br />

### 2.8. Exibir Nível 2 <a href="#top">🔝</a>
- Ative / Desative a exibição do Segundo Nível na versão Desktop, exemplo de ``uso / funcionamento`` na imagem abaixo:

![secondDef](https://i.postimg.cc/c4SdbVBC/demo-desk-second-Def.gif)

<span id="demo-desk-thirdDef"></span>
<br />

### 2.9. Exibir Nível 3 <a href="#top">🔝</a>
- Ative / Desative a exibição do Terceiro Nível na versão Desktop, exemplo de ``uso / funcionamento`` na imagem abaixo:

![thirdDef](https://i.postimg.cc/QCrZvT5w/demo-desk-third-Def.gif)

<span id="demo-desk-secondMaxItems"></span>
<br />

### 2.10. Máximo de items no Nível 2 <a href="#top">🔝</a>
- Defina o numero máximo de items que serão exibidos no Segundo Nível na versão Desktop, exemplo de ``uso / funcionamento`` na imagem abaixo:

![secondMaxItems](https://i.postimg.cc/BZx0Hmf0/demo-desk-second-Max-Items.gif)

<span id="demo-desk-thirdMaxItems"></span>
<br />

### 2.11. Máximo de items no Nível 3 <a href="#top">🔝</a>
- Defina o numero máximo de items que serão exibidos no Terceiro Nível na versão Desktop, exemplo de ``uso / funcionamento`` na imagem abaixo:

![thirdMaxItems](https://i.postimg.cc/0yN1gxMk/demo-desk-third-Max-Items.gif)

---

<span id="demo3"></span>
<br />

## 3. AvantiMenu - Configurações _(Mobile)_ <a href="#top">🔝</a>

---

<span id="demo-mob-config"></span>
<br />

### 3.0. Configurações <a href="#top">🔝</a>
- Ambiente para configurações do em dispositivos Mobile, veja a interface na imagem abaixo.

![config](https://i.postimg.cc/DzDmMvKP/configs-mobile.png)

<span id="demo-mob-type"></span>
<br />

### 3.1. Estilo de Menu (Opção exclusiva para Desenvolvedores) <a href="#top">🔝</a>
- Opção para o Desenvolvedor escolher a opção de menu mais semelhante ao menu do cliente para facilitar em seu desenvolvimento, exemplo de funcionamento na imagem abaixo.

![style](https://i.postimg.cc/vBGtDZCt/1-demo-mob-menutype.gif)

<span id="demo-mob-burguericon"></span>
<br />

### 3.2. Menu Hamburguer (Abrir menu) <a href="#top">🔝</a>
- Campo para inserir o icone hamburguer do menu, exemplo de ``uso / funcionamento`` na imagem abaixo:

![burguericon](https://i.postimg.cc/MKnbn43N/2-demo-mob-burguericon.gif)

<span id="demo-mob-title"></span>
<br />

### 3.3. Título do menu <a href="#top">🔝</a>
- Campo para editar o texto do Título 'Menu', exemplo de ``uso / funcionamento`` na imagem abaixo:

![title](https://i.postimg.cc/BQ2B0zY0/3-demo-mob-title.gif)

<span id="demo-mob-close"></span>
<br />

### 3.4. Menu Close (Fechar menu) <a href="#top">🔝</a>
- Campo para inserir o icone do botão 'Fechar menu', exemplo de ``uso / funcionamento`` na imagem abaixo:

![close](https://i.postimg.cc/TP5Pzz0j/4-demo-mob-closeicon.gif)

<span id="demo-mob-linksh"></span>
<br />

### 3.5. Links personalizados (Menu Header) <a href="#top">🔝</a>
- Campo para inserir links personalizados no Header do Menu, exemplo de ``uso / funcionamento`` na imagem abaixo:

![linksh](https://i.postimg.cc/ZntjPz7w/5-demo-mob-linksh.gif)

<span id="demo-mob-logout"></span>
<br />

### 3.6. Exibir botão de Logout / Texto do botão de Logout <a href="#top">🔝</a>
- Campo para ativar/desativar e alterar o texto do botão de Logout no Título do Header, exemplo de ``uso / funcionamento`` na imagem abaixo:
    - ``**Obs:** o botão só aparecerá quando o usuário estiver logado.``

![logout](https://i.postimg.cc/4N1wcMz1/6-demo-mob-logout.gif)

<span id="demo-mob-linksf"></span>
<br />

### 3.7. Links personalizados (Menu Footer) <a href="#top">🔝</a>
- Campo para inserir links personalizados no Footer do Menu, exemplo de ``uso / funcionamento`` na imagem abaixo:

![linksf](https://i.postimg.cc/7LjNDykq/7-demo-mob-linksf.gif)

<span id="demo-mob-back"></span>
<br />

### 3.8. Texto do botão 'Voltar' <a href="#top">🔝</a>
- Campo para editar o texto do botão 'Voltar', exemplo de ``uso / funcionamento`` na imagem abaixo:

![back](https://i.postimg.cc/1RrD7Ffm/8-demo-mob-back.gif)

<span id="demo-mob-seeall"></span>
<br />

### 3.9. Texto do botão 'Ver Tudo' <a href="#top">🔝</a>
- Campo para editar o texto do botão 'Ver Tudo', exemplo de ``uso / funcionamento`` na imagem abaixo:

![seeall](https://i.postimg.cc/bN6kpjx4/9-demo-mob-seeall.gif)

<span id="demo-mob-secondDef"></span>
<br />

### 3.10. Exibir Nível 2 <a href="#top">🔝</a>
- Ative / Desative a exibição do Segundo Nível na versão Mobile, exemplo de ``uso / funcionamento`` na imagem abaixo:

![secondDef](https://i.postimg.cc/d1s0pgYG/10-demo-mob-second-Def.gif)

<span id="demo-mob-thirdDef"></span>
<br />

### 3.11. Exibir Nível 3 <a href="#top">🔝</a>
- Ative / Desative a exibição do Terceiro Nível na versão Mobile, exemplo de ``uso / funcionamento`` na imagem abaixo:

![thirdDef](https://i.postimg.cc/kX6g0xkY/11-demo-mob-third-Def.gif)

<span id="demo-mob-secondMaxItems"></span>
<br />

### 3.12. Máximo de items no Nível 2 <a href="#top">🔝</a>
- Defina o numero máximo de items que serão exibidos no Segundo Nível na versão Mobile, exemplo de ``uso / funcionamento`` na imagem abaixo:

![secondMaxItems](https://i.postimg.cc/cJmxRTnC/12-demo-mob-second-Max-Items.gif)

<span id="demo-mob-thirdMaxItems"></span>
<br />

### 3.13. Máximo de items no Nível 3 <a href="#top">🔝</a>
- Defina o numero máximo de items que serão exibidos no Terceiro Nível na versão Mobile, exemplo de ``uso / funcionamento`` na imagem abaixo:

![thirdMaxItems](https://i.postimg.cc/x1VnBBGq/13-demo-mob-third-Max-Items.gif)


<br /><br />

----
# Desenvolvedor
----

<span id="install"></span>

<br />

## Instalação: <a href="#top">🔝</a>

- Fork este repositório do menu, efetue as alterações a seguir e logo após copie para seu projeto.
    - Obs: ``seuprojeto`` = vendor da sua loja.

<span id="install1"></span>
<br />

### 1. Raiz do repositório do menu <a href="#top">🔝</a>
- avanti-menu (Diretório com o app)
- store-theme (Diretório com os arquivos necessários para o funcionamento do app )

<span id="install2"></span>
<br />

### 2. Abra o repositório do menu em seu VSCODE <a href="#top">🔝</a>

![vendor](https://i.postimg.cc/XNPyPK4W/vendor.png)

- 1 - Clique na lupa
- 2 - Adicione a vendor ``lfmaquinaseferramentas`` de desenvolvimento
- 3 - Adicione a vendor do seu projeto no lugar do texto ``seuprojeto`` na imagem acima
- 4 - Clique no botão para efetuar as alterações.

<span id="install3"></span>
<br />

### 3. Nos arquivos da store-theme do repositório do menu: <a href="#top">🔝</a>
![vendor](https://i.postimg.cc/qMRRtFs2/temas.gif)

- Acesse o diretório com os arquivos dos themas e altere a vendor ``lfmaquinaseferramentas`` para a vendor de seu projeto

<span id="install4"></span>
<br />

### 4. Na store-theme do seu projeto: <a href="#top">🔝</a>
- Acesse a store-theme de seu projeto e verifique se existe o arquivo ``interfaces.json`` no diretório ``store``.

- Caso não exista, pule para o Passo 5, caso exista, copie o seguinte conteúdo dentro do ``store/interfaces.json`` na store-theme de seu projeto.

```json
  "header.full": {
    "around": ["avanti-menu-context"]
  }
```
- Apague o arquivo ``interfaces`` no repositório do menu para não sobrescrever o arquivo do seu projeto no passo a seguir.

<span id="install5"></span>
<br />

### 5. Copiando os arquivos para o repositório de seu projeto: <a href="#top">🔝</a>
- Copie os diretórios do repositório do menu para seu projeto.

<span id="install6"></span>
<br />

### 6. No arquivo ``manifest.json`` da store-theme do seu projeto: <a href="#top">🔝</a>
![vendor](https://i.postimg.cc/FzM23QhK/manifest.gif)

- Adicione o app ``"seuprojeto.avanti-menu": "0.x"`` nas dependencies do ``manifest.json`` em seu projeto.

```json
"dependencies": {
  "seuprojeto.avanti-menu": "0.x"
}
```

<span id="install7"></span>
<br />

### 7. Adicionando os blocos no ``header.jsonc`` na sua store-theme. <a href="#top">🔝</a>
- Acesse o ``header.jsonc`` na sua store-theme e adicione os respectivos blocos:
    - ``"avanti-menu-desktop"`` - para o layout desktop
    - ``"avanti-menu-mobile"`` - para o layout mobile

<span id="install8"></span>
<br />

### 8. Subindo o app. <a href="#top">🔝</a>
- Acesse o diretório do ``avanti-menu`` e execute o ``vtex link``
- Acesse o diretório da sua ``store-theme`` e execute o ``vtex link``

### **_Pronto, Menu instalado com sucesso! :)_**
<br /><br />

----

<span id="handles"></span>

<br />

## CSS HANDLES <a href="#top">🔝</a>
- Handles de css disponíveis para customização pelo ecossistema da store-theme.

| CSS Handles Desktop                  | CSS Handles Mobile                |
| ------------------------------------ | --------------------------------- |
|  `desktop-navbar`                    |  `mobile-hamburguer`              |
|  `desktop-navbarContainer`           |  `mobile-hamburguerImage`         |
|  `desktop-menuItemsWrapper`          |  `mobile-overlay`                 |
|  `desktop-menuItemsTitleLink`        |  `mobile-menuItemsTitleLink`      |
|  `desktop-menuItemsTitle`            |  `mobile-container`               |
|  `desktop-menuItems`                 |  `mobile-content`                 |
|  `desktop-menuItem`                  |  `mobile-headerContainer`         |
|  `desktop-menuSeeAllButton`          |  `mobile-titleContainer`          |
|  `desktop-menuItemHasChildren`       |  `mobile-itemsContainer`          |
|  `desktop-menuItemLink`              |  `mobile-itemsContent`            |
|  `desktop-menuItemLinkText`          |  `mobile-titleContent`            |
|  `desktop-menuSecondItemsWrapper`    |  `mobile-title`                   |
|  `desktop-menuSecondItemsContainer`  |  `mobile-buttonsContainer`        |
|  `desktop-menuSecondItems`           |  `mobile-logoutButton`            |
|  `desktop-menuSecondItem`            |  `mobile-closeButton`             |
|  `desktop-menuSecondItemHasChildren` |  `mobile-closeButtonImage`        |
|  `desktop-menuSecondItemLink`        |  `mobile-item`                    |
|  `desktop-menuThirdItemsWrapper`     |  `mobile-item--Opened`            |
|  `desktop-menuThirdItems`            |  `mobile-itemLink`                |
|  `desktop-menuThirdItem`             |  `mobile-itemIcon`                |
|  `desktop-menuThirdItemLink`         |  `mobile-itemTextContent`         |
|  `desktop-departmentsItems`          |  `mobile-itemText`                |
|  `desktop-departmentsItem`           |  `mobile-subItems`                |
|  `desktop-departmentsItemLink`       |  `mobile-subItemsContent`         |
|  `desktop-departmentsItemsContent`   |  `mobile-subItem`                 |
|  `desktop-arrowIconContent`          |  `mobile-subItemLink`             |
|  `desktop-arrowIcon`                 |  `mobile-subItemIcon`             |
|  `desktop-menuIcon`                  |  `mobile-subItemText`             |
|  `desktop-departmentsIcon`           |  `mobile-menuContainer`           |
|  `desktop-bannerContent`             |  `mobile-menuItemsWrapper`        |
|  `desktop-bannerImage`               |  `mobile-menuItems`               |
|  `desktop-menuItemsTitleLink`        |  `mobile-menuItemsTitleLink`      |
|  `desktop-menuIconContent`           |  `mobile-menuItemsTitle`          |
|  `desktop-menuSecondItemLinkText`    |  `mobile-menuItemsTitleContent`   |
|  `desktop-menuThirdItemLinkText`     |  `mobile-menuItem`                |
|  `desktop-bannerLink`                |  `mobile-menuItem--Opened`        |
|                                      |  `mobile-menuItemLink`            |
|                                      |  `mobile-menuSecondItemsWrapper`  |
|                                      |  `mobile-menuSecondItems`         |
|                                      |  `mobile-menuSecondItem`          |
|                                      |  `mobile-menuSecondItem--Opened`  |
|                                      |  `mobile-menuSecondItemLink`      |
|                                      |  `mobile-menuThirdItemsWrapper`   |
|                                      |  `mobile-menuThirdItems`          |
|                                      |  `mobile-menuThirdItem`           |
|                                      |  `mobile-menuThirdItem--Opened`   |
|                                      |  `mobile-menuThirdItemLink`       |
|                                      |  `mobile-menuArrowIconContent`    |
|                                      |  `mobile-menuArrowIcon`           |
|                                      |  `mobile-menuBackButton`          |
|                                      |  `mobile-menuSeeAllButton`        |
|                                      |  `mobile-footerContainer`         |
|                                      |  `mobile-menuIconContent`         |
|                                      |  `mobile-menuIcon`                |
|                                      |  `mobile-menuSecondItemLinkText`  |
|                                      |  `mobile-menuThirdItemLinkText`   |

- **OBS:** Cada item de menu possui Handles personalizadas para sua melhor estilização:
    - O `nome` do item cadastrado será aplicado como um modificador, exemplo: desktop-menuItem**--medicamentos**
    - Se o item possui filhos (childrens), é aplicado o modificador `--hasChildren`, exemplo: desktop-menuItem**--hasChildren**
    - Na interação do **map((item, index) => ...)** no Primeiro nível, é aplicado um modificador em cada `<li>` de acordo com o seu índice `--child-${index}`, exemplos: desktop-menuItem--child-**1**, desktop-menuItem--child-**2** ...

<br /><br />

----

<span id="props"></span>

<br />

# Propriedades do Contexto <a href="#top">🔝</a>

- O Menu possui 3 hooks de uso de contexto para prover os dados para todo o app de forma simples e dinamica.

<span id="props1"></span>
<br />

## 1 - useAvantiMenu() - _contexto com as propriedades de cadastro dos itens do menu via Site Editor e requisição dos itens das Categorias_ <a href="#top">🔝</a>

![useAvantiMenu](https://i.postimg.cc/FHJ0LNqc/use-Avanti-Menu.gif)

### 1.1 - items

| Nome da Prop        | Tipo                | Descrição                                                                                                         | Valor padrão |
| ------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------ |
| `__editorItemTitle` | `string`            | Nome do Item que será exibido no menu de primeiro nível                                                           | `item`       |
| `type`              | `string`            | Controle para selecionar o tipo do item entre "custom" ou "category".                                             | `custom`     |
| `mobile`            | `boolean`           | Controle para ativar/desativar a exibição do Item em dispositivos Mobile.                                         | `true`       |
| `desktop`           | `boolean`           | Controle para ativar/desativar a exibição do Item em dispositivos Desktop.                                        | `true`       |
| `departmentBar`     | `boolean`           | Controle para ativar/desativar a exibição do Item no menu de Departamentos.                                       | `true`       |
| `menuBar`           | `boolean`           | Controle para ativar/desativar a exibição do Item na barra principal do Menu.                                     | `false`      |
| `menuBarIcon`       | `string` ou `null`  | Campo para upload de Icone para o item na barra de menu.                                                          | `""`         |
| `onMouseHover`      | `boolean`           | Controle para ativar/desativar a exibição do Submenu na barra principal ao passar o mouse no nome do menu.        | `true`       |
| `highlight`         | `boolean`           | Controle para ativar/desativar a adição de uma  handle classe ``--highlight`` no item do menu.                    | `true`       |
| `seeAll`            | `boolean`           | Controle para ativar/desativar a exibição do botão ``"Ver Tudo"`` no submenu.                                     | `true`       |
| `target`            | `boolean`           | Controle para ativar/desativar a adição do ``target="_blank"`` na tag do link.                                    | `false`      |
| `url`               | `string`            | Campo onde será definido o link interno ou externo do item.                                                       | `""`         |
| `tagTitle`          | `string`            | Campo para acrescentar um Título personalizado ao Link.                                                           | `""`         |
| `banner`            | `string` ou `null`  | Campo para upload de banner para menu em dispositivos Desktop.                                                    | `""`         |
| `categoryId`        | `number`            | Campo para inserir o ID da Categoria, disponível apenas para o type: category.                                    | `""`         |
| `hasName`           | `boolean`           | Controle para ativar/desativar a exibição do nome da categoria, disponível apenas para o type: category           | `false`      |
| `items`             | `array[]`           | Array de objetos para acesso ao próximo nível, confira os tipos no arquivo ``types.d.ts`` para mais detalhes.     | `[]`         |


### 1.2 - categories

| Nome da Prop        | Tipo                | Descrição                                                                                                         | Valor padrão |
| ------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------ |
| `id`                | `number`            | Identificador da categoria.                                                                                       |              |
| `name`              | `string`            | Nome do Item de Categoria.                                                                                        |              |
| `hasChildren`       | `boolean`           | Controle que informa se o item possui ``children``.                                                               | `false`      |
| `url`               | `string`            | Link do item.                                                                                                     |              |
| `title`             | `string`            | Campo para acrescentar um Título personalizado ao Link.                                                           |              |
| `children`          | `array[]`           | Array de objetos para acesso ao próximo nível, confira os tipos no arquivo ``types.d.ts`` para mais detalhes.     | `[]`         |

<span id="props2"></span>
<br />

## 2 - useAvantiMenuDesktop() - _contexto com as propriedades de configurações do menu para dispositivos Desktop_ <a href="#top">🔝</a>

![useAvantiMenu](https://i.postimg.cc/L8MjLrMb/use-Avanti-Menu-Desktop.gif)

### 2.1 - props

| Nome da Prop        | Tipo                       | Descrição                                                                                                         | Valor padrão    |
| ------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------- |
| `menuType`          | `string`                   | Controle para escolher uma opção de tema padrão do app para dispositivos desktop.                                 | `theme1`        |
| `departmentDef`     | `boolean`                  | Controle para ativar/desativar a exibição da barra de departamentos.                                              | `true`          |
| `banners`           | `boolean`                  | Controle para ativar/desativar a exibição de todos os banners em dispositivos Desktop.                            | `true`          |
| `seeAllButton`      | `string`                   | Campo para alterar o texto do botão "Ver Tudo" em todos os níveis do menu em dispositivos Desktop.                | `Ver Tudo`      |
| `department`        | `string`                   | Campo para alterar o texto da barra de departamentos em dispositivos Desktop.                                     | `Departamentos` |
| `departmentIcon`    | `string` ou `null`         | Campo para upload de Icone da barra de Departamentos.                                                             | `""`            |
| `bannerSize`        | `{ width/height: string }` | Campo para definir a largura / altura máxima de todos os banners do menu.                                         | `274`           |

<span id="props3"></span>
<br />

## 3 - useAvantiMenuMobile() - _contexto com as propriedades de configurações do menu para dispositivos Mobile_ <a href="#top">🔝</a>

![useAvantiMenu](https://i.postimg.cc/MTxZz2g1/use-Avanti-Menu-Mobile.gif)

### 3.1 - props

| Nome da Prop        | Tipo                       | Descrição                                                                                                         | Valor padrão    |
| ------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------- |
| `menuType`          | `string`                   | Controle para escolher uma opção de tema padrão do app para dispositivos Mobile.                                  | `theme1`        |
| `seeAllButton`      | `string`                   | Campo para alterar o texto do botão "Ver Tudo" em todos os níveis do menu em dispositivos Desktop.                | `Ver Tudo`      |
| `backButton`        | `string`                   | Campo para alterar o texto do botão "Voltar", botão disponível no tema 3.                                         | `Voltar`        |
| `burguerIcon`       | `string` ou `null`         | Campo para upload de Icone do menu mobile.                                                                        |                 |
| `header`            | `{ 3.2 header }`           | Campo para definir as configurações do ``header`` do menu Mobile, confira o arquivo de tipos para mais detalhes.  |                 |
| `footer`            | `{ items: array[] }`       | Array de objetos para os items do footer, confira os tipos no arquivo types.d.ts para mais detalhes.              |                 |

### 3.2 - header

| Nome da Prop        | Tipo                       | Descrição                                                                                                         | Valor padrão       |
| ------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------ |
| `closeIcon`         | `string` ou `null`         | Campo para upload de Icone da barra de Departamentos.                                                             |                    |
| `logoutDef`         | `boolean`                  | Controle para ativar/desativar a exibição do botão de logout no título do header.                                 | `false`            |
| `logoutLabel`       | `string`                   | Campo para alterar o texto do botão de logout no título do header.                                                | `Não é você? Sair` |
| `title`             | `string`                   | Campo para alterar o texto do título do Menu Mobile.                                                              | `Menu`             |
| `items`             | `array[]`                  | Array de objetos para os items do header, confira os tipos no arquivo ``types.d.ts`` para mais detalhes.          |                    |

### 3.3 - open e setOpen (useState)

| Nome da Prop        | Tipo                       | Descrição                                                                                                         | Valor padrão    |
| ------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------- |
| `open & setOpen`    | `boolean`                  | Estado para abrir/fechar o menu Mobile.                                                                           | `false`         |

<br /><br />

----

<span id="tree"></span>

<br />

## Arvore de diretórios / arquivos <a href="#top">🔝</a>

```
avanti-menu
│
├── messages
│   ├── context.json
│   ├── en.json
│   ├── es.json
│   └── pt.json
├── react
│   ├── components
│   │   ├── Desktop
│   │   │   ├── CSS_HANDLES
│   │   │   │   └── index.ts
│   │   │   ├── MenuBar
│   │   │   │   ├── AllDepartments
│   │   │   │   │   ├── AllDepartments.tsx
│   │   │   │   │   ├── DepartmentsIcon.tsx
│   │   │   │   │   └── DepartmentsItems.tsx
│   │   │   │   ├── Banner
│   │   │   │   │   └── Banner.tsx
│   │   │   │   ├── Category
│   │   │   │   │   ├── FirstLevelCategory.tsx
│   │   │   │   │   ├── SecondLevelCategory.tsx
│   │   │   │   │   └── ThirdLevelCategory.tsx
│   │   │   │   ├── Custom
│   │   │   │   │   ├── FirstLevelCustom.tsx
│   │   │   │   │   ├── SecondLevelCustom.tsx
│   │   │   │   │   └── ThirdLevelCustom.tsx
│   │   │   │   ├── ArrowIcon.tsx
│   │   │   │   ├── ItemsTitle.tsx
│   │   │   │   ├── MenuBarIcon.tsx
│   │   │   │   ├── MenuBarItems.tsx
│   │   │   │   └── SeeAllButton.tsx
│   │   │   ├── ChangeTheme.tsx
│   │   │   └── MenuDesktop.tsx
│   │   ├── Mobile
│   │   │   ├── CSS_HANDLES
│   │   │   │   └── index.ts
│   │   │   ├── Footer
│   │   │   │   ├── Items
│   │   │   │   │   ├── Items.tsx
│   │   │   │   │   └── ItemsContainer.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── FooterContainer.tsx
│   │   │   ├── Header
│   │   │   │   ├── Items
│   │   │   │   │   ├── CustomItem.tsx
│   │   │   │   │   ├── Items.tsx
│   │   │   │   │   ├── ItemsContainer.tsx
│   │   │   │   │   ├── LoginItem.tsx
│   │   │   │   │   └── SubItems.tsx
│   │   │   │   ├── Title
│   │   │   │   │   ├── ButtonsContainer.tsx
│   │   │   │   │   ├── CloseButton.tsx
│   │   │   │   │   ├── LogoutButton.tsx
│   │   │   │   │   ├── Title.tsx
│   │   │   │   │   └── TitleContainer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── HeaderContainer.tsx
│   │   │   ├── Menu
│   │   │   │   ├── Category
│   │   │   │   │   ├── FirstLevelCategory.tsx
│   │   │   │   │   ├── SecondLevelCategory.tsx
│   │   │   │   │   └── ThirdLevelCategory.tsx
│   │   │   │   ├── Custom
│   │   │   │   │   ├── FirstLevelCustom.tsx
│   │   │   │   │   ├── SecondLevelCustom.tsx
│   │   │   │   │   └── ThirdLevelCustom.tsx
│   │   │   │   ├── BackButton.tsx
│   │   │   │   ├── ItemsTitle.tsx
│   │   │   │   ├── ItemsTitleContent.tsx
│   │   │   │   ├── Menu.tsx
│   │   │   │   ├── MenuItems.tsx
│   │   │   │   ├── MenuItemsContainer.tsx
│   │   │   │   └── SeeAllButton.tsx
│   │   │   ├── ArrowIcon.tsx
│   │   │   ├── ChangeTheme.tsx
│   │   │   ├── Container.tsx
│   │   │   ├── Hamburguer.tsx
│   │   │   ├── MenuMobile.tsx
│   │   │   └── Overlay.tsx
│   │   └── Utils
│   │       ├── backClick.ts
│   │       ├── FormatString.ts
│   │       └── toggleClick.ts
│   ├── context
│   │   └── AvantiMenuContext
│   │       └── index.tsx
│   ├── messages
│   │   └── index.ts
│   ├── typings
│   │   ├── types.d.ts
│   │   └── vtex.session-client.d.ts
│   ├── AvantiMenuContext.tsx
│   ├── AvantiMenuDesktop.tsx
│   └── AvantiMenuMobile.tsx
└── store
    ├── contentSchemas.json
    └── interfaces.json
```
<br />
```
store-theme
│
├── assets
│   └── menu
│       ├── burguer-icon.svg
│       ├── close-icon.svg
│       ├── star-icon.svg
│       └── user-icon-v2.svg              
├── store
│   ├── interfaces.json
│   └── blocks
│       └── header
│           └── components
│               └── avanti-menu.jsonc
└── styles
    └── css
        └── menu
            ├── desktop
            │   ├── theme1
            │   │   └── lfmaquinaseferramentas.avanti-menu.css
            │   ├── theme2
            │   │   └── lfmaquinaseferramentas.avanti-menu.css
            │   ├── theme3
            │   │   └── lfmaquinaseferramentas.avanti-menu.css
            │   ├── theme4
            │   │   └── lfmaquinaseferramentas.avanti-menu.css
            │   └── theme5
            │       └── lfmaquinaseferramentas.avanti-menu.css
            └── mobile
                ├── theme1
                │   └── lfmaquinaseferramentas.avanti-menu.css
                ├── theme2
                │   └── lfmaquinaseferramentas.avanti-menu.css
                ├── theme3
                │   └── lfmaquinaseferramentas.avanti-menu.css
                ├── theme4
                │   └── lfmaquinaseferramentas.avanti-menu.css
                └── theme5
                    └── lfmaquinaseferramentas.avanti-menu.css
```
<br /><br />

----

<span id="infos"></span>

<br />

### Considerações Finais: <a href="#top">🔝</a>

_Fique a vontade para fazer melhorias que julgar necessário, considere também abrir um pull request, para ajudar a melhorar o menu._
