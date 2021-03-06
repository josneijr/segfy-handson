﻿class ModalNovoSeguro extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clienteId: "",
            seguroTipo: "Residencial",
            objetoId: ""
        };

        this.Salvar = this.Salvar.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
            [name]: value
        });
    }

    Salvar(el) {
        axios.post('/api/DB', {
            clienteId: this.state.clienteId,
            tipoSeguro: this.state.seguroTipo,
            objetoId: this.state.objetoId
        })
        .then(response => {
            alert("SUCESSO!");
        })
        .catch(error => {
            alert("ERRO! Verifique os dados de entrada.");
        });
    }

    render() {
        return (
            <div className="modal fade" id="modalNovoSeguro" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Novo Seguro</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label >Identificação do Cliente</label>
                                    <input type="text" onChange={this.handleInputChange} className="form-control" name="clienteId" placeholder="Aqui vai o CPF/CNPJ do contratante"/>
                                    <small className="form-text text-muted">Insira o número de identificação da pessoa/empresa que está contratando o seguro.</small>
                                </div>

                                <div className="form-group">
                                    <label>Tipo de Seguro</label>
                                    <select className="form-control" onChange={this.handleInputChange} name="seguroTipo">
                                        <option>Residencial</option>
                                        <option>Automovel</option>
                                        <option>Vida</option>
                                    </select>
                                    <small className="form-text text-muted">Cada seguro pede um tipo diferente de identificação.</small>
                                </div>

                                <div className="form-group">
                                    <label>Identificação do Bem Segurado</label>
                                    <input type="text" onChange={this.handleInputChange} className="form-control" name="objetoId" placeholder="Aqui vai a identificação do segurado" />
                                    <small className="form-text text-muted">Residencial: endereço (Ex.: Rua Exemplo, 299)</small>
                                    <small className="form-text text-muted">Automotivo: placa (Ex.: AAA-0000)</small>
                                    <small className="form-text text-muted">Vida: CPF (Ex.: 000.001.002-33)</small>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={e => this.Salvar(e)}>Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
    )}
}

function Button(a) {
    return (
        <button type="button"
            id="floatButton"
            className="btn btn-success"
            data-toggle="modal"
            data-target="#modalNovoSeguro">
                <i className="fas fa-plus fa-5"></i>
        </button> 
)}


class TabelaSeguros extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }; 

        this.Editar = this.Editar.bind(this);
        this.Apagar = this.Apagar.bind(this);
    }

    Editar(el, id) {
        el.preventDefault();


    }

    Apagar(el, id) {
        el.preventDefault();

        axios.delete('/api/DB/' + id)
            .then(function (response) {
                alert("APAGADO!");
            })
            .catch(function (error) {
                alert("ERRO");
            });
    }

    render() {
        return (
            <div>
                <h1>Tabela de Seguros</h1>

                <div className="input-group mb-3 col-4">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                    <input type="text" className="form-control" placeholder="Busca" onKeyUp={e => this.props.handleInputChange(e)}/>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Segurado</th>
                            <th>Apagar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.tabelaItens.map(e => {
                            return (
                                <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td>{e.clienteId}</td>
                                    <td>{e.tipoSeguro}</td>
                                    <td>{e.objetoId}</td>
                                    <td>
                                        <a href="" onClick={a => this.Apagar(a, e.id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
    )}
}

class HomeApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tabelaItens: [],
            tabelaItensFiltrada: [],
            filtroText: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.FiltrarDados = this.FiltrarDados.bind(this);
        this.RefreshDados = this.RefreshDados.bind(this);
    }

    FiltrarDados() {

        var filtrado = this.state.tabelaItens.filter(t => {
            var fLower = this.state.filtroText.toLowerCase();

            return (t.clienteId.toLowerCase().includes(fLower) ||
                t.id.toString().toLowerCase().includes(fLower) ||
                t.tipoSeguro.toLowerCase().includes(fLower) ||
                t.objetoId.toLowerCase().includes(fLower))
        });

        this.setState({
            tabelaItensFiltrada: filtrado
        });
    }

    handleInputChange(event) {
        const value = event.target.value;

        this.setState({
            filtroText: value
        });

        this.FiltrarDados();
    }

    RefreshDados() {
        axios.get('/api/DB')
            .then(response => {
                this.setState({
                    tabelaItens: response.data
                });

                this.FiltrarDados();
            })
            .catch(error => {
                console.log(error);
            });
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.RefreshDados(),
            1000
        );
    }

    render() {
        return (
            <div className="HomeApp">
                <Button />
                <TabelaSeguros handleInputChange={this.handleInputChange} tabelaItens={this.state.tabelaItensFiltrada} />
                <ModalNovoSeguro/>
            </div>
        );
    }
}

ReactDOM.render(
    <HomeApp />,
    document.getElementById('content')
);