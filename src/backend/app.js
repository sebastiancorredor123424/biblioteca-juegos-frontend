// 📦 Dependencias necesarias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 🚀 Inicializar la app
const app = express();
app.use(express.json());
app.use(cors());

// 🌐 Puerto del servidor
const PORT = 3000;

// 🔗 URL de conexión a MongoDB (modifícala con tus datos)
const MONGO_URL = "mongodb+srv://jacobogarcesoquendo:aFJzVMGN507tA3A8@cluster0.mqwbn.mongodb.net/SebastianCorredorLara";


// 🧠 Conexión a MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB conectado correctamente'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// 📘 Esquema de usuario
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: String
});

// 🧩 Modelo de usuario
const User = mongoose.model('User', userSchema);

// 🧾 Ruta para registrar usuario
app.post('/register', async (req, res) => {
  const { name, email, password, avatar } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: '⚠️ El usuario ya está registrado.' });
  }

  const newUser = new User({ name, email, password, avatar });
  await newUser.save();
  res.status(201).json({ message: '✅ Usuario registrado con éxito.', user: newUser });
});

// 🔑 Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { userOrEmail, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: userOrEmail }, { name: userOrEmail }]
  });

  if (!user) return res.status(400).json({ message: '⚠️ Usuario no encontrado.' });
  if (user.password !== password) return res.status(400).json({ message: '⚠️ Contraseña incorrecta.' });

  res.status(200).json({ message: '✅ Inicio de sesión exitoso.', user });
});

// ▶️ Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
