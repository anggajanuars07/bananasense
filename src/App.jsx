import { useState } from "react";
import axios from "axios";

function App() {

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const [result, setResult] = useState("");
  const [statusColor, setStatusColor] =
    useState("#E6B800");

  const [loading, setLoading] =
    useState(false);

  // Upload Image
  const handleImage = (e) => {

    const selectedFile = e.target.files[0];

    if (selectedFile) {

      setPreview(
        URL.createObjectURL(selectedFile)
      );

      setFile(selectedFile);

      setResult("");

    }

  };

  // AI Detection
  const handleDetect = async () => {

    if (!file) {

      alert("Upload gambar terlebih dahulu!");

      return;

    }

    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await axios.post(
        "https://bananasense-backend.onrender.com/detect",
        formData
      );

      console.log(response.data);

      if (
        response.data.detections.length > 0
      ) {

        const detection =
          response.data.detections[0];

        const confidence =
          detection.confidence;

        // STATUS KEMATANGAN
        if (confidence >= 85) {

          setResult("MATANG 🟡");
          setStatusColor("#FBC02D");

        }

        else if (confidence >= 60) {

          setResult("MENTAH 🟢");
          setStatusColor("#43A047");

        }

        else {

          setResult("TERLALU MATANG 🟤");
          setStatusColor("#6D4C41");

        }

      }

      else {

        setResult(
          "PISANG TIDAK TERDETEKSI"
        );

        setStatusColor("#E53935");

      }

    }

    catch (error) {

      console.error(error);

      setResult("AI DETECTION ERROR");

      setStatusColor("#E53935");

    }

    setLoading(false);

  };

  return (

    <div style={styles.container}>

      {/* HERO */}
      <section style={styles.hero}>

        <h1 style={styles.title}>
          🍌 BananaSense
        </h1>

        <p style={styles.subtitle}>
          Sistem AI untuk Deteksi Tingkat
          Kematangan Pisang Cavendish
          Menggunakan Computer Vision
        </p>

      </section>

      {/* ABOUT */}
      <section style={styles.card}>

        <h2 style={styles.heading}>
          Tentang BananaSense
        </h2>

        <p style={styles.text}>
          BananaSense adalah sistem berbasis
          Artificial Intelligence yang membantu
          petani menentukan tingkat kematangan
          pisang secara cepat dan akurat.
        </p>

      </section>

      {/* MASALAH */}
      <section style={styles.card}>

        <h2 style={styles.heading}>
          Permasalahan
        </h2>

        <ul style={styles.list}>

          <li>
            ❌ Kesalahan menentukan tingkat kematangan
          </li>

          <li>
            ❌ Risiko kerugian buah busuk
          </li>

          <li>
            ❌ Distribusi tidak optimal
          </li>

        </ul>

      </section>

      {/* SOLUSI */}
      <section style={styles.card}>

        <h2 style={styles.heading}>
          Solusi BananaSense
        </h2>

        <ul style={styles.list}>

          <li>
            ✅ AI Deteksi Kematangan Otomatis
          </li>

          <li>
            ✅ Membantu Petani dan Distributor
          </li>

          <li>
            ✅ Mengurangi Kerugian Buah
          </li>

        </ul>

      </section>

      {/* TEKNOLOGI */}
      <section style={styles.card}>

        <h2 style={styles.heading}>
          Teknologi
        </h2>

        <div style={styles.techBox}>

          <div style={styles.techItem}>
            🤖 YOLOv8
          </div>

          <div style={styles.techItem}>
            🐍 Python
          </div>

          <div style={styles.techItem}>
            ⚛ React JS
          </div>

          <div style={styles.techItem}>
            👁 OpenCV
          </div>

        </div>

      </section>

      {/* DETEKSI */}
      <section style={styles.card}>

        <h2 style={styles.heading}>
          Deteksi Pisang
        </h2>

        {/* Upload */}
        <label style={styles.uploadBox}>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            style={{ display: "none" }}
          />

          📸 Upload Gambar Pisang

        </label>

        {/* Preview */}
        {preview && (

          <img
            src={preview}
            alt="preview"
            style={styles.image}
          />

        )}

        {/* Button */}
        <button
          onClick={handleDetect}
          style={styles.button}
        >

          {
            loading
              ? "🤖 AI Sedang Menganalisis..."
              : "Deteksi Kematangan"
          }

        </button>

        {/* RESULT */}
        {result && (

          <div
            style={{
              ...styles.resultBox,
              background: statusColor
            }}
          >

            <h2 style={styles.resultText}>
              {result}
            </h2>

          </div>

        )}

      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>

        Trinity Yellow Team © 2026

      </footer>

    </div>

  );

}

const styles = {

  container: {
    minHeight: "100vh",
    background: "#FFFBEA",
    padding: "20px",
    fontFamily: "Arial"
  },

  hero: {
    textAlign: "center",
    padding: "60px 20px"
  },

  title: {
    fontSize: "55px",
    color: "#E6B800",
    marginBottom: "20px"
  },

  subtitle: {
    maxWidth: "700px",
    margin: "auto",
    color: "#666",
    lineHeight: "1.8",
    fontSize: "18px"
  },

  card: {
    background: "white",
    maxWidth: "950px",
    margin: "30px auto",
    padding: "30px",
    borderRadius: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)"
  },

  heading: {
    color: "#E6B800",
    marginBottom: "20px",
    fontSize: "28px"
  },

  text: {
    color: "#666",
    lineHeight: "1.8"
  },

  list: {
    color: "#555",
    lineHeight: "2"
  },

  techBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(200px,1fr))",
    gap: "15px"
  },

  techItem: {
    background: "#FFF8DC",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#A67C00"
  },

  uploadBox: {
    display: "block",
    border: "2px dashed #E6B800",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    cursor: "pointer",
    background: "#FFF8DC",
    color: "#A67C00",
    fontWeight: "bold"
  },

  image: {
    width: "100%",
    marginTop: "20px",
    borderRadius: "20px",
    maxHeight: "400px",
    objectFit: "cover"
  },

  button: {
    width: "100%",
    marginTop: "20px",
    padding: "15px",
    border: "none",
    borderRadius: "15px",
    background:
      "linear-gradient(to right,#FBC02D,#F57F17)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  resultBox: {
    marginTop: "20px",
    padding: "25px",
    borderRadius: "20px",
    textAlign: "center"
  },

  resultText: {
    color: "white",
    fontSize: "32px",
    fontWeight: "bold"
  },

  footer: {
    textAlign: "center",
    padding: "30px",
    color: "#999"
  }

};

export default App;