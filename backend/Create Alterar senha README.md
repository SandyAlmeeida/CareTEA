const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// PATCH /users/me/password - Altera a senha do usuário logado
router.patch('/users/me/password', async (req, res) => {
  try {
    const userId = req.user.id; // Obtido via middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Informe a senha atual e a nova senha.' });
    }

    // Busca o usuário incluindo a hash da senha
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Valida se a senha atual está correta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'A senha atual incorreta.' });
    }

    // Criptografa a nova senha e salva
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao alterar a senha.' });
  }
});

module.exports = router;
