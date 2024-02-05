import React from "react";
import "../App.css";
import MainLayout from "../layouts/Mainlayout";
import date from "../assets/date.svg";
import services from "../assets/checkMark.png";
import Modal from "../modal/Modal";
import { Button } from "../components/Button";
import AdminPage from "./AdminPage";
import { State } from "../types/state";
import { Spacing } from "../utils/helpers/Spacing";
import MenuBlock from "../components/MenuBlock";

type TProps = {
  state: State
  modalActive: boolean
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>
  setState: React.Dispatch<React.SetStateAction<State>>
}

const FirstPage = ({ state, modalActive, setModalActive, setState }: TProps) => {
  
  return (
    <MainLayout title="DJJ" subtitle="Уход за мужским имиджем">
      <div style={{ paddingTop: 8 }}>
        <Spacing>
          <MenuBlock img={date} name="Время" link="/date" />
        </Spacing>
        <Spacing>
          <MenuBlock img={services} name="Услуги" link='/categories' />
        </Spacing>
        {modalActive || 
        <Spacing>
          {state.price && state.dateTime ? <Button onClick={() => { setModalActive(!modalActive) }} title="Продолжить" /> : <></>}
        </Spacing>}
        {modalActive && <Modal active={modalActive} setActive={setModalActive} state={state} setState={setState}/> }
      </div>
    </MainLayout>
  );
};

export default FirstPage;
