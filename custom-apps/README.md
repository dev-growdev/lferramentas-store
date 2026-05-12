Clone o custom apps e cole no repositório da loja, não esqueça de chama-lo no manifest da store-theme

```
"lfmaquinaseferramentas.custom-apps": "0.x"
```

<h2>
  📋 Barra de Frete (Minicart)
</h2>

<p> 
  De inicío a barra não irá aparecer, pois provavelmente a loja não terá uma lista de CEPS cadastrado no GTM.
  Caso você esteja pegando esta task no início do projeto, você deve solicitar o acesso ao GP e alinhar com o Teclider,
  se está tudo bem em subir o script com a lista de CEPs.
</p>

<p> 
Caso ocorra tudo bem, você poderá subir a lista de CEP. Segue um exemplo do script de lista de CEP:

```md
<script>  
  
  var zipCodeList = [
    {
      zipCodeInitial: '23800000',
      zipCodeEnd: '28999999',
      freeShippingValue: 14990
    },
    {
      zipCodeInitial: '90000000',
      zipCodeEnd: '99999999',
      freeShippingValue: 14990
    },
    {
      zipCodeInitial: '88000000',
      zipCodeEnd: '89999999',
      freeShippingValue: 14990
    }
  ]
</script>
```

<br/>

Além disso, segue um tutorial das configurações necessárias para o GTM funcionar na store-theame, <a      
  href="https://drive.google.com/file/d/1t7hyWLkbX6c_gyIQp8PfF5Ckh_fHhCLn/view" target="_blank" > ver tutorial </a>
<br/>
<strong>OBS: em alguns casos, você irá passar este o script com CEPs para o GP ou para o Avanti Pro </strong>

</p>

<p> 
  Caso, não seja possível subir o script de CEP no GTM, você ir desenvolvendo a task de maneira local, siga os passos abaiso:
  Primeiro va para o arquivo que está neste caminho:
</p>

```md
custom-apps/reactreact/components/MinicartFreeShippingBar/Shipping/Shipping.tsx
```

<p> 
  faça a seguinte alteração \n
  <a href="https://prnt.sc/PudcHmjXcjmq" target="_blank" > ver imagem </a>

Após a lista de CEPs ser colocada no GTM apague a linha 31 e descomente a linha 30

</p>

<p> 
  Após isto, vá para o caminho
</p>

```md
custom-apps/react/components/MinicartFreeShippingBar/FreeShippingBar.tsx
```

<p>
  e faça a segtuinte alteração: 
  <a href="https://prnt.sc/AAjk7sp-bdmg" target="_blank" > ver imagem </a>

Após a lista de CEPs ser colocada no GTM apague a linha 51 e troque o código da linha 50 para este

```md
setExistZipCodeList(false)
```

</p>
