//RETORNA TODOS OS USUÁRIOS
router.get('/:cadastrados', (req, res, next) => {

    mysql2.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }

        conn.query(
            'SELECT * FROM user;',
            (error, results, field) => {
                if (error) {
                    return res.status(500).send({ error: error })
                }
                res.status(201).send({ response: results });
            }
        )
    })

});

// RETORNA OS DADOS DE UM USUÁRIO
router.get('/:id_user', (req, res, next) => {
    mysql2.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM user WHERE id_user = ?;',
            [req.params.id_user],
            (error, results, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ response: results })
            }
        )
    });
});

