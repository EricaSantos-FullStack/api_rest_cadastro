const express = require('express');
const app = express();

app.use('/teste',(req, res, next) =>{
    res.status(200).send({
        mensagem: 'Teste realizado com sucesso'
    });
});

module.exports = app;