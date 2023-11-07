const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt")
const app = express();
app.use(express.json());
app.use(cors());

const Filme = mongoose.model ("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema ({
    login: {type: String, required: true, unique: true},
    senha: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema);

async function conectarMongo() {
    await mongoose.connect(`mongodb+srv://pro_mac:mongo123@cluster0.skf8n.mongodb.net/?retryWrites=true&w=majority`);
}

//ponto de acesso teste get
app.get('/oi', (req, res) => res.send('oi'));

//ponto de acesso para consultar a lista de filmes
app.get('/filmes', async (req, res) => {
    const filmes = await Filme.find();
    res.json(filmes)
});

//ponto de acesso para enviar um novo filme
app.post('/filmes', async (req, res) => {
    const titulo = req.body.titulo;
    const sinopse = req.body.sinopse;

    const filme = new Filme({titulo: titulo, sinopse: sinopse});
    await filme.save();
    
    const filmes = await Filme.find();
    res.json(filmes);
})

app.post('/signup', async (req, res) => {
    try {
        const login = req.body.login;
        const senha = req.body.senha;
        const criptografada = await bcrypt.hash(senha, 10);
        const usuario = new Usuario({login: login, senha: criptografada});
        const respostaMongo = await usuario.save();
        console.log (respostaMongo);
        res.status(201).end();
    }
    catch (e) {
        console.log (e);
        res.status(409).end();
    }
})

app.listen(3000, () => {
    try {
        conectarMongo();
        console.log("conexão ok e aplicação up & running");
    }
    catch (e) {
        console.log ("erro: ", e);
    }
});