import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 100vh;
  width: 100%;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Payment() {
  //   const url = "https://www.shafalk.web.id/user/";
  const url = "http://localhost:5000/api/payment/";

  const [post, setPost] = useState({
    amount: "",
    first_name: "",
    email: "",
  });

  const [status, setStatus] = useState();

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}create`, {
        amount: post.amount,
        first_name: post.first_name,
        email: post.email,
      });
      //   console.log(response.data);
      //   alert("Berhasil bayar!");
      //   window.location.href = response.data.redirect_url;
      // Ambil token dari backend
      const token = response.data.token;

      if (!token) {
        return alert(
          "Token tidak ditemukan! Pastikan backend mengirim 'token'",
        );
      }

      // GANTI window.location.href JADI INI:
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* Terpanggil saat pembayaran lunas */
          console.log("Success:", result);
          alert("Pembayaran Berhasil!");
        },
        onPending: function (result) {
          /* Terpanggil saat user dpt kode bayar (VA/Alfamart) tapi belum transfer */
          console.log("Pending:", result);
          alert("Segera selesaikan pembayaranmu!");
        },
        onError: function (result) {
          /* Terpanggil jika ada error teknis */
          console.log("Error:", result);
          alert("Pembayaran Gagal!");
        },
        onClose: function () {
          /* Terpanggil saat user klik tombol 'X' pada popup */
          alert("Kamu menutup jendela pembayaran sebelum selesai.");
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Gagal bayar!");
    }
  };

  const cekStatus = async (e) => {
    e.preventDefault();
  };

  return (
    <Container>
      <div>Register Page</div>
      <Form onSubmit={handlePayment}>
        <input
          type="number"
          placeholder="Amount"
          value={post.amount}
          onChange={(e) => setPost({ ...post, amount: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name"
          value={post.first_name}
          onChange={(e) => setPost({ ...post, first_name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={post.email}
          onChange={(e) => setPost({ ...post, email: e.target.value })}
        />

        {/* 2. Teks tombol utama berubah otomatis */}
        <button type="submit">Bayar</button>
      </Form>
      {/* 3. Tombol saklar untuk pindah mode */}
      <button onClick={() => setStatus(!status)}> Cek Status</button>
    </Container>
  );
}
