import React from 'react';
import { useQuery } from 'react-apollo';
import GET_PRODUCTS from '../../graphql/productRelated.gql';
import { MaybeProduct, ProductContextState } from 'vtex.product-context/react/ProductTypes';
import useProduct from 'vtex.product-context/useProduct';
import { ProductListContext } from 'vtex.product-list-context';
import ShelfItem from './components/ShelfItem';
import { SliderLayout } from 'vtex.slider-layout';
import styles from './styles.css';
import { SliderLayoutProps, SliderLayoutSiteEditorProps } from 'vtex.slider-layout/react/components/SliderContext';

interface IProps extends SliderLayoutSiteEditorProps, SliderLayoutProps {
  recommendation: string;
  shelfTitle: string;
  itemsPerPage?: any
  showNavigationArrows?: any
  showPaginationDots?: any
  infinite?: any
  fullWidth?: any
  centerMode?: any
  centerModeSlidesGap?: any
  autoplay?: any
}

const RelatedShelf = (props: IProps) => {
  const { product }: ProductContextState = useProduct();
  const { ProductListProvider } = ProductListContext;
  const productId = product?.productId;
  const { data, error, loading } = useQuery(GET_PRODUCTS, {
    variables: {
      identifier: { field: 'id', value: productId },
      type: props.recommendation,
    },
  });

  const productsRelateds: MaybeProduct[] = data?.productRecommendations;

  if (loading || error) return null;

  return (
    <div className={styles.containerSliderRelated}>
      <ProductListProvider listName="Shelf">
        <SliderLayout
          itemsPerPage={props.itemsPerPage ?? { phone: 1, tablet: 2, desktop: 4 }}
          showNavigationArrows={props.showNavigationArrows}
          infinite={props.infinite ?? true}
          fullWidth={props.fullWidth ?? true}
          autoplay={props.autoplay}
        >
          {productsRelateds?.map((item, index) => (
            <ShelfItem item={item} key={index} />
          ))}
        </SliderLayout>
      </ProductListProvider>
    </div>
  );
};

export default RelatedShelf;
