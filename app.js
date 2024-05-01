const express = require('express');
const sequelize = require('./sequelize');
const authRoutes = require('./routes/authRoutes');
const autenticarToken = require('./middleware/auth');

const app = express();

// Inicialização do Sequelize
sequelize.sync({ force: false })
  .then(() => {
    console.log('Banco de dados conectado');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

// Middlewares
app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rota protegida
app.get('/api/protegida', autenticarToken, (req, res) => {
  res.json({ msg: 'Rota protegida acessada com sucesso' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
