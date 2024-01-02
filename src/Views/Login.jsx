import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarAdmin from '../Components/NavBarAdmin';
import users from '../Components/users';

const Login = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (userRole === 'admin') {
      navigate('/admin/drinks');
    }
  }, [userRole, navigate]);

  const handleUsernameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Verifica que ambos campos no estén vacíos
    if (!name || !password) {
      setError('Por favor, completa ambos campos.');
      return;
    }

    // Verifica las credenciales con el array de usuarios
    const user = users.find((u) => u.name === name && u.password === password);

    if (user) {
      setUserRole(user.role);
  
      // Verifica el tipo de usuario
      if (user.role === 'admin') {
        // Usuario administrador, redirige a la ruta "/admin"
        navigate('admin/drinks');
      } else if (user.role === 'cajero') {
        // Usuario cajero, redirige a la página sin acceso al administrador
        redirectToHome();
      } else {
        setError('Credenciales incorrectas');
      }
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const redirectToHome = () => {
    // Redirige a la página de inicio ("/home")
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div
        className="absolute inset-0 "
        style={{
          backgroundImage: 'url(https://i.postimg.cc/XNxyKkdY/brother-fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
        }}
      ></div>
      <div className="relative w-full max-w-md p-6 rounded-3xl shadow-md bg-gradient-to-b from-slate-600 to-slate-950">
        <h1 className="font-fredericka text-white text-3xl md:text-6xl mb-6">Drinks App</h1>
        <form>
          <label className="font-fredericka text-white text-xl md:text-2xl block mb-4">
            Usuario
            <input
              type="text"
              value={name}
              onChange={handleUsernameChange}
              className="text-black text-lg md:text-xl font-sans form-input mt-1 block w-full"
            />
          </label>
          <label className="font-fredericka text-white text-xl md:text-2xl block mb-4">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="text-black text-lg md:text-xl font-sans form-input mt-1 block w-full"
            />
          </label>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="button"
            onClick={handleLogin}
            className="font-fredericka  bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600 focus:outline-none focus:shadow-outline-blue active:bg-slate-800"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
      {userRole && <NavBarAdmin userRole={userRole} />}
    </div>
  );
};

export default Login;
