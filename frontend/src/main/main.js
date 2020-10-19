import React, {Component} from 'react';
import {Link, Switch, Route, Redirect, useHistory} from 'react-router-dom';
import {Container, Row} from 'reactstrap';
import API from '../api';
import unidadesUrl from './unidades.png';
import processosUrl from './processos.png';
import searchUrl from './search.png';
import Autosuggest from 'react-autosuggest';
import unidades_validas from './unidades_validas.json';

const unidades = unidades_validas.unidades

const removeAccents = (s) => {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

const getMatchingUnidade = unidade => {
  const inputValue = removeAccents(unidade.trim().toLowerCase())
  let filtered_unidades = unidades.filter(
    u => removeAccents(u.name.toLowerCase()) === inputValue
  )
  if (filtered_unidades.length === 0) return null
  return filtered_unidades[0]
}

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  value = value.value
  const inputValue = removeAccents(value.trim().toLowerCase())
  const inputLength = inputValue.length;
  return inputLength === 0 ? [] : unidades.filter(u =>
    removeAccents(u.name.toLowerCase()).includes(inputValue)
  )
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
)

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: []
    }

    this.props = props
    this.options = ['abc', 'xyz', 'www']

    let self = this
    this.onChange = (event, { newValue }) => {
      let unidade = getMatchingUnidade(newValue)
      if (unidade) {
        self.props.history.push('/unidade/' + unidade.id + '/')
      }

      self.setState({
        value: newValue
      })
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    this.onSuggestionsFetchRequested = (value) => {
      self.setState({
        suggestions: getSuggestions(value)
      })
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    this.onSuggestionsClearRequested = () => {
      self.setState({
        suggestions: []
      })
    }

    this.onProcessoChange = (event, newValue) => {
      let processo = event.target.value
      if (processo.length < 20) return
      self.props.history.push('/processo/' + processo + '/')
    }
    console.log(unidades)
  }

  load() {
    return API.getMain().then((result) => {
      console.log(result)
    })
  }

  componentDidMount() {
    this.load().then(() => {
      console.log('Done')
    })

    // $(document).ready(function () {
    //   $('#sidebarCollapse').on('click', function () {
    //     $('#sidebar').toggleClass('active');
    //   });
    // });
  }

  handleTypeahead(selected) {
    console.log(selected) 
  }

  render() {
    let self = this

    const { value, suggestions, processo } = this.state

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Digite o nome da unidade judiciária',
      value,
      onChange: self.onChange
    }

    return (
      <div class="wrapper">
        <nav id="sidebar"></nav>
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-9 margin-top-120">
              <div class="main-card">
                <img src={unidadesUrl} />
                <div class="main-card-content">
                  <div class="main-card-content-top">
                    <div class="main-card-title">AGENTE DA JUSTIÇA</div>
                    <div class="main-card-description">
                      Compare diferentes unidades judiciais brasileiras
                    </div>
                  </div>
                  <div class="main-card-content-bottom">
                    <div class="input-group mb-3">
                      <Autosuggest
                          suggestions={suggestions}
                          onSuggestionsFetchRequested={self.onSuggestionsFetchRequested}
                          onSuggestionsClearRequested={self.onSuggestionsClearRequested}
                          getSuggestionValue={getSuggestionValue}
                          renderSuggestion={renderSuggestion}
                          inputProps={inputProps}
                        />

                      <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon2"><img src={searchUrl} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-9">
              <div class="main-card">
                <img src={processosUrl} />
                <div class="main-card-content margin-top-50">
                  <div class="main-card-content-top">
                    <div class="main-card-title">CIDADÃO</div>
                    <div class="main-card-description">
                      Compare seu processo em diferentes unidades judiciais
                    </div>
                  </div>
                  <div class="main-card-content-bottom">
                    <div class="input-group mb-3">
                      <input type="text" class="form-control" placeholder="Digite o número do processo" onChange={self.onProcessoChange} />
                      <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon2"><img src={searchUrl} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Main;
