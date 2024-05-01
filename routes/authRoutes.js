const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Rota de registro
router.post(
  '/register',
  [
    check('nome', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Email inválido').isEmail(),
    check('senha', 'A senha deve ter no mínimo 6 caracteres').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, senha } = req.body;

    try {
      let user = await User.findOne({ where: { email } });

      if (user) {
        return res.status(400).json({ msg: 'Usuário já existe' });
      }

      user = await User.create({
        nome,
        email,
        senha: await bcrypt.hash(senha, 10)
      });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, 'segredo', { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

// Rota de login
router.post(
  '/login',
  [
    check('email', 'Email inválido').isEmail(),
    check('senha', 'Senha é obrigatória').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;

    try {
      let user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ msg: 'Credenciais inválidas' });
      }

      const isMatch = await bcrypt.compare(senha, user.senha);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Credenciais inválidas' });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, 'segredo', { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

module.exports = router;
