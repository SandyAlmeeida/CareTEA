const express = require('express');
const router = express.Router();

// PATCH /users/me - Atualiza nome, telefone, cidade e foto do perfil
router.patch('/users/me', async (req, res) => {
  try {
    const userId = req.user.id; // Obtido via middleware
    const { name, phone, city, avatarUrl } = req.body;

    // Monta o objeto apenas com os campos fornecidos
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (city !== undefined) updates.city = city;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: updates }, 
      { new: true, runValidators: true }
    ).select('-password');

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar informações do perfil.' });
  }
});

module.exports = router;
