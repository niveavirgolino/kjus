import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container, Row} from 'reactstrap';
import API from '../api';
import backUrl from './back.png';

class Processo extends Component {
  constructor(props) {
    super(props);
    this.state = {   
      'id': '00000000000000000000',
      'data_entrada': '01/01/2020',
      'ultimo_movimento': '01/01/2020',
      'unidade_judiciaria': {
        'id': '0',
        'nome': 'Vara 000',
      },
      'movimentos': [
        { 'num': 0, 'nome': 'Entrada', 'data': '2020-10-02 11:23' },
        { 'num': 1, 'nome': 'Audiencia Inicial', 'data': '2020-13-02 21:23' },
        { 'num': 2, 'nome': 'Objeção', 'data': '2020-10-02 15:23' },
      ],
      'estatisticas': {
        'tempo_esperado': '40.1',
        'tempo_medio_para_classe_processual': '50.5'
      },
      'unidades_relacionadas': [
        { 
          'id': '2200',
          'nome': '4a Vara Cívil de São Paulo',
          'tempo_esperado': '30.1',
          'delta': '2.1',
        },
        { 
          'id': '2201',
          'nome': '5a Vara Cívil de São Paulo',
          'tempo_esperado': '30.1',
          'delta': '2.1',
        },
        { 
          'id': '2201',
          'nome': '5a Vara Cívil de São Paulo',
          'tempo_esperado': '30.1',
          'delta': '2.1',
        },
        { 
          'id': '2201',
          'nome': '5a Vara Cívil de São Paulo',
          'tempo_esperado': '30.1',
          'delta': '2.1',
        }
      ]
    };
    this.props = props
  }

  load(id) {
    return API.getProcesso(id).then((result) => {
      console.log(result)
      this.setState(result)
    })
  }

  componentDidMount() {
    let self = this

    let id = this.props.match.params.id
    console.log('id: ' + id);
    this.load(id)
  }

  render() {
    let self = this

    const processo_id = this.state.id
    const data_entrada = this.state.data_entrada
    const ultimo_movimento = this.state.ultimo_movimento
    const unidade_judiciaria = this.state.unidade_judiciaria.nome
    const tempo_esperado = this.state.estatisticas.tempo_esperado 
    const tempo_medio_para_classe_processual = this.state.estatisticas.tempo_medio_para_classe_processual 
    const tempo_para_conclusao = this.state.estatisticas.tempo_para_conclusao
    const unidades_relacionadas = this.state.unidades_relacionadas
    const movimentos = this.state.movimentos

    return (
      <div class="wrapper">
        <nav id="sidebar">
          <div class="nav-back">
            <Link to="/">
              <img src={backUrl} />
            </Link>
          </div>
        </nav>

        <div class="container-fluid">
          <div class="row margin-top-50">
            <div class="col-md-12">
              <div class="unidade-title">
              Processo Nᴼ { processo_id }
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="unidade-desc-1">
              Informações sobre o processo
              </div>

              <table class="margin-top-20">
                <tbody>
                  <tr><td class="processo-info-title">DATA DE ENTRADA:</td>   <td class="processo-info-value">{ data_entrada }</td></tr>
                  <tr><td class="processo-info-title">ÚLTIMO MOVIMENTO:</td>  <td class="processo-info-value">{ ultimo_movimento }</td></tr>
                  <tr><td class="processo-info-title">UNIDADE JUDICIÁRIA:</td><td class="processo-info-value">{ unidade_judiciaria }</td></tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-2">
              <div class="processo-card">
                <div class="processo-card-title background-color-red">TEMPO MÉDIO P/ ESSE TIPO DE PROCESSO</div>
                <div class="processo-card-content">
                  <div class="processo-big-value">{tempo_esperado}</div>
                  <div class="processo-small-value">dias</div>
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="processo-card">
                <div class="processo-card-title background-color-yellow">TEMPO DECORRIDO NO SEU PROCESSO</div>
                <div class="processo-card-content">
                  <div class="processo-big-value">{tempo_medio_para_classe_processual}</div>
                  <div class="processo-small-value">dias</div>
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="processo-card">
                <div class="processo-card-title background-color-beige">TEMPO ESPERADO PARA A CONCLUSÃO</div>
                <div class="processo-card-content">
                  <div class="processo-big-value">{tempo_esperado}</div>
                  <div class="processo-small-value">dias</div>
                </div>
              </div>
            </div>
          </div>

          <div class="row margin-top-50">
            <div class="col-md-12 unidade-desc-1">
              Como estaria seu processo em outras unidades judiciárias?
            </div>
            <div class="col-md-12 unidade-desc-2">
              (Prazo para conclusão do processo em unidades similares)
            </div>
          </div>

          <div class="row margin-top-20">
            {unidades_relacionadas.map(unid => (
              <div class="col-md-2">
                <div class="processo-card">
                  <div class="processo-card-title background-color-brown">{unid.nome}</div>
                  <div class="processo-card-content">
                    <div class="processo-big-value">{unid.tempo_esperado}</div>
                    <div class="processo-small-value">dias</div>
                    <div class="delta-container">
                      <span className={`${unid.delta.startsWith("+") ? "delta-plus" : "delta-minus"}`}>{unid.delta}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div class="row margin-top-50">
            <div class="col-md-12 unidade-desc-1">
              Acompanhe o andamento do seu processo
            </div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <td>DATA</td>
                  <td>MOVIMENTAÇÃO</td>
                  <td>DESCRIÇÃO</td>
                </tr>
              </thead>
              <tbody>
                {movimentos.map(m => (
                  <tr>
                    <td>{m.data}</td>
                    <td>{m.nome}</td>
                    <td>{m.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default Processo;
