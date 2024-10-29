// console.log("Hello, Node !")
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model ("Filme", mongoose.Schema ({
    titulo: {type: String},
    sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model ("Usuario", usuarioSchema)

async function conectarAoMongo() {
    await mongoose.connect ('mongodb+srv://netomiguel2006:soraya220874@miguelneto.mb6p7.mongodb.net/?retryWrites=true&w=majority&appName=miguelneto')
}
//get: (url, ponto de acesso) assim => (http://localhost:3000/filmes) 
app.get('/filmes', async (req, res) => {
    const filmes = await Filme.find()
    res.json (filmes)
})

app.post('/filmes', async (req, res) => {
    //pegar dados enviados na requisição (requisição.vou no corpo.pego o titulo ou sinopse)
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //instanciar um objeto de acorde com o modelo criado 
    const filme = new Filme ({titulo: titulo, sinopse: sinopse})
    await filme.save()
    const filmes = await Filme.find()
    //motrat ao user os filmes 
    res.json(filmes)
})
app.post('/signup', async (req, res) => {
    try{
        const login = req.body.login
        const password = req.body.password
        const senhaCriptografada = await bcrypt.hash(password,10)
        const usuario = new Usuario({login: login, password:senhaCriptografada})
        const respMongo = await usuario.save()
        console.log(respMongo)
        res.status(201).end()
    }
    catch(e) {
        console.log(e)
        res.status(409).end
    }    
})
app.post('/login',async(req,res) => {
      //pega os dados que o usuario digitou
      const login = req.body.login
      const password = req.body.password
      //verifica se o usuario existe lá no banco
      const  usuarioExiste = await Usuario.findOne({login: login})
      if (!usuarioExiste) {
        return res.status(401).json({mensagem:"login invalido"})
      }
      // se o usuario existe ,verificamos a senha
      const senhaValida = await bcrypt.compare(password, usuarioExiste.password)
      if (!senhaValida) {
        return res.status(401).json({mensagem: "senha invalida"})
    }
    //aqui vamos gerar o token.. daqui a pouco
    const token = jwt.sign(
        {login: login},
        "chave-temporaria",
        {expiresIn: "1hr"}
    )
    res.status(200).json({token:token})
})

app.listen (3000, () => {
    try {
        conectarAoMongo ()
        console.log ("server up and running conection ok")
    }
    catch (e) {
        console.log ('Erro de conexão', e)
    }
})


