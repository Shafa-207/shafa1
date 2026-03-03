import TrackCard from "../MyComponents/TrackCard";
import styled from "styled-components";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100vh;
  justify-content: flex-start;
  & > :first-child {
    align-self: center;
  }
`;

export default function Page(props) {
  const { uri } = props;
  const url = uri;

  // 1. States
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // EFFECT 1: Cek Login (Proteksi)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Kamu harus login dulu!");
      navigate("/");
    }
  }, [navigate]);

  // EFFECT 2: Ambil Data (GET)
  useEffect(() => {
    const ambilData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        if (err.response?.status === 401) {
          alert("Sesi habis, silakan login lagi");
          navigate("/");
        }
      }
    };

    // Jalankan hanya jika ada token
    if (localStorage.getItem("token")) {
      ambilData();
    }
  }, [url, navigate]);

  // 3. Fungsi Simpan (POST/PUT)
  const simpanData = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editId) {
        const response = await axios.put(`${url}${editId}`, newPost, config);
        setPosts(
          posts.map((item) => (item._id === editId ? response.data : item)),
        );
        setEditId(null);
      } else {
        const response = await axios.post(url, newPost, config);
        setPosts([response.data, ...posts]);
      }
      setNewPost({ title: "", content: "", author: "" });
      alert(editId ? "Data diupdate!" : "Data ditambah!");
    } catch (err) {
      console.error("Gagal simpan:", err);
    }
  };

  // 4. Fungsi Hapus
  const hapusData = async (id) => {
    if (window.confirm("Yakin mau hapus catatan ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${url}${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(posts.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Gagal hapus:", err);
      }
    }
  };

  // 5. Fungsi Edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setNewPost({
      title: item.title,
      content: item.content,
      author: item.author,
    });
    window.scrollTo(0, 0);
  };

  // 6. Logout (Tambahan biar keren)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Container>
      <button
        onClick={handleLogout}
        style={{ alignSelf: "flex-end", margin: "10px" }}
      >
        Logout
      </button>

      <div>Halaman Catatan</div>
      <form
        onSubmit={simpanData}
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        <input
          type="text"
          placeholder="Judul"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Isi Konten"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Penulis"
          value={newPost.author}
          onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          required
        />
        <button type="submit">{editId ? "Update Data" : "Kirim Data"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setNewPost({ title: "", content: "", author: "" });
            }}
          >
            Batal
          </button>
        )}
      </form>

      <hr style={{ width: "100%" }} />

      {posts.length > 0 ? (
        posts.map((item) => (
          <div
            key={item._id}
            style={{ marginBottom: "20px", textAlign: "center" }}
          >
            <TrackCard
              title={item.title}
              content={item.content}
              author={item.author}
              date={new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button
                onClick={() => hapusData(item._id)}
                style={{ color: "red" }}
              >
                Hapus
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Sedang mengambil data atau data kosong...</p>
      )}
    </Container>
  );
} // <--- KURUNG TUTUP KOMPONEN HARUS DI SINI
