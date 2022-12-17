import React, { useEffect, useState, useCallback, useMemo } from "react";
import {format} from 'date-fns';
import { ptBR } from "date-fns/esm/locale";
import { api  } from "../service/api";
import "./TableStyles.css";

export function TableComponent() {
    const [transferencias, setTranferencias] = useState([]);
    const [dataInicio, setDataInicio] = useState();
    const [dataFim, setDataFim] = useState();
    const [nome, setNome] = useState();

    useEffect(()=>{
        api.get("/apirest/transferecias").then((response) => {
            setTranferencias(response.data)
        }).catch(err=>{
            console.log("Error:",err);
        })
    },[]);

    const handleSubmit = useCallback(() => {
        api.get("/apirest/transferecias/search", {
            params: {
                "datestart": dataInicio || null ,
                "dateend": dataFim || null,
                "name": nome || ""
            }
        }).then((response) => {
            setTranferencias(response.data)

            Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = "")
            );
            setDataInicio(null)
            setDataFim(null)
            setNome("")
        }).catch(err=>{
            console.log("Error:",err);
        })
    },[dataInicio, dataFim, nome, transferencias]);

    const handleChangeDateStart = (event) => {
        const value = new Date(event.target.value);
        const dataFormat = format(value, "dd/MM/yyyy", { locale: ptBR });
        setDataInicio(dataFormat);
    };

    const handleChangeDateEnd = (event) => {
        const value = new Date(event.target.value);
        const dataFormat = format(value, "dd/MM/yyyy", { locale: ptBR });
        setDataFim(dataFormat);
    };

    const handleChangeName = (event) => {
        const value = event.target.value;
        setNome(value);
    };

    function formatMoney(number) {
        return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
    }

    const saldoTotal = useMemo(() => {
        return transferencias.reduce((acc, cur) => {
            return acc += cur.valor;
        }, 0);
    }, [transferencias]);

    return (
        <div id="container">
        <header>
            <div>
                <label htmlFor="data-inicio">Data de Início</label>
                <input onChange={handleChangeDateStart} type="date" id="data-inicio" name="data-inicio" size="20"  /> 
            </div>
            <div>
                <label htmlFor="data-fim" >Data de Fim</label>
                <input onChange={handleChangeDateEnd} type="date" id="data-fim" name="data-fim" size="20"  /> 
            </div>
            <div>
                <label htmlFor="nome">Nome operador transação</label>
                <input onChange={handleChangeName} type="text" id="nome" name="nome" size="20"  /> 
            </div>

        </header>

    <div className="content-button" >
        <button type="button" className="button" onClick={handleSubmit}>Pequisar</button>
    </div>

    <div> 
        <div className="saldos">
            <span>Saldo Total: {formatMoney(saldoTotal)}</span>
        </div>
        <table id="customers">
           <thead>
            <tr>
                <td>Data</td>
                <td>Valor</td>
                <td>Tipo</td>
                <td>Nome Operador</td>
            </tr>
        </thead>
        <tbody>
            {
                transferencias.map((transferencia) => {
                    return (
                        <tr key = {transferencia.id}>
                            <td>{transferencia.data_transferencia}</td>
                            <td>{formatMoney(transferencia.valor)}</td>
                            <td>{transferencia.tipo}</td>
                            <td>{transferencia.nome_operador_transacao}</td>
                        </tr>
                    )
                })
            }
        </tbody>
        </table>    
    </div> 
   </div>

    )    
}