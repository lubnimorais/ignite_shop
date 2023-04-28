import { styled } from '..';

export const HomeContainer = styled('main', {
  width: '100%',
  maxWidth: 'calc(100vw - ((100vw-1180) / 2))',
  minHeight: 656,

  display: 'flex',
  gap: '3rem',

  background: 'red',

  marginLeft: 'auto',
});

export const Product = styled('a', {
  background: 'linear-gradient(180deg, #1ea483 0%, #7465d4 100%)',

  borderRadius: 8,

  padding: '0.25rem',

  cursor: 'pointer',

  position: 'relative',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  overflow: 'hidden',

  img: {
    objectFit: 'cover ',
  },

  footer: {
    position: 'absolute',

    bottom: '0.25rem',
    left: '0.25rem',
    right: '0.25rem',

    padding: '2rem',

    borderRadius: 6,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    background: 'rgba(0, 0, 0, 0.6)',

    transform: 'translateY(110%)',

    opacity: 0,

    transition: 'all 0.2s ease-in-out',

    strong: {
      fontSize: '$lg',
    },

    span: {
      fontSize: '$xl',
      fontWeight: 'bold',

      color: '$green300',
    },
  },

  '&:hover': {
    footer: {
      transform: 'translateY(0%)',
      opacity: 1,
    },
  },
});
