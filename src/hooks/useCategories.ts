import { useStateContext } from './useStateContext';
import { Categories, Category } from '../types/category';

const categories: Categories = [
  {
    card: 'Стрижка',
    price: 600,
  },
  {
    card: 'Моделирование бороды',
    price: 400,
  },
  {
    card: 'Стрижка + Борода',
    price: 800,
  },
];

export const useCategories = () => {
  const { setState } = useStateContext();

  const actions = {
    addCategory: (item: Category) => {
      setState((prevState) => {
        return {
          ...prevState,
          cards: prevState?.cards
            ? [...prevState.cards, item.card]
            : [item.card],
          price: prevState?.price ? prevState.price + item.price : item.price,
        };
      });
    },
    removeCategory: (item: Category) => {
      setState((prevState) => {
        return {
          ...prevState,
          cards: prevState.cards?.filter((cards) => cards !== item.card),
          price: prevState.price && prevState.price - item.price,
        };
      });
    },
  };

  return {
    categories,
    actions,
  };
};
