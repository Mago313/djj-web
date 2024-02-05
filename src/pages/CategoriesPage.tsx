import React from 'react'
import MainLayout from '../layouts/Mainlayout'
import styles from "../styles/components/CategoriesCard.module.scss"
import addition from "../assets/addition.svg"
import { State } from '../types/state'
import { Categories, Category } from '../types/category'
import { Navigate } from '../components/Navigate'

type TProps = {
  state: State
  setState: React.Dispatch<React.SetStateAction<State>>
  modalActive: boolean
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>
}

const categories: Categories = [
  {
    card: "Стрижка",
    price: 600
  },
  {
    card: "Тонирование бороды",
    price: 500
  },
  {
    card: 'Моделирование бороды',
    price: 400
  },
  {
    card: "Стрижка + Борода",
    price: 800
  },
  {
    card: "Стрижка + Моделирование бороды",
    price: 800
  },
]


const CategoriesPage = ({ setState, state, modalActive, setModalActive }: TProps) => {
  const [isRotated, setRotated] = React.useState(false);

  const actions = {
    addCategory: (item: Category) => {
      setState(prevState => {
        return {
          ...prevState,
          cards: prevState?.cards ? [...prevState.cards, item.card] : [item.card],
          price: prevState?.price ? prevState.price + item.price : item.price
        }
      })
    },
    removeCategory: (item: Category) => {
      setState(prevState => {

        return {
          ...prevState,
          cards: prevState.cards?.filter(cards => cards !== item.card),
          price: prevState.price && prevState.price - item.price
        }
      })
    }
  }

  const handleRotateClick = () => {
    setRotated(!isRotated);
  };

  return (
    <MainLayout title='Услуги' isArrow>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>{categories.map((item, index) => {
        return (
          <div key={index} style={{ marginTop: 16 }} className={styles.card}>
            <div style={{ paddingLeft: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8 }}>
              <div>
              <p>{item.card}</p>
              <p>цена {item.price} ₽</p>
              </div>
              
              <div onClick={state.cards?.includes(item.card) && state.price ? () => actions.removeCategory(item) : () => actions.addCategory(item)}>
                <img
                  width={30}
                  height={30}
                  style={{
                    transform: state.cards?.includes(item.card) ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.4s',
                  }}
                  alt=''
                  src={addition}
                  onClick={handleRotateClick}
                />
              </div>
            </div>
          </div>
        )
      })}
      </div>
      <Navigate page='Categories' modalActive={modalActive} setModalActive={setModalActive} state={state} setState={setState}/>
    </MainLayout>
  )
}

export default CategoriesPage

