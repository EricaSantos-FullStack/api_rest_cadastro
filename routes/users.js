const express = require('express');
const router = express.Router();

//RETORNA TODOS OS USUÁRIOS
router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: "Usando o GET dentro de users"
    });
});

//INSERE UM USUÁRIO
router.post('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Usando o POST dentro de users"
    });
});

// RETORNA OS DADOS DE UM USUÁRIO
router.get('/:id_usuario', (req, res, next) =>{
    const id = req.params.id_usuario

    if (id === 'especial'){
        res.status(200).send({
            mensagem: "Você achou o ID especial",
            id:id
        });
    } else {
        res.status(200).send({
            mensagem: "Você achou o ID comum.",
            id:id
        });
    }
});

// ALTERA OS DADOS DO USUÁRIO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Usando o PATCH dentro da rota de users"
    });
});

// EXCLUI OS DADOS
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Usando o DELETE dentro da rota de users"
    });
});


module.exports = router;