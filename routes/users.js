const express = require('express');
const router = express.Router();
const mysql2 = require('../mysql2').pool;
const bcrypt = require('bcrypt');


//RETORNA TODOS OS USUÁRIOS
router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: "Usando o GET dentro de users"
    });
});

//INSERE UM USUÁRIO
router.post('/:add', (req, res, next) => {

//      const usuario = {
//      id_user: req.body.id_user,
//      nome: req.body.nome,
//      sobrenome: req.body.sobrenome,
//      email: req.body.email,
//      senha: req.body.senha
//   };

    mysql2.getConnection((err, conn) => {
        
                if (error) {
                    return res.status(500).send({error: error}) }
                
                 bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                     if (errBcrypt) { return res.status(500).send({error: errBcrypt}) }

                     conn.query(
                        'INSERT INTO users (id_user, nome, sobrenome, email, senha) VALUES (?, ?)',
                        [req.body.id_user, req.body.nome, req.body.sobrenome, req.body.email, req.body.hash],
                        (error, results) => {
                             conn.release(); //Importante: quando ele chegar no call back, essa linha vai liberar a conexão para não sobrecarregar a conexão
            
                            res.status(201).send({
                                mensagem: "Dados inseridos com sucesso",
                                id_user: resultado.insertId
                        });

                });
             }
        )
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