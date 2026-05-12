# Add To Cart Button Custom

The `add-to-cart-button-custom` is a block responsible for adding products in the [Minicart](https://vtex.io/docs/components/all/vtex.minicart/)(`minicart.v2`)

<p dir="auto"><img src="https://lfmaquinaseferramentas.vteximg.com.br/arquivos/addtocart.jpg" alt="image" style="max-width: 100%;"></p>

## Configuration

1. Import the `{vendor}.custom-apps` app to your theme's dependencies in the manifest.json, for example:

```
"dependencies": {
    "{vendor}.custom-apps"
  }
```

2. Add the `add-to-cart-button-custom` to other theme block using the product context, such as the `product-summary.shelf`. In the example below, the `add-to-cart-button-custom` is added to the `flex-layout.row` block from the `store.product` template (which uses the product context):
 
```
"store.product": {
    "children": [
      "flex-layout.row#product"
    ]
  },
  "flex-layout.row#product": {
    "children": [
      "add-to-cart-button-custom"
    ]
  }
```

  Prop name | Type | Description | Default value
------------- | ------------- | ------------- | -------------
`showUnit` | **boolean** | Defines whether the measurement unit should be displayed (true) or not (false) | **false**

CSS Handles |
------------- |
`adtc-container-stepper` |
`adtc-button-decrement` |
`adtc-button-increment` |
`adtc-button-quantity` |
`adtc-span-unit` |
`adtc-button-add-to-cart` |
`adtc-button-text-add` |
