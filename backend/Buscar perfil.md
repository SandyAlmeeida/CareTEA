GET /users/me — Buscar perfil

const express = require('express');
const router = express.Router();

// GET /users/me - Retorna os dados do usuário logado
router.get('/users/me', async (req, res) => {
  try {
    const userId = req.user.id; // Obtido via middleware de autenticação (JWT)
    
    // Exemplo de busca no banco de dados
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar dados do perfil.' });
  }
});

module.exports = router;
