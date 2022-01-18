const express = require('express');
const router = express.Router();
const mysql2 = require('../mysql2').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//CADASTRO DO USUARIO
router.post('/cadastro', (req, res, next) => {
    mysql2.getConnection((error, conn) => {
        if (error) {return res.status(500).send({error: error}) }
        conn.query('SELECT * FROM user WHERE email = ?', [req.body.email], (error, results) => {
            if (error){ return res.status(500).send({error: error}) }
            if (results.length > 0) {
                res.status(409).send({ mensagem: 'Usuário já cadastrado'})
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if(errBcrypt) { return res.status(500).send({ error: errBcrypt})}
                    conn.query(
                        `INSERT INTO user (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)`, 
                        [req.body.nome, req.body.sobrenome, req.body.email, hash],
                         (error, results) => {
                             conn.release(); //para liberar a conexão
                             if (error){
                                 return res.status(500).send({error: error}) }
                                response = {
                                    mensagem: 'usuário criado com sucesso',
                                    usuarioCriado: {
                                       id_user: results.insertId,
                                       nome: req.body.nome,
                                       sobrenome: req.body.sobrenome,
                                       email: req.body.email
                                    }
                                }
                                return res.status(201).send(response)
                         })
                }) 
            };
        })

    });
});

router.post('/login', (req, res, next) => {
    mysql2.getConnection((error, conn) => {
            if (error){ return res.status(500).send({error: error}) }
            const query = `SELECT * FROM user WHERE email = ?`;
            conn.query(query, [req.body.email],(error, results, fields) => {
                conn.release();
                if (error){ return res.status(500).send({error: error}) }
                if (results.length < 1) {
                    return res.status(401).send({ mensagem: 'Falha na altentificação'})
                }

                bcrypt.compare(req.body.senha, results[0].senha, (error, result) => {
                    if (error){
                        return res.status(401).send({ mensagem: 'Falha na altentificação'})
                    }
                    if (result) {
                        const token = jwt.sign({
                            id_user: results[0].id_user,
                            email: results[0].email
                        }, 
                        process.env.JWT_KEY, 
                        {
                            expiresIn: "1h" //depois de uma hora o user terá que refazer o login
                        });

                        return res.status(200).send({ 
                            mensagem: 'Autenticado com sucesso',
                            token: token
                        });
                    }
                  
                    return res.status(401).send({ mensagem: 'Falha na altentificação'})
                });
            });
    });
});





















//RETORNA TODOS OS USUÁRIOS
router.get('/:cadastrados', (req, res, next) =>{
  
    mysql2.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({error: error}) }
        
        conn.query(
            'SELECT * FROM user;',
            (error, results, field) => {
                if (error) {
                    return res.status(500).send({error: error}) }
                    res.status(201).send({response: results});
            }
        )
    })
    
});

// RETORNA OS DADOS DE UM USUÁRIO
router.get('/:id_user', (req, res, next) =>{
    mysql2.getConnection((error, conn) => {
        if (error) {return res.status(500).send({error: error}) }
        
        conn.query(
            'SELECT * FROM user WHERE id_user = ?;',
            [req.params.id_user],
            (error, results, fields) => {
                if (error) {return res.status(500).send({error: error}) }
                return res.status(200).send({response: results})
            }
        )
    });
});

// ALTERA OS DADOS DO USUÁRIO
router.patch('/editar', (req, res, next) => {
    mysql2.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({error: error}) }

        conn.query(
            `UPDATE user
                SET   nome        = ?,
                      sobrenome   = ?,
                      email       = ?,
                      senha       = ?
                WHERE id_user     = ?`,
        [req.body.nome, req.body.sobrenome, req.body.email, req.body.senha, req.body.id_user],
        (error, results) => {
            conn.release();
            if (error) {
                return res.status(500).send({error: error}); } 
            
            res.status(202).send({
                mensagem: "Dados alterados com sucesso"
            });
        }
        )
    })
});

// EXCLUI OS DADOS
router.delete('/deletar', (req, res, next) => {
    mysql2.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({error: error}) }

        conn.query(
            'DELETE FROM user WHERE id_user = ?', [req.body.id_user],
        (error, results, field) => {
            conn.release();
            if (error) {
                return res.status(500).send({error: error}); } 
            
            res.status(202).send({
                mensagem: "Usuário removido com sucesso"
            });
        }
        )
    })
});


module.exports = router;