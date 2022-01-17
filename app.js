const { application } = require('express');
const express = require('express');
const res = require('express/lib/response');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaUsers = require('./routes/users');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false})); //aceita apenas dados simples
app.use(bodyParser.json()); //para aceitar apenas json de entrada no body

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //Permitir o controle de origem para o http que eu escolher, porém neste caso eu permiti que todos os http tenham permissão.
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        ); 
        //Neste caso se refere ao cabeçalho, o que eu permito nas propriedades de cabeçalho
        if (req.method == 'OPTIONS'){
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).send({})
        }

        next();
});

app.use('/users', rotaUsers);

// Caso ele não encontre nenhuma rota, favor executar:

app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;