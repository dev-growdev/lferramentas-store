import { IData } from '../typings';

export const verifyData = (data: IData) => {
  if (data.length != '' && data.width != '' || data.totalWidthLength != '') return true;
  else return false;
};

export const handleResultCalc = (data: IData) => {
  if (verifyData(data)) {
    let calcFloorFinalResult = data.totalWidthLength ? Number(data.totalWidthLength) : Number(data.length) * Number(data.width);
    if (data.option.fifteen) {
      calcFloorFinalResult += (15 / 100) * calcFloorFinalResult
    }
    if (data.option.ten) {
      calcFloorFinalResult += (10 / 100) * calcFloorFinalResult
    }
    return calcFloorFinalResult;
  } else {
    return -1;
  }
};

export type Option = ItemOption;

type InputValue = Record<string, string | boolean>;

type GroupTypes = 'SINGLE' | 'TOGGLE' | 'MULTIPLE';

interface AddedItem {
  id: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  sellingPriceWithAssemblies: number;
  assemblyOptions?: ParsedAssemblyOptionsMeta;
}

export interface ItemOption {
  assemblyId: string;
  id?: string;
  quantity?: number;
  seller?: string;
  options?: Option[];
  inputValues?: InputValue;
}

interface CartAddedOption {
  normalizedQuantity: number;
  extraQuantity: number;
  choiceType: GroupTypes;
  item: AddedItem;
}

interface CartRemovedOption {
  name: string;
  initialQuantity: number;
  removedQuantity: number;
}

export interface ParsedAssemblyOptionsMeta {
  added: CartAddedOption[];
  removed: CartRemovedOption[];
  parentPrice: number;
}

export interface CartItem {
  detailUrl: string;
  id: string;
  ean: string;
  imageUrl: string;
  index?: number;
  listPrice: number;
  measurementUnit: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
  seller: string;
  sellerName: string;
  sellingPrice: number;
  productRefId: string;
  brand: string;
  variant: string;
  category: string;
  skuName: string;
  skuSpecifications: SKUSpecification[];
  uniqueId: string;
  sellingPriceWithAssemblies: number;
  options: Option[];
  assemblyOptions: ParsedAssemblyOptionsMeta;
  referenceId: Array<{
    Key: string;
    Value: string;
  }> | null;
}

export const mapSkuItemForPixelEvent = (skuItem: CartItem) => {
  // Changes this `/Apparel & Accessories/Clothing/Tops/`
  // to this `Apparel & Accessories/Clothing/Tops`
  const category = skuItem.category ? skuItem.category.slice(1, -1) : '';

  return {
    skuId: skuItem.id,
    ean: skuItem.ean,
    variant: skuItem.variant,
    price: skuItem.price,
    sellingPrice: skuItem.sellingPrice,
    priceIsInt: true,
    name: skuItem.name,
    quantity: skuItem.quantity,
    productId: skuItem.productId,
    productRefId: skuItem.productRefId,
    brand: skuItem.brand,
    category,
    detailUrl: skuItem.detailUrl,
    imageUrl: skuItem.imageUrl,
    referenceId: skuItem?.referenceId?.[0]?.Value,
    seller: skuItem.seller,
    sellerName: skuItem.sellerName,
  };
};
