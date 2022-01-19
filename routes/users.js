const express = require('express');
const router = express.Router();
const mysql2 = require('../mysql2').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');


//CADASTRO DO USUARIO
router.post('/cadastro', login, (req, res, next) => {
    mysql2.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM user WHERE email = ?', [req.body.email], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length > 0) {
                return res.status(409).send({ mensagem: 'Usuário já cadastrado' })
            }
            bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                conn.query(
                    `INSERT INTO user (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)`,
                    [req.body.nome, req.body.sobrenome, req.body.email, hash],
                    (error, results) => {
                        conn.release(); //para liberar a conexão
                        if (error) {
                            return res.status(500).send({ error: error })
                        }
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
        })

    });
});

//Login e autentificação

router.post('/login', (req, res, next) => {
    mysql2.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const query = `SELECT * FROM user WHERE email = ?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autentificação' })
            }

            bcrypt.compare(req.body.senha, results[0].senha, (error, equal) => {
                if (error) {
                    return res.status(401).send({ mensagem: 'Falha na autentificação' })
                }
                if (equal) {
                    const token = jwt.sign({
                        id_user: results.id_user,
                        email: results.email,
                    }, process.env.JWT_KEY,

                        {
                            expiresIn: "1h"
                        }, { algorithm: 'HS256' });

                    return res.status(200).send({
                        mensagem: 'Autentificado com sucesso',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autentificação' })
            });
        });
    });
});



// ALTERA OS DADOS DO USUÁRIO
router.patch('/editar', (req, res, next) => {
    mysql2.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }

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
                    return res.status(500).send({ error: error });
                }

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
            return res.status(500).send({ error: error })
        }

        conn.query(
            'DELETE FROM user WHERE id_user = ?', [req.body.id_user],
            (error, results, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }

                res.status(202).send({
                    mensagem: "Usuário removido com sucesso"
                });
            }
        )
    })
});


module.exports = router;