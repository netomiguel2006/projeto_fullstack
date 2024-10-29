const protocolo = 'http://'
const baseURL = 'localhost:3000'


function listarFilmes (filmes) {
     //posicionamento da tabela
     let tabela = document.querySelector('.filmes')
     let corpoTabela = tabela.getElementsByTagName('tbody')[0]
     // destruir a tabela 
     corpoTabela.innerHTML=""
     //reconstrução da tabela : uma linha para cada filme 
     for (let filme of filmes ) {
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
async function cadastrarFilme(){
    const filmesEndPoint = '/filmes'
    //MONTAR A URL de acesso usando a crase
    const URLcompleta =`${protocolo}${baseURL}${filmesEndPoint}`
    //capturar os inputs do usuário , trazendo para variaveis locais // quarySelector =faz você se localizar
    let tituloInput = document.querySelector('#tituloInput')
    let sinopseInput = document.querySelector('#sinopseInput')
    let titulo = tituloInput.value 
    let sinopse = sinopseInput.value 
    if (titulo && sinopse) {    //limpar os campos de digitação 
        tituloInput.value = ""
        sinopseInput.value = ""
        //enviar os dados capturados e receber a coleção de filmes atualizada 
        const filmes = (await axios.post(URLcompleta, {titulo, sinopse})).data
        listarFilmes(filmes)
    }
    else {
        let alert =  document.querySelector('.alert')
        alert.classList.add('show')
        alert.classList.remove('d-none')
        setTimeout(() => {
            alert.classList.remove('show')
            alert.classList.add('d-none')
        }, 2000)

    }

   
}

