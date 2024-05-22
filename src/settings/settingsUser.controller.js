import User from '../users/user.model.js'
import bcryptjs from 'bcryptjs'

export const getUserSetting = async (req, res) => {
    try{
        const { userId } = req.body

        console.log(userId)

        const userData = await User.findById(userId)

        return res.status(200).json({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            hotel: userData.hotel
        })
    }catch(e){
        return res.status(500).send('Something went wrong')
    }
}

export const getUserSettingSolo = async (req, res) => {
  try{
      const { userId } = req.body

      const user = await User.find({ estado: true, _id: userId });
        res.status(200).json(user);
      }catch(e){
      return res.status(500).send('Something went wrong')
  }
}

export const usuariosUpdate = async (req, res) => {
    const { email, role, hotel } = req.body;

    console.log(hotel);
  
    try {
      // Verifica si el campo hotel está vacío
      const hotelToUpdate = hotel === "" ? null : hotel;
  
      const usuarioActualizado = await User.findOneAndUpdate(
        { email: email },
        { role: role, hotel: hotelToUpdate },
        { new: true }
      );
  
      if (!usuarioActualizado) {
        return res.status(404).json({
          msg: 'No se encontró un usuario con ese email',
        });
      }
  
      res.status(200).json({
        msg: 'Tu usuario ha sido actualizado',
        usuario_nuevo: usuarioActualizado
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: 'Ocurrió un error al actualizar el usuario',
        error: error.message
      });
    }
}

  

export const usuariosPut = async (req, res) => {
    const { userId, username, email } = req.body;
  
    const actualizaciones = { username: username, email: email };
    const usuarioActualizado = await User.findByIdAndUpdate(userId, actualizaciones, { new: true });
  
    console.log(usuarioActualizado)
  
    res.status(200).json({
        msg: 'Tu usuario ha sido actualizado',
        usuario_nuevo: usuarioActualizado.usuario
    });
  }

export const passwordPatch = async (req, res) => {
    try{
        const { userId, password, newPassword} = req.body

        const userData = await User.findById(userId, {password: 1})

        const isPasswordCorrect = await bcryptjs.compare(password, userData.password)

        if(!isPasswordCorrect){
            return res.status(400).send('Invalid password. Please try again')
        }

        const encryptedPassword = await bcryptjs.hash(newPassword, 10)

        await User.updateOne({_id: userId},{password: encryptedPassword})

        return res.status(200).send('Password changed succesfully')
    }catch(e){
        return res.status(500).send('Somthing went wrong')
    } 
}