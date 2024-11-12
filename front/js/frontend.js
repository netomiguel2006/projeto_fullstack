
const protocolo = 'http://'
const baseURL = 'localhost:3000'

function listarFilmes (filmes) {
        //posicionar-se no corpo da tabela
        let tabela = document.querySelector('.filmes')
        let corpoTabela = tabela.getElementsByTagName('tbody')[0]
        //destruir a tabela
        corpoTabela.innerHTML=""
        //reconstruir o corpo da tabela: uma linha para cada filme
        for (let filme of filmes) {
            let linha = corpoTabela.insertRow(0)
            let celulaTitulo = linha.insertCell(0)
            let celulaSinopse = linha.insertCell(1)
            celulaTitulo.innerHTML = filme.titulo
            celulaSinopse.innerHTML = filme.sinopse 
        }
}

async function obterFilmes() {
    const filmesEndpoint = '/filmes'
    const URLcompleta = `${protocolo}${baseURL}${filmesEndpoint}`
    const filmes = (await axios.get(URLcompleta)).data
    listarFilmes(filmes)
}

async function prepararPagina() {
    const token = localStorage.getItem("token")
    const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')
    const loginLink = document.querySelector('#loginLink')
    if (token) {
        //se token existe, o usuário está logado
        cadastrarFilmeButton.disabled = false
        loginLink.innerHTML = "Logout"
    }
    else {
        cadastrarFilmeButton.disabled = true
        loginLink.innerHTML = "Login"
    }
    obterFilmes()
}

async function cadastrarFilme() {
    const filmesEndpoint = '/filmes'
    //montar a URL de acesso, USANDO A CRASE
    const URLcompleta = `${protocolo}${baseURL}${filmesEndpoint}`
    //capturar os inputs, trazendo para as variáveis
    let tituloInput = document.querySelector('#tituloInput')
    let sinopseInput = document.querySelector('#sinopseInput')
    let titulo = tituloInput.value
    let sinopse = sinopseInput.value
    if (titulo && sinopse) {
        //limpar os campos de digitação
        tituloInput.value = ""
        sinopseInput.value = ""
        //enviar os dados capturados e receber a coleção de filmes atualizada
        const filmes = (await axios.post(URLcompleta, {titulo, sinopse})).data
        listarFilmes(filmes)
    }
    else {
        exibirAlerta ('.alert-filme', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none'], 2000)
    }
}

async function cadastrarUsuario() {
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value
    if (usuarioCadastro && passwordCadastro) {
        try {
            const cadastroEndpoint = '/signup'
            const URLcompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
            await axios.post(
                URLcompleta,
                {login: usuarioCadastro, password: passwordCadastro})
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""
             exibirAlerta ('.alert-modal-cadastro', "Usuário cadastrado com sucesso!", ['show', 'alert-success'], ['d-none'], 2000)
            ocultarModal('#modalCadastro', 2000)
        }
        catch (e) {
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""
            exibirAlerta ('.alert-modal-cadastro', "Não foi possível cadastrar", ['show', 'alert-danger'], ['d-none'], 2000)
            ocultarModal('#modalCadastro', 2000)
        }
    }
    else {
        exibirAlerta ('.alert-modal-cadastro', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none'], 2000)
    }
}

function exibirAlerta (seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    alert.classList.add (...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout (() => {
        alert.classList.remove (...classesToAdd)
        alert.classList.add (...classesToRemove)
    }, timeout)
}

function ocultarModal(seletor, timeout) {
    setTimeout (() => {
        let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))
        modal.hide()
    }, timeout)
}

const fazerLogin = async () => {
    let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
    let passwordLoginInput = document.querySelector('#passwordLoginInput')
    let usuarioLogin = usuarioLoginInput.value
    let passwordLogin = passwordLoginInput.value
    if (usuarioLogin && passwordLogin) {
        try {
            const loginEndpoint = '/login'
            const URLcompleta = `${protocolo}${baseURL}${loginEndpoint}`
            const response = await axios.post (
                URLcompleta,
                {login: usuarioLogin, password: passwordLogin} 
            )
            //console.log (response.data)
            const token = response.data
            localStorage.setItem("token", token) 
            usuarioLoginInput.value = ""
            passwordLoginInput.value = ""
            exibirAlerta('.alert-modal-login', "Login realizado com sucesso!!!", ['show', 'alert-success'], ['d-none'], 2000)
            ocultarModal('#modalLogin', 2000)
            const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')
            cadastrarFilmeButton.disabled = false
            const loginLink = document.querySelector('#loginLink')
            loginLink.innerHTML = "Logout"
        }
        catch (e) {
            exibirAlerta('.alert-modal-login', 'Falha na autenticação!!!', ['show', 'alert-danger'], ['d-none'], 2000)
        }
    }
    else {
        exibirAlerta('.alert-modal-login', 'Preencha todos os campos!!!', ['show', 'alert-danger'], ['d-none'], 2000)
    }
}