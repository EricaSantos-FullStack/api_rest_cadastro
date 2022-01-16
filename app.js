const { application } = require('express');
const express = require('express');
const res = require('express/lib/response');
const app = express();
const morgan = require('morgan');

const rotaUsers = require('./routes/users');

app.use(morgan('dev'));

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