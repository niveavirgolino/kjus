import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container, Row} from 'reactstrap';
import API from '../api';
import backUrl from './back.png';
import treeExplanationUrl from './tree_explanation.png';
import * as d3 from 'd3';
// import treeData from './tree_data';

class Unidade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'id': '899',
      'nome': 'Vara 000',
      'avg_tempo_primeira_decisao': '0.0',
      'avg_tempo_transito_em_julgado': '0.0',
      'num_processos_em_andamento': '0',
      'num_movimentos_mensal_magistrado': '0',
      'produtividade': '-0.0',
      'segmentacao_por_tipo': [ 0.1, 0.1, 0.1, 0.1, 0.1, 0.5 ],
      'unidades_relacionadas': [
        { 
          'id': 543,  
          'nome': 'Vara 001', 
          'avg_tempo_primeira_decisao': '10.1',
          'avg_tempo_transito_em_julgado': '13.5',
          'num_processos_em_andamento': '1000',
          'num_movimentos_mensal_magistrado': '323',
          'produtividade': '+0.5',
          'delta_avg_tempo_primeira_decisao': '-1.0',
          'delta_avg_tempo_transito_em_julgado': '+1.0',
          'delta_num_processos_em_andamento': '+0.1',
          'delta_num_movimentos_mensal_magistrado': '-231',
          'delta_produtividade': '+1',
          'segmentacao_por_tipo': [ 0.1, 0.2, 0.2, 0.3, 0.1, 0.1 ]
        }
      ],
      'legenda': [ 'contratos', 'peticoes', 'ajuizamentos', 'tratados', 'documentos', 'outros' ]
    };
    this.props = props
  }

  load(id) {
    return API.getUnidade(id).then((result) => {
      console.log(result)
      this.setState(result)
      this.plotTree(result.tree_map)
    })
  }

  plotTree(treeData) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 900 - margin.left - margin.right,
      height = 445 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg = d3.select("#tree-map")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    // read json data
    let data = treeData
    let minusColourInterpolator = d3.interpolateHsl("#fbac93", "#cf3402") 
    let plusColourInterpolator = d3.interpolateHsl("#b9d6b5", "#50c54a") 
    
    let colourFunction = (d) => {
      let val = d.data.delta_prod

      let color;
      if (val < 0) {
        color = minusColourInterpolator(-val)
      } else {
        color = plusColourInterpolator(val)
      }
      // let area = (d.x1 - d.x0) * (d.y1 - d.y0)
      // let scale = area / 50000
      // if (scale > 1.0) scale = 1.0
      // let scale = d.data.delta_prod 
      // let color = colourInterpolator(scale)
      return color
    }

    {
      // Here the size of each leave is given in the 'value' field in input data
      var root = d3.hierarchy(data).sum(function(d){ return d.value}) 
    
      // Then d3.treemap computes the position of each element of the hierarchy
      d3.treemap()
        .size([width, height])
        .padding(2)
        (root)
    
      // use this information to add rectangles:
      svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
          .attr('x', function (d) { return d.x0; })
          .attr('y', function (d) { return d.y0; })
          .attr('width', function (d) { return d.x1 - d.x0; })
          .attr('height', function (d) { return d.y1 - d.y0; })
          .style("fill", colourFunction)
          // .style("fill", "green")
    
      // and to add the text labels
      svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
          .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
          .attr("title", function(d){ d.data.name })
          .text(function(d){ 
            let name = d.data.name
            let w = (d.x1 - d.x0)
            if ((name.length * 10) > w) { 
              name = name.substring(0, w / 10) + "..."
            }
            return name 
          })
          .attr("word-size", "15px")
          .attr("font-size", "15px")
          .attr("fill", "white")

      // and to add the text labels
      svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
          .attr("y", function(d){ return d.y0+42})    // +20 to adjust position (lower)
          .text(function(d){ return d.data.delta_prod })
          .attr("font-size", "14px")
          .attr("fill", "white")
    }
  }

  componentDidMount() {
    let self = this
    let id = this.props.match.params.id
    console.log('id: ' + id);
    this.load(id)
  }

  render() {
    let self = this

    const nome = this.state.nome;
    const avg_tempo_transito_em_julgado = this.state.avg_tempo_transito_em_julgado
    const avg_tempo_primeira_decisao = this.state.avg_tempo_primeira_decisao
    const num_processos_em_andamento = this.state.num_processos_em_andamento
    const num_movimentos_mensal_magistrado = this.state.num_movimentos_mensal_magistrado
    const produtividade = this.state.produtividade 
    const segmentacao_por_tipo = this.state.segmentacao_por_tipo 
    const unidades_relacionadas = this.state.unidades_relacionadas
    const legenda = this.state.legenda

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
            <div class="col-md-6">
              <div class="unidade-title">{nome}</div>
              <div class="unidade-desc-1">
              Gráfico de árvore
              </div>
              <div class="unidade-desc-2">
              (veja quais são as unidades mais similares a que você escolheu)
              </div>
            </div>
            <div class="col-md-3"></div>
            <div style={{display: 'none'}} class="col-md-3">
              <div class="productivity">+ produtivo</div>
            </div>
          </div>

          <div class="row margin-top-50">
            <div class="tree-map-container">
              <div id="tree-map" />
              <img class="tree-explanation" src={treeExplanationUrl} />
            </div>
          </div>

          <div class="row margin-top-50">
            <table class="table table-striped">
              <thead>
                <tr>
                  <td>UNIDADE JUDICIÁRIA</td>
                  <td>TEMPO MÉDIO ATÉ TRÂNSITO EM JULGADO</td>
                  <td>TEMPO MÉDIO ATÉ SENTENÇA 1ᵅ INSTÂNCIA</td>
                  <td>Nᴼ PROCESSOS TRANSITANDO</td>
                  <td>Nᴼ MOVIMENTOS REALIZADOS PELO JUIZ</td>
                  <td>PRODUTIVIDADE</td>
                  <td>SEGMENTAÇÃO POR TIPO DE PROCESSO</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ nome }</td>
                  <td>{ avg_tempo_transito_em_julgado } dias</td>
                  <td>{ avg_tempo_primeira_decisao } dias</td>
                  <td>{ num_processos_em_andamento }</td>
                  <td>{ num_movimentos_mensal_magistrado }</td>
                  <td>{ produtividade }</td>
                  <td>
                    <div class="bar">
                      {segmentacao_por_tipo.map((percent, i) => (
                        <div className={`${"bar-unit-" + i}`}
                             style={{width: (percent * 280) + 'px'}}></div>
                      ))}
                    </div>
                  </td>
                </tr>
                {unidades_relacionadas.map(unid => (
                  <tr>
                    <td>{ unid.nome }</td>
                    <td>{ unid.avg_tempo_transito_em_julgado } dias  
                      <div class="delta-container">
                        <span className={`${unid.delta_avg_tempo_transito_em_julgado.startsWith("+") ? "delta-plus" : "delta-minus"}`}>{unid.delta_avg_tempo_transito_em_julgado}</span>
                      </div>
                    </td>
                    <td>{ unid.avg_tempo_primeira_decisao } dias     
                      <div class="delta-container">
                        <span className={`${unid.delta_avg_tempo_primeira_decisao.startsWith("+") ? "delta-plus" : "delta-minus"}`}>{unid.delta_avg_tempo_primeira_decisao}</span>
                      </div>
                    </td>
                    <td>{ unid.num_processos_em_andamento }          
                      <div class="delta-container">
                        <span className={`${unid.delta_num_processos_em_andamento.startsWith("+") ? "delta-plus" : "delta-minus"}`}>{unid.delta_num_processos_em_andamento}</span>
                      </div>
                    </td>
                    <td>{ unid.num_movimentos_mensal_magistrado }    
                      <div class="delta-container">
                        <span className={`${unid.delta_num_movimentos_mensal_magistrado.startsWith("+") ? "delta-plus" : "delta-minus"}`}>{unid.delta_num_movimentos_mensal_magistrado}</span>
                      </div>
                    </td>
                    <td>{ unid.produtividade }                       
                      <div class="delta-container">
                        <span className={`${unid.delta_produtividade.startsWith("+") ? "delta-plus" : "delta-minus"}`}>{unid.delta_produtividade}</span>
                      </div>
                    </td>
                    <td>
                      <div class="bar">
                        {unid.segmentacao_por_tipo.map((percent, i) => (
                          <div className={`${"bar-unit-" + i}`}
                               style={{width: (percent * 280) + 'px'}}></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="row">
            <div class="col-md-12 legend">
              <span class="legend-desc" >LEGENDA:</span>
              {legenda.map((l, i) => (
                <span><div className={`${"legend-color-" + (i+1)}`}></div> {l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Unidade;
