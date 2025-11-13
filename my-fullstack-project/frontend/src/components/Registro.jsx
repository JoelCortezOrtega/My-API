import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/login.css";

const Registro = () => {
  const [formData, setFormData] = useState({
    rfc: "",

    email: "",
    telefono: "",
    empresa: "",
    pwd: "",
    confirmPwd: "",
  });
  const [alertMsg, setAlertMsg] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertMsg(null);

    if (!formData.rfc || !formData.nombre || !formData.email || !formData.pwd || !formData.confirmPwd) {
      setAlertMsg({
        type: "danger",
        text: "Por favor, completa todos los campos requeridos.",
      });
      return;
    }

    if (formData.rfc.length < 12) {
      setAlertMsg({
        type: "danger",
        text: "El RFC debe tener al menos 12 caracteres.",
      });
      return;
    }

    if (!formData.email.includes("@")) {
      setAlertMsg({
        type: "danger",
        text: "Por favor, ingresa un email válido.",
      });
      return;
    }

    if (formData.pwd.length < 8) {
      setAlertMsg({
        type: "danger",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    if (formData.pwd !== formData.confirmPwd) {
      setAlertMsg({
        type: "danger",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }

    setAlertMsg({
      type: "success",
      text: "¡Registro completado exitosamente! Redirigiendo...",
    });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="login-page">
      <div className="login-header" style={{ textAlign: "center", marginBottom: 14 }}>
        <img src="img/LOGONegro.png" alt="Logo" className="logo" />
        <h2 className="welcome-title">Únete a nosotros</h2>
        <p className="welcome-subtitle">Crea tu cuenta y comienza a procesar documentos</p>
      </div>

      <div className="login-card login-card--register">
        {/* Tabs */}
        <div className="login-tabs" role="tablist">
          <button className="tab-btn" type="button" onClick={() => navigate("/")}>Iniciar Sesión</button>
          <button className="tab-btn active" type="button">Registrarse</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="row gx-2">
            <div className="col-6">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <div className="col-6">
              <label className="form-label">RFC</label>
              <input
                type="text"
                name="rfc"
                className="form-control"
                placeholder="AAAA123456ABC"
                value={formData.rfc}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="row gx-2 mt-3">
            <div className="col-6">
              <label className="form-label">Contraseña</label>
              <div className="pwd-wrapper">
                <input
                  type={showPwd ? "text" : "password"}
                  name="pwd"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.pwd}
                  onChange={handleChange}
                  autoComplete="new-password"
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
            <div className="col-6">
              <label className="form-label">Confirmar contraseña</label>
              <div className="pwd-wrapper">
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  name="confirmPwd"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.confirmPwd}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-pwd"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  tabIndex="-1"
                >
                  <i className={`bi ${showConfirmPwd ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>
          </div>

          {alertMsg && (
            <div className={`alert alert-${alertMsg.type} mt-3`} role="alert">
              {alertMsg.text}
            </div>
          )}

          <div className="mt-4">
            <button type="submit" className="btn btn-create w-100">
              <i className="bi bi-sparkles"></i> Crear Cuenta
            </button>
          </div>

          <div className="mt-3">
            <button type="button" className="btn btn-outline-pink w-100">Registrar Empresa</button>
          </div>

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
              <i className="bi bi-shield-lock"></i>
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

export default Registro;
