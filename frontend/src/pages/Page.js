import TrackCard from "../MyComponents/TrackCard";
import styled from "styled-components";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100vh;
  justify-content: flex-start;
`;

export default function Page(props) {
  // const url = "https://www.raquella.web.id/notes/";
  const { uri } = props;
  const url = uri;

  // 1. Taruh semua State di atas
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [editId, setEditId] = useState(null); // Menyimpan ID data yang akan di-update

  // 2. Fungsi Ambil Data (GET)
  useEffect(() => {
    const ambilData = async () => {
      try {
        const response = await axios.get(url);
        setPosts(response.data);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    };
    ambilData();
  }, [uri]);

  // 3. Fungsi Tambah Data (POST)
  const simpanData = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // MODE PUT (UPDATE)
        const response = await axios.put(`${url}${editId}`, newPost);
        setPosts(
          posts.map((item) => (item._id === editId ? response.data : item)),
        );
        setEditId(null); // Selesai edit
      } else {
        // MODE POST (CREATE)
        const response = await axios.post(url, newPost);
        setPosts([response.data, ...posts]);
      }

      setNewPost({ title: "", content: "", author: "" });
      alert(editId ? "Data diupdate!" : "Data ditambah!");
    } catch (err) {
      console.error("Gagal simpan:", err);
    }
  };

  const hapusData = async (id) => {
    if (window.confirm("Yakin mau hapus catatan ini?")) {
      try {
        await axios.delete(`${url}${id}`);
        // Filter state supaya data yang dihapus langsung hilang dari layar
        setPosts(posts.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Gagal hapus:", err);
      }
    }
  };
  const handleEdit = (item) => {
    setEditId(item._id); // Tandai bahwa kita sedang mengedit ID ini
    setNewPost({
      title: item.title,
      content: item.content,
      author: item.author,
    });
    window.scrollTo(0, 0); // Opsional: Scroll ke atas supaya form kelihatan
  };

  return (
    <Container>
      {/* Form Input Baru */}
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
      {/* 3. Looping data posts */}
      {posts.length > 0 ? (
        posts.map((item) => (
          // Gunakan pembungkus (div) dan pindahkan key ke sini
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
}
