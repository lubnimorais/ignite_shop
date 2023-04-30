import Link from 'next/link';
import { ImageContainer, SuccessContainer } from '../styles/pages/success';

export default function SuccessPage() {
  return (
    <SuccessContainer>
      <h1>Compra efetuada!</h1>

      <ImageContainer></ImageContainer>

      <p>
        Uhuu! <strong>Lubni Morais</strong>, sua{' '}
        <strong>Camiseta Explorer</strong> já está a caminho de sua casa
      </p>

      <Link href="/">Voltar ao catálogo</Link>
    </SuccessContainer>
  );
}
