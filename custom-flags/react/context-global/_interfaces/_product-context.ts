export interface SellingPrice {
	highPrice: number
	lowPrice: number
	__typename: string
}

export interface ListPrice {
	highPrice: number
	lowPrice: number
	__typename: string
}

export interface PriceRange {
	sellingPrice: SellingPrice
	listPrice: ListPrice
	__typename: string
}

export interface Specification {
	name: string
	originalName: string
	values: string[]
	__typename: string
}

export interface SpecificationGroup {
	name: string
	originalName: string
	specifications: Specification[]
	__typename: string
}

export interface Field {
	name: string
	originalName: string
	__typename: string
}

export interface Value {
	name: string
	originalName: string
	__typename: string
}

export interface SkuSpecification {
	field: Field
	values: Value[]
	__typename: string
}

export interface ProductCluster {
	id: string
	name: string
	__typename: string
}

export interface ClusterHighlight {
	id: string
	name: string
	__typename: string
}

export interface Property {
	name: string
	values: string[]
	__typename: string
}

export interface Variation {
	name: string
	values: string[]
	__typename: string
}

export interface ReferenceId {
	Key: string
	Value: string
	__typename: string
}

export interface Image {
	cacheId: string
	imageId: string
	imageLabel: string
	imageTag: string
	imageUrl: string
	imageText: string
	__typename: string
}

export interface DiscountHighlight {
	name: string
	__typename: string
}

export interface Installment {
	Value: number
	InterestRate: number
	TotalValuePlusInterestRate: number
	NumberOfInstallments: number
	Name: string
	PaymentSystemName: string
	__typename: string
}

export interface CommertialOffer {
	discountHighlights: DiscountHighlight[]
	teasers: any[]
	Price: number
	ListPrice: number
	Tax: number
	taxPercentage: number
	spotPrice: number
	PriceWithoutDiscount: number
	RewardValue: number
	PriceValidUntil: Date
	AvailableQuantity: number
	__typename: string
	Installments: Installment[]
}

export interface Seller {
	sellerId: string
	sellerName: string
	sellerDefault: boolean
	__typename: string
	commertialOffer: CommertialOffer
}

export interface Item {
	itemId: string
	name: string
	nameComplete: string
	complementName: string
	ean: string
	variations: Variation[]
	referenceId: ReferenceId[]
	measurementUnit: string
	unitMultiplier: number
	images: Image[]
	__typename: string
	sellers: Seller[]
}

export interface Variation2 {
	name: string
	values: string[]
	__typename: string
}

export interface ReferenceId2 {
	Key: string
	Value: string
	__typename: string
}

export interface Image2 {
	cacheId: string
	imageId: string
	imageLabel: string
	imageTag: string
	imageUrl: string
	imageText: string
	__typename: string
}

export interface DiscountHighlight2 {
	name: string
	__typename: string
}

export interface Installment2 {
	Value: number
	InterestRate: number
	TotalValuePlusInterestRate: number
	NumberOfInstallments: number
	Name: string
	PaymentSystemName: string
	__typename: string
}

export interface CommertialOffer2 {
	discountHighlights: DiscountHighlight2[]
	teasers: any[]
	Price: number
	ListPrice: number
	Tax: number
	taxPercentage: number
	spotPrice: number
	PriceWithoutDiscount: number
	RewardValue: number
	PriceValidUntil: Date
	AvailableQuantity: number
	__typename: string
	Installments: Installment2[]
}

export interface Seller2 {
	sellerId: string
	sellerName: string
	sellerDefault: boolean
	__typename: string
	commertialOffer: CommertialOffer2
}

export interface DiscountHighlight3 {
	name: string
	__typename: string
}

export interface Installment3 {
	Value: number
	InterestRate: number
	TotalValuePlusInterestRate: number
	NumberOfInstallments: number
	Name: string
	PaymentSystemName: string
	__typename: string
}

export interface CommertialOffer3 {
	discountHighlights: DiscountHighlight3[]
	teasers: any[]
	Price: number
	ListPrice: number
	Tax: number
	taxPercentage: number
	spotPrice: number
	PriceWithoutDiscount: number
	RewardValue: number
	PriceValidUntil: Date
	AvailableQuantity: number
	__typename: string
	Installments: Installment3[]
}

export interface Seller3 {
	sellerId: string
	sellerName: string
	sellerDefault: boolean
	__typename: string
	commertialOffer: CommertialOffer3
}

export interface Image3 {
	cacheId: string
	imageId: string
	imageLabel: string
	imageTag: string
	imageUrl: string
	imageText: string
	__typename: string
}

export interface Sku {
	itemId: string
	name: string
	nameComplete: string
	complementName: string
	ean: string
	variations: Variation2[]
	referenceId: ReferenceId2
	measurementUnit: string
	unitMultiplier: number
	images: Image2[]
	__typename: string
	sellers: Seller2[]
	seller: Seller3
	image: Image3
}

export interface Product {
	cacheId: string
	productId: string
	description: string
	productName: string
	productReference: string
	linkText: string
	brand: string
	brandId: number
	link: string
	categories: string[]
	categoryId: string
	priceRange: PriceRange
	specificationGroups: SpecificationGroup[]
	skuSpecifications: SkuSpecification[]
	productClusters: ProductCluster[]
	clusterHighlights: ClusterHighlight[]
	properties: Property[]
	__typename: string
	items: Item[]
	selectedProperties?: any
	rule?: any
	sku: Sku
}

export interface Variation3 {
	name: string
	values: string[]
	__typename: string
}

export interface ReferenceId3 {
	Key: string
	Value: string
	__typename: string
}

export interface Image4 {
	cacheId: string
	imageId: string
	imageLabel: string
	imageTag: string
	imageUrl: string
	imageText: string
	__typename: string
}

export interface DiscountHighlight4 {
	name: string
	__typename: string
}

export interface Installment4 {
	Value: number
	InterestRate: number
	TotalValuePlusInterestRate: number
	NumberOfInstallments: number
	Name: string
	PaymentSystemName: string
	__typename: string
}

export interface CommertialOffer4 {
	discountHighlights: DiscountHighlight4[]
	teasers: any[]
	Price: number
	ListPrice: number
	Tax: number
	taxPercentage: number
	spotPrice: number
	PriceWithoutDiscount: number
	RewardValue: number
	PriceValidUntil: Date
	AvailableQuantity: number
	__typename: string
	Installments: Installment4[]
}

export interface Seller4 {
	sellerId: string
	sellerName: string
	sellerDefault: boolean
	__typename: string
	commertialOffer: CommertialOffer4
}

export interface SelectedItem {
	itemId: string
	name: string
	nameComplete: string
	complementName: string
	ean: string
	variations: Variation3[]
	referenceId: ReferenceId3[]
	measurementUnit: string
	unitMultiplier: number
	images: Image4[]
	__typename: string
	sellers: Seller4[]
}

export interface SkuSelector {
	selectedImageVariationSKU?: any
	isVisible: boolean
	areAllVariationsSelected: boolean
}

export interface BuyButton {
	clicked: boolean
}

export interface AssemblyOptions {
	items: any
	inputValues: any
	areGroupsValid: any
}

export interface product_context_root {
	loadingItem: boolean
	product: Product
	selectedItem: SelectedItem
	selectedQuantity: number
	skuSelector: SkuSelector
	buyButton: BuyButton
	assemblyOptions: AssemblyOptions
}