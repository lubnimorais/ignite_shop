import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';

import Stripe from 'stripe';

import { stripe } from '../../services/stripe';

import {
  ImageContainer,
  ProductContainer,
  ProductDetail,
} from '../../styles/pages/produtct';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import axios from 'axios';

type IProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  defaultPriceId: string;
  price: number;
  price_formatted: string;
};

type IProductPageProps = {
  product: IProduct;
};

export default function ProductPage({ product }: IProductPageProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);

  const handleByProduct = useCallback(async () => {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (err) {
      setIsCreatingCheckoutSession(false);

      alert('Falha ao redirecionar ao checkout');
    }
  }, [product.defaultPriceId]);

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} alt="" width={520} height={480} />
        </ImageContainer>

        <ProductDetail>
          <h1>{product.name}</h1>

          <span>{product.price_formatted}</span>

          <p>{product.description}</p>

          <button
            disabled={isCreatingCheckoutSession}
            onClick={handleByProduct}
          >
            Comprar agora
          </button>
        </ProductDetail>
      </ProductContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });

  const price = product.default_price as Stripe.Price;

  const data = {
    id: product.id,
    name: product.name,
    imageUrl: product.images[0],
    defaultPriceId: price.id,
    price: price.unit_amount / 100,
    price_formatted: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price.unit_amount / 100),
    description: product.description,
  };

  return {
    props: {
      product: data,
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};
