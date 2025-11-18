import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/pag_verificacion.css";
import "../css/login.css";
/*--------------------------------------------------------------CODIGO DE JOEL EMPIEZA ----------------------------------------------------------------------------*/
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert2
/*--------------------------------------------------------------CODIGO DE JOEL TERMINA ----------------------------------------------------------------------------*/

const Verificacion = () => {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

  /*--------------------------------------------------------------CODIGO DE JOEL EMPIEZA ----------------------------------------------------------------------------*/

  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const FRT_URL = "http://localhost:5000";

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showViewer, setShowViewer] = useState(false); // modal para ver PDF

  // Para mostrar el contador de archivos
  const [selectedFiles, setSelectedFiles] = useState([])

  //Selección del archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(
      (f) => f.type === "application/pdf"
    );
    if (files.length > 0) {
      setFile(files[0]);
      setSelectedFiles(files);
    }
  };
  
  
  // Función para manejar la conversión del PDF
 const handleConvert = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "No has seleccionado un archivo",
        text: "Por favor, selecciona un archivo PDF para convertir.",
      });
      return;
    }

    const swalLoading = Swal.fire({
      title: "Convirtiendo...",
      text: "Por favor espera mientras se procesa el archivo.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      showConfirmButton: false,
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${FRT_URL}/convertir_pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      const convertedPdfBlob = response.data;
      const url = URL.createObjectURL(convertedPdfBlob);

      const newDocument = {
        id: Date.now(),
        url: url,
        fecha: new Date().toLocaleString("es-MX"),
        nombre: file.name || "Documento.pdf",
      };

      setDocuments((prev) => [...prev, newDocument]);
      swalLoading.close();

      Swal.fire({
        icon: "success",
        title: "¡Conversión exitosa!",
        text: "El archivo PDF ha sido convertido exitosamente.",
        showConfirmButton: true,
        confirmButtonText: "Ver PDF",
      });
    } catch (err) {
      swalLoading.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al convertir el archivo. Intenta nuevamente.",
      });
    }
  };

  /*--------------------------------------------------------------CODIGO DE JOEL TERMINA ----------------------------------------------------------------------------*/

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

      {/*--------------------------------------------------------------CODIGO DE JOEL EMPIEZA ----------------------------------------------------------------------------*/}

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

                {/* Área Drag & Drop */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = "#e3f7ff";
                    e.currentTarget.style.borderColor = "#138496";
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = "#f0f8ff";
                    e.currentTarget.style.borderColor = "#17a2b8";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = "#f0f8ff";
                    e.currentTarget.style.borderColor = "#17a2b8";

                    const files = Array.from(e.dataTransfer.files).filter(
                      (file) => file.type === "application/pdf"
                    );

                    if (files.length > 0) {
                      const event = {
                        target: { files }
                      };
                      handleFileChange(event);
                    }
                  }}
                  style={{
                    border: "2px dashed #17a2b8",
                    borderRadius: "8px",
                    padding: "40px 20px",
                    textAlign: "center",
                    backgroundColor: "#f0f8ff",
                    cursor: "pointer",
                    width: "100%",
                    transition: "0.2s"
                  }}
                  onClick={() => document.getElementById("pdfInput").click()}
                >
                  <div style={{ fontSize: "2.5rem", color: "#17a2b8", marginBottom: "10px" }}>
                    <i className="bi bi-cloud-arrow-down"></i>
                  </div>

                  <p className="mb-2">Arrastra PDF aquí</p>
                  <small className="text-muted">o haz clic para seleccionar múltiples PDF</small>

                  <div style={{ marginTop: "10px" }}>
                    <small className="text-muted">
                      {selectedFiles.length === 0
                        ? "No hay archivos seleccionados"
                        : `${selectedFiles.length} archivo(s) seleccionado(s)`}
                    </small>
                  </div>
                </div>

                {/* Input oculto para selección manual */}
                <input
                  id="pdfInput"
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                <button onClick={handleConvert} className="btn btn-primary mt-3 w-100">
                  Subir Documento(s)
                </button>
            </div>
          </div>
    
        {/*--------------------------------------------------------------CODIGO DE JOEL TERMINA ----------------------------------------------------------------------------*/}

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

        {/* Section 3: Finalized documents */}\

      {/*--------------------------------------------------------------CODIGO DE JOEL EMPIEZA ----------------------------------------------------------------------------*/}

        <div className="card">
          <div
            className="card-header"
            style={{
              background: "linear-gradient(90deg, #17a2b8 0%, #20c997 100%)",
              color: "white",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check2-circle" style={{ fontSize: "1.5rem" }}></i>
              <div>
                <h6 className="mb-0">Documentos Finalizados ({documents.length})</h6>
                <small>Verificación de cumplimiento</small>
              </div>
            </div>
          </div>

          <div className="card-body">

            {/* Si no hay documentos */}

            {!selectedDocument && (
              <>
                {documents.length === 0 && (
                  <div className="text-center py-5">
                    <div style={{ fontSize: "3rem", color: "#ccc", marginBottom: "15px" }}>
                      <i className="bi bi-file-earmark"></i>
                    </div>
                    <p className="text-muted mb-1">No hay documentos</p>
                    <small className="text-muted">Aún no has subido ningún documento</small>
                  </div>
                )}

                {/* Lista de documentos */}
                {documents.length > 0 && (
                  <div className="d-flex flex-column gap-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 border rounded shadow-sm d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer", background: "#f9fdfd" }}
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <i className="bi bi-file-earmark-text-fill" style={{ fontSize: "2rem", color: "#17a2b8" }}></i>
                          <div>
                            <strong>{doc.fecha}</strong>
                            <div className="text-muted">1 documento</div>
                          </div>
                        </div>
                        <i className="bi bi-chevron-right" style={{ fontSize: "1.4rem", color: "#999" }}></i>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {showViewer && (
          <div
            className="modal d-flex align-items-center justify-content-center"
            style={{
              display: "flex",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.6)",
              zIndex: 9999,
            }}
          >
            <div
              className="bg-white p-3 rounded"
              style={{ width: "80%", height: "80%", position: "relative" }}
            >
              {/* CERRAR */}
              <button
                className="btn btn-danger"
                style={{ position: "absolute", top: 15, right: 15 }}
                onClick={() => setShowViewer(false)}
              >
                Cerrar
              </button>

              {/* IFRAME */}
              <iframe
                src={selectedDocument?.url}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Visor PDF"
              ></iframe>
            </div>
          </div>
        )}

          {selectedDocument && (
            <div className="card mt-4 p-4">

              {/* BOTÓN VOLVER */}
              <button onClick={() => setSelectedDocument(null)}>Volver</button>

              {/* ENCABEZADO */}
              <h5>{selectedDocument.fecha}</h5>
              <small className="text-muted">1 documento</small>

              {/* TARJETA DEL DOCUMENTO */}
              <div
                className="border rounded p-3 mt-3 d-flex justify-content-between align-items-center"
                style={{ background: "#f9fdfd" }}
              >
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-file-earmark-text" style={{ fontSize: "2.8rem", color: "#17a2b8" }}></i>
                  <div>
                    <strong>{selectedDocument.nombre}</strong>
                  </div>
                </div>

                {/* ACCIONES */}
                <div className="d-flex align-items-center gap-3">

                  {/* Ver PDF */}
                  <i
                    className="bi bi-eye"
                    style={{ fontSize: "1.4rem", cursor: "pointer" }}
                    onClick={() => setShowViewer(true)}
                  ></i>

                  {/* Descargar */}
                  <a href={selectedDocument.url} download={selectedDocument.nombre}>
                    <i className="bi bi-download" style={{ fontSize: "1.4rem" }}></i>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

      {/*--------------------------------------------------------------CODIGO DE JOEL TERMINA ----------------------------------------------------------------------------*/}

      </div>

      <footer className="text-center py-3">
        © 2025 SEER Tráfico S.C. — Portal de Carga de Información
      </footer>
    </div>
  );
};

export default Verificacion;
