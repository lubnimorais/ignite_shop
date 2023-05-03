import { useMemo } from 'react';

import { GetStaticProps } from 'next';
import Head from 'next/head';

import Link from 'next/link';

import Image from 'next/image';

import Stripe from 'stripe';

import { stripe } from '../services/stripe';

import { useKeenSlider } from 'keen-slider/react';

import { HomeContainer, Product } from '../styles/pages/home';

import 'keen-slider/keen-slider.min.css';

type IProducts = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  price_formatted: string;
};

type IHomeProps = {
  products: IProducts[];
};

const gap = 48;
let origin = 0.5;

export default function HomePage({ products }: IHomeProps) {
  const slideOrigin = useMemo(() => {
    if (typeof window !== 'undefined') {
      const viewportWidth = window.visualViewport!.width;
      const paddingLeft = (viewportWidth - 1180) / 2;
      origin = (paddingLeft + gap) / viewportWidth;
    }

    return origin;
  }, []);

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: gap,
      origin: slideOrigin,
    },
  });

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map(product => (
          <Link key={product.id} href={`/product/${product.id}`} passHref>
            <Product className="keen-slider__slide">
              <Image src={product.imageUrl} width={520} height={480} alt="" />

              <footer>
                <strong>{product.name}</strong>
                <span>{product.price_formatted}</span>
              </footer>
            </Product>
          </Link>
        ))}
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  });

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: price.unit_amount / 100,
      price_formatted: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount / 100),
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
