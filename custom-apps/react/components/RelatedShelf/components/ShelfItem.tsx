import React, { useMemo } from 'react';
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom';
import { ExtensionPoint } from 'vtex.render-runtime';
import { MaybeProduct } from 'vtex.product-context/react/ProductTypes';

interface IProps {
  item: MaybeProduct;
}

const ShelfItem = ({ item }: IProps) => {
  const product = useMemo(() => ProductSummary.mapCatalogProductToProductSummary(item), [item]);
  return <ExtensionPoint id="product-summary" product={product} />;
};

export default ShelfItem;
