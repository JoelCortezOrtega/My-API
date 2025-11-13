import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setAlertMsg(null);

    if (!email || !pwd) {
      setAlertMsg({
        type: "danger",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    if (email === "test@example.com" && pwd === "123456") {
      setAlertMsg({
        type: "success",
        text: "Inicio de sesión exitoso. Redirigiendo...",
      });

      setTimeout(() => {
        navigate("/verificacion");
      }, 1500);
    } else {
      setAlertMsg({
        type: "danger",
        text: "Correo electrónico o contraseña incorrectos.",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-header" style={{ textAlign: "center", marginBottom: 14 }}>
        <img src="img/LOGONegro.png" alt="CAAST" className="logo" />
        <h1 className="welcome-title">Bienvenido de vuelta</h1>
        <p className="welcome-subtitle">Accede a tu centro de cumplimiento fiscal</p>
      </div>

      <div className="login-card login-card--register">
        {/* Tabs de Iniciar Sesión / Registrarse */}
        <div className="login-tabs">
          <button className="tab-btn active" type="button">
            Iniciar Sesión
          </button>
          <button 
            className="tab-btn"
            type="button"
            onClick={() => navigate("/registro")}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="tu@email.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pwd" className="form-label">
              Contraseña
            </label>
            <div className="pwd-wrapper">
              <input
                type={showPwd ? "text" : "password"}
                className="form-control"
                id="pwd"
                placeholder="••••••••"
                autoComplete="current-password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <button
                type="button"
                className="toggle-pwd"
                onClick={() => setShowPwd(!showPwd)}
                tabIndex="-1"
              >
                <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          {alertMsg && (
            <div className={`alert alert-${alertMsg.type} mt-3`} role="alert">
              {alertMsg.text}
            </div>
          )}

          <button type="submit" className="btn btn-create w-100">
            <i className="bi bi-lightning-charge"></i> Iniciar Sesión
          </button>

          <button
            type="button"
            className="forgot-pwd-link"
            onClick={() => navigate("/recuperar-contrasena")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>

      </div>

      <div className="login-footer mt-3 text-center">
        <h3 className="features-heading">Características Incluidas</h3>
        <div className="features-list mt-2">
          <div className="feature-item">
            <div className="feature-icon feature-icon--pink">
              <i className="bi bi-lightning-fill"></i>
            </div>
            <div className="feature-label">Procesamiento IA</div>
          </div>

          <div className="feature-item">
            <div className="feature-icon feature-icon--orange">
              <i className="bi bi-shield-check"></i>
            </div>
            <div className="feature-label">Cumplimiento Fiscal</div>
          </div>

          <div className="feature-item">
            <div className="feature-icon feature-icon--green">
              <i className="bi bi-check-circle"></i>
            </div>
            <div className="feature-label">Verificación Automática</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
