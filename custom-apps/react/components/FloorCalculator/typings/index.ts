export type IModal = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: IData;
  setData: React.Dispatch<React.SetStateAction<IData>>;
  header?: string;
};

export interface IHeader {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export type IData = {
  length: string;
  width: string;
  totalWidthLength: string;
  option: {
    ten: boolean,
    fifteen: boolean
  }
  unitMultiplier: number;
  calcResult: number;
};

export interface IFooter {
  data: IData;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<IData>>;
}

export interface ProductLink {
  linkText?: string
  productId?: string
}


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

export interface IAddToCart {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  multipleAvailableSKUs: boolean
  customToastUrl?: string
  customOneClickBuyLink?: string
  skuItems: CartItem[]
  showToast: Function
  allSkuVariationsSelected: boolean
  text?: string
  unavailableText?: string
  productLink: ProductLink
  onClickBehavior: 'add-to-cart' | 'go-to-product-page' | 'ensure-sku-selection'
  customPixelEventId?: string
  addToCartFeedback?: 'customEvent' | 'toast'
  onClickEventPropagation: 'disabled' | 'enabled'
  isLoading?: boolean
}
