import styles from '../styles/components/CategoriesCard.module.scss';
import { useStateContext } from '../hooks/useStateContext';
import { useCategories } from '../hooks/useCategories';
import { Navigate } from '../components/Navigate';
import MainLayout from '../layouts/Mainlayout';
import addition from '../assets/addition.svg';

const CategoriesPage = () => {
  const { state } = useStateContext();
  const { actions, categories } = useCategories();

  return (
    <MainLayout title="Услуги" subtitle="Выберите услуги" isArrow>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {categories.map((item, index) => {
          return (
            <div key={index} style={{ marginTop: 16 }} className={styles.card}>
              <div
                style={{
                  paddingLeft: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 8,
                }}
              >
                <div>
                  <p>{item.card}</p>
                  <p>цена {item.price} ₽</p>
                </div>

                <div
                  onClick={
                    state.cards?.includes(item.card) && state.price
                      ? () => actions.removeCategory(item)
                      : () => actions.addCategory(item)
                  }
                >
                  <img
                    width={30}
                    height={30}
                    style={{
                      transform: state.cards?.includes(item.card)
                        ? 'rotate(45deg)'
                        : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                    alt=""
                    src={addition}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Navigate page="Categories" />
    </MainLayout>
  );
};

export default CategoriesPage;
