import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/pag_verificacion.css";
import "../css/login.css";
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const Verificacion = () => {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

  const [file, setFile] = useState(null);
  const FRT_URL = "http://localhost:5000";


  //Selección del archivos
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  
  // Función para manejar la conversión del PDF
  const handleConvert = async () => {
    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No has seleccionado un archivo',
        text: 'Por favor, selecciona un archivo PDF para convertir.',
      });
      return;
    }

    // Mostrar el loading usando SweetAlert
    const swalLoading = Swal.fire({
      title: 'Convirtiendo...',
      text: 'Por favor espera mientras se procesa el archivo.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Mostrar el icono de carga
      },
      showConfirmButton: false, // No mostrar el botón de confirmación
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Enviar el archivo al backend (API Flask)
      const response = await axios.post(`${API_URL}/convertir_pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Recibir el archivo PDF convertido como un Blob
      });

      // Crear una URL para mostrar el PDF convertido
      const convertedPdfBlob = response.data;
      const url = URL.createObjectURL(convertedPdfBlob);

      // Cerrar la alerta de loading y mostrar una de éxito con el enlace para descargar
      swalLoading.close();

      Swal.fire({
        icon: 'success',
        title: '¡Conversión exitosa!',
        text: 'El archivo PDF ha sido convertido exitosamente.',
        showConfirmButton: true,
        confirmButtonText: 'Descargar PDF',
        preConfirm: () => {
          const a = document.createElement('a');
          a.href = url;
          a.download = 'pdf_convertido.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
      });
    } catch (err) {
      // Si ocurre un error, cerrar la alerta de loading y mostrar la alerta de error
      swalLoading.close();

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al convertir el archivo. Intenta nuevamente.',
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      // No token -> redirect to login
      navigate('/', { replace: true })
      return
    }

    // Validate token with backend /auth/me
    ;(async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          // Invalid token
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/', { replace: true })
          return
        }
        // OK
      } catch (err) {
        // network error -> treat as not authorized
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/', { replace: true })
        return
      } finally {
        setChecking(false)
      }
    })()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  if (checking) return null
  return (
    <div>
      {/* Header blanco */}
      <div className="brandbar" style={{ background: "white", borderBottom: "1px solid #e1e7ef" }}>
        <div className="container-fluid py-2">
          <div className="row align-items-center">
            <div
              className="col-auto d-flex align-items-center gap-2"
              style={{ marginLeft: "15px" }}
            >
              <img
                className="navbar-brand"
                src="/img/LOGONegro.png"
                alt="SEER Tráfico S.C."
                style={{ height: "46px" }}
              />
              <h1 className="brand-title mb-0" style={{ color: "#0b2d50" }}>Centro de Cumplimiento Fiscal</h1>
            </div>
            <div className="col text-end" style={{ marginRight: "15px" }}>
              <button className="btn btn-Cerrar" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container-fluid py-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section 1: Upload + Status Cards */}
        <div className="row mb-4">
          {/* Upload section */}
          <div className="col-md-6">
            <div className="card p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{ fontSize: "2.5rem", color: "#17a2b8" }}>
                  <i className="bi bi-cloud-arrow-up"></i>
                </div>
                <div>
                  <h5 className="mb-0">Subir PDF</h5>
                  <small className="text-muted">Procesamiento automático con IA</small>
                </div>
              </div>
              <input type="file" accept="application/pdf" onChange={handleFileChange} />
              <button onClick={handleConvert} className="btn btn-primary mt-3 w-100">Subir Documento(s)</button>
            </div>
          </div>

          {/* Status cards */}
          <div className="col-md-6">
            <div className="row g-2">
              {/* Procesados */}
              <div className="col-12">
                <div className="card p-3" style={{ borderLeft: "4px solid #17a2b8" }}>
                  <div className="d-flex align-items-center">
                    <div style={{ fontSize: "1.8rem", color: "#17a2b8", marginRight: "15px" }}>
                      <i className="bi bi-file-check"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">PROCESADOS</small>
                      <h4 className="mb-0">0</h4>
                    </div>
                  </div>
                </div>
              </div>
              {/* Enviados */}
              <div className="col-12">
                <div className="card p-3" style={{ borderLeft: "4px solid #6f42c1" }}>
                  <div className="d-flex align-items-center">
                    <div style={{ fontSize: "1.8rem", color: "#6f42c1", marginRight: "15px" }}>
                      <i className="bi bi-send"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">ENVIADOS</small>
                      <h4 className="mb-0">0</h4>
                    </div>
                  </div>
                </div>
              </div>
              {/* No cumplidos */}
              <div className="col-12">
                <div className="card p-3" style={{ borderLeft: "4px solid #dc3545" }}>
                  <div className="d-flex align-items-center">
                    <div style={{ fontSize: "1.8rem", color: "#dc3545", marginRight: "15px" }}>
                      <i className="bi bi-exclamation-circle"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">NO CUMPLIDOS</small>
                      <h4 className="mb-0">0</h4>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mis empresas */}
              <div className="col-12">
                <div className="card p-3" style={{ borderLeft: "4px solid #e83e8c" }}>
                  <div className="d-flex align-items-center">
                    <div style={{ fontSize: "1.8rem", color: "#e83e8c", marginRight: "15px" }}>
                      <i className="bi bi-building"></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">MIS EMPRESAS</small>
                      <h4 className="mb-0">0</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Requirements box (kept intact) */}
        <div className="card mb-4">
          <div className="card-header" style={{ background: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
            <h6 className="mb-0">Requerimientos de Documentos</h6>
          </div>
          <div className="card-body">
            <ul className="reqs mb-0">
              <li>
                <strong>Tipo de archivo:</strong> Solo PDF.
              </li>
              <li>
                <strong>Formato:</strong> Escala de grises a 8 bits.
              </li>
              <li>
                <strong>Resolución:</strong> 300 DPI.
              </li>
              <li>
                <strong>Tamaño máximo:</strong> 3 MB por archivo.
              </li>
              <li>
                <strong>Contenido:</strong> Sin formularios ni contraseñas.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: Finalized documents */}
        <div className="card">
          <div className="card-header" style={{ background: "linear-gradient(90deg, #17a2b8 0%, #20c997 100%)", color: "white" }}>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check2-circle" style={{ fontSize: "1.5rem" }}></i>
              <div>
                <h6 className="mb-0">Documentos Finalizados (0)</h6>
                <small>Verificación de cumplimiento</small>
              </div>
            </div>
          </div>
          <div className="card-body text-center py-5">
            <div style={{ fontSize: "3rem", color: "#ccc", marginBottom: "15px" }}>
              <i className="bi bi-file-earmark"></i>
            </div>
            <p className="text-muted mb-1">No hay documentos</p>
            <small className="text-muted">Aún no has subido ningún documento</small>
          </div>
        </div>
      </div>

      <footer className="text-center py-3">
        © 2025 SEER Tráfico S.C. — Portal de Carga de Información
      </footer>
    </div>
  );
};

export default Verificacion;
