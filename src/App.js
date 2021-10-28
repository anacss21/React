
import iconeFiltro from './imagens/funil.png';
import lixo from './imagens/lixo.png';
import close from './imagens/close.png';
import editor from './imagens/editar.png';
import Logo from './imagens/logo.png'
import { React, useState, useEffect } from 'react';
import './App.css';

function Filtro() {
  const [min, setMin] = useState()
  const [max, setMax] = useState()
  return (
    <div className="container-filters">
      <div className="container-chip">
        <div className="week">
          <h1>Dia da semana</h1>
        </div>
      </div>

      <div className="container-chip">
        <div className="modal-valores">
          <h1>Categoria</h1>
        </div>
      </div>
      <div className="container-chip">
        <div className="modal-valores">
          <h1>Valor</h1>
          <div className="valores">
            <label htmlFor="value" className="label"> Min </label>
            <input id="min-value" name="nameValue" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
          </div>
          <div className="valores">
            <label htmlFor="value" className="label"> Max </label>
            <input id="max-value" name="nameValue" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="btn-filter">
        <button className="btn-clear-filters" >Limpar Filtros</button>
        <button className="btn-apply-filters">Aplicar Filtros</button>
      </div>
    </div >
  )
}
function Modal({
  setfecharModal,
  setDateInput,
  setDescriptionInput,
  setCategoryInput,
  setValueInput,
  valueInput,
  categoryInput,
  dateInput,
  descriptionInput,
  handleAdd
}) {
  const [adicionar, setAdicionar] = useState(true);
  return (
    <div className="modal">
      <div className="modal-container">
        <div className="close">
          <img src={close} onClick={() => setfecharModal(false)} />
        </div>
        <h1 className="modal-title">Adicionar Registro</h1>
        <div className="btn-finanças">
          <button className={`credit-button ${adicionar ? "grey-button" : "blue-button"}`} onClick={() => setAdicionar(false)}>Entrada</button>
          <button className={`debit-button ${adicionar ? "orange-button" : "grey-button"}`} onClick={() => setAdicionar(true)}>Saída</button>
        </div>
        <div className="registros">
          <div className="input-modal">
            <label htmlFor="valor-txt">Valor</label>
            <input id="value" name="value" type="number" value={valueInput} onChange={(e) => setValueInput(e.target.value)}></input>
          </div>
          <div className="input-modal">
            <label> Categoria </label>
            <input id="category" name="categoria" type="text" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)}></input>
          </div>
          <div className="input-modal">
            <label htmlFor="date">Data</label>
            <input id="date" name="date" type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} ></input>
          </div>
          <div className="input-modal">
            <label htmlFor="valor-txt"> Descrição </label>
            <input id="valor-txt" name="value" type="text" value={descriptionInput} onChange={(e) => setDescriptionInput(e.target.value)} ></input>
          </div>
        </div>
        <div className="insert">
          <button className="btn-insert" onClick={() => handleAdd()}>Confirmar</button>
        </div>
      </div>
    </div>

  )
}
function App() {
  const [fecharModal, setfecharModal] = useState(false);
  const [fecharFiltro, setFecharFiltro] = useState(false);
  const [abrirLixo, setAbrirLixo] = useState(true);
  const [listas, setListas] = useState([]);
  const [dateInput, setDateInput] = useState();
  const [valueInput, setValueInput] = useState();
  const [categoryInput, setCategoryInput] = useState();
  const [descriptionInput, setDescriptionInput] = useState();

  useEffect(() => {
    loadTransactions();
  }, []);
  async function loadTransactions() {
    try {
      const response = await fetch("http://localhost:3333/transactions", {
        method: "GET",
      });
      const data = await response.json();
      setListas(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAdd() {
    if (!dateInput || !valueInput || !categoryInput || !descriptionInput) {
      return;
    }
    const dayInput = parseInt(dateInput.slice(0, 2));
    const monthInput = parseInt(dateInput.slice(3, 5));
    const yearInput = parseInt(dateInput.slice(6, 10));
    let day = "";
    const newDate = new Date(yearInput, monthInput - 1, dayInput);
    switch (newDate.getDay()) {
      case 0:
        day = "domingo";
        break;
      case 1:
        day = "segunda";
        break;
      case 2:
        day = "terça";
        break;
      case 3:
        day = "quarta";
        break;
      case 4:
        day = "quinta";
        break;
      case 5:
        day = "sexta";
        break;
      case 6:
        day = "sábado";
    }
    const body = {
      date: newDate,
      week_day: day,
      description: descriptionInput,
      value: parseInt(valueInput),
      category: categoryInput,
      type: "credit" ? "credit" : "debit",
    };
    const response = await fetch("http://localhost:3333/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    setfecharModal(false);
    setDateInput("");
    setValueInput("");
    setDescriptionInput("");
    setCategoryInput("");
    await loadTransactions();
  }
  async function handleDelete(listasid) {
    try {
      const response = await fetch(`http://localhost:3333/transactions/${listasid}`, {
        method: "DELETE",
      });
      await loadTransactions();

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="App">
      {fecharModal &&
        <Modal
          handleAdd={handleAdd}
          fecharModal={fecharModal}
          dateInput={dateInput}
          categoryInput={categoryInput}
          descriptionInput={descriptionInput}
          valueInput={valueInput}
          setfecharModal={setfecharModal}
          setDescriptionInput={setDescriptionInput}
          setDateInput={setDateInput}
          setValueInput={setValueInput}
          setCategoryInput={setCategoryInput}
        />}
      <header className="container-header"> <img src={Logo} /> </header>
      <div className="container">
        <div className="btn-filtrar">
          <button className="open-filters-button" onClick={() => setFecharFiltro((prevState) => !prevState)}><img src={iconeFiltro} /> Filtrar  </button>
        </div>
        <div className="container-info">
          <div className="container-inside">
            {fecharFiltro && <Filtro fecharFiltro={fecharFiltro} setFecharFiltro={setFecharFiltro} />}
            <table className="table">
              <table className="table-head">
                <tr className="coluna">
                  <th> Data </th>
                  <th> Dia da semana </th>
                  <th>Descrição</th>
                  <th>Categoria </th>
                  <th> Valor </th>
                  <th> </th>
                </ tr>
              </table >
              <table className="table-body">
                {listas.map((lista) => (
                  <table className="table-line">
                    <tr className="coluna">
                      <th >{new Date(lista.date).toLocaleString().replace("00:00:00", "")}  </th>
                      <th>{lista.week_day}</th>
                      <th> {lista.description}</th>
                      <th>{lista.category}</th>
                      <th className={`${lista.type === "debit" ? "orange" : "blue"}`}>{lista.value / 100}</th>
                      <th>
                        <section>
                          <img src={editor} />
                          <img src={lixo} onClick={() => setAbrirLixo(lista.id)} />
                          {abrirLixo === lista.id &&
                            <div className="container-confirm-delete">
                              <h1 className="confirm-delete">Apagar item?</h1>
                              <div className="btn-actions-confirm-delete">
                                <button className="btn-yes" onClick={() => handleDelete(lista.id)}>Sim</button>
                                <button className="btn-no" onClick={() => setAbrirLixo(false)}> Não</button>
                              </div>
                            </div>
                          }
                        </section>
                      </th>
                    </ tr>
                  </table >
                ))}
              </table >
            </table >
          </div>
          <div className="container-resume">
            <div className="resume">
              <h1>Resumo</h1>
              <table className="entrada-in">
                <tr>
                  <th className="entrada">Entradas</th>
                  <th className="in">R$ 200,00</th>
                </tr>
              </table>
              <table >
                <tr>
                  <th className="saida">Saídas</th>
                  <th className="out"> R$ 70,50</th>
                </tr>
              </table>
              <table className="saldo-balance" >
                <tr>
                  <th className="saldo">Saldo</th>
                  <th className="balance">R$ 129,50</th>
                </tr>
              </table>
            </div>
            <button className="btn-add-registro" onClick={() => setfecharModal(true)}>Adicionar Registro</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
