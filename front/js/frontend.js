const protocolo = 'http://'
const baseURL = 'localhost:3000'


function listarFilmes(filmes) {
    //posicionamento da tabela
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    // destruir a tabela 
    corpoTabela.innerHTML = ""
    //reconstrução da tabela : uma linha para cada filme 
    for (let filme of filmes) {
        let linha = corpoTabela.insertRow(0)
        let celulaTitulo = linha.insertCell(0)
        let celulaSinopse = linha.insertCell(1)
        celulaTitulo.innerHTML = filme.titulo
        celulaSinopse.innerHTML = filme.sinopse
    }
}

async function obterFilmes() {
    const filmesEndPoint = '/filmes'
    const URLcompleta = `${protocolo}${baseURL}${filmesEndPoint}`
    const filmes = (await axios.get(URLcompleta)).data
    listarFilmes(filmes)
}
async function cadastrarFilme() {
    const filmesEndPoint = '/filmes'
    //MONTAR A URL de acesso usando a crase
    const URLcompleta = `${protocolo}${baseURL}${filmesEndPoint}`
    //capturar os inputs do usuário , trazendo para variaveis locais // quarySelector =faz você se localizar
    let tituloInput = document.querySelector('#tituloInput')
    let sinopseInput = document.querySelector('#sinopseInput')
    let titulo = tituloInput.value
    let sinopse = sinopseInput.value
    if (titulo && sinopse) {    //limpar os campos de digitação 
        tituloInput.value = ""
        sinopseInput.value = ""
        //enviar os dados capturados e receber a coleção de filmes atualizada 
        const filmes = (await axios.post(URLcompleta, { titulo, sinopse })).data
        listarFilmes(filmes)
    }
    else {
        exibirAlerta ('.alert-filme', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none'], 2000)

    }


}
async function cadastrarUsuario() {
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput ')
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

            exibirAlerta ('.alert-modal-cadastro',"Usuário cadastrado com sucesso!",  ['show', 'alert-success'],['d-none'],2000)
           
            ocultarModal('#modalCadastro', 2000)
          
        }
        catch (e) {

                exibirAlerta ('.alert-modal-cadastro', "Não possível cadastrar", ['show', 'alert-danger'], ['d-none'],2000 )
                usuarioCadastroInput.value = ""
                passwordCadastroInput.value = ""
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
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout (() => {
        alert.classList.remove(...classesToAdd)
        alert.classList.add(...classesToRemove)
    }, timeout)
}
function ocultarModal(seletor,timeout) {
    setTimeout(() => {
        let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))
        modal.hide()
    }, timeout)
}