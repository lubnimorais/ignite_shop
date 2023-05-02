import Link from 'next/link';
import { ImageContainer, SuccessContainer } from '../styles/pages/success';
import { GetServerSideProps } from 'next';
import { stripe } from '../services/stripe';
import Stripe from 'stripe';
import Image from 'next/image';

type IProduct = {
  name: string;
  imageUrl: string;
};

type ISuccessPageProps = {
  customerName: string;
  product: IProduct;
};

export default function SuccessPage({
  customerName,
  product,
}: ISuccessPageProps) {
  return (
    <SuccessContainer>
      <h1>Compra efetuada!</h1>

      <ImageContainer>
        <Image src={product.imageUrl} alt="" width={120} height={110} />
      </ImageContainer>

      <p>
        Uhuu! <strong>{customerName}</strong>, sua{' '}
        <strong>{product.name}</strong> já está a caminho de sua casa
      </p>

      <Link href="/">Voltar ao catálogo</Link>
    </SuccessContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { session_id } = query;

  const sessionId = session_id as string;

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

  const customerName = session.customer_details.name;
  const product = session.line_items.data[0].price.product as Stripe.Product;

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      },
    },
  };
};
