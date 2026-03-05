import "dotenv/config"; // 1. Taruh di paling atas
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false, //ubah true kalo sudah live
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY,
});

const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY,
});

//=====================================
//===========BUAT TRANSAKSI===========
//=====================================

export const createTransaction = async (req, res) => {
  try {
    const { amount, first_name, email } = req.body;
    const parameter = {
      transaction_details: {
        order_id: "ORDER" + Date.now(),
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name,
        email,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({
      message: "Transaksi berhasil dibuat",
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.log("Error createTransaction:", error);
    res.status(500).json({ message: "Gagal membuat transaksi" });
  }
};

export const handleNotification = async (req, res) => {
  try {
    const notification = req.body;
    const statusResponse = await coreApi.transaction.notification(notification);

    const order_id = statusResponse.order_id;
    const transaction_status = statusResponse.transaction_status;
    const fraud_status = statusResponse.fraud_status;
    const payment_type = statusResponse.payment_type;

    console.log("Order ID: " + order_id);
    console.log("Transaction Status: " + transaction_status);

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        console.log("Pembayaran Berhasil (Capture)!!");
      }
    } else if (transaction_status === "settlement") {
      console.log("Pembayaran Berhasil (Settlement)!!");
    } else if (transaction_status === "pending") {
      console.log("Menunggu pembayaran!!");
    } else if (
      transaction_status === "deny" ||
      transaction_status === "expire" ||
      transaction_status === "cancel"
    ) {
      console.log("Pembayaran Gagal!!");
    }

    res
      .status(200)
      .json({ message: "Notification handled", status: statusResponse });
  } catch (error) {
    console.log("Error handleNotification:", error);
    res.status(500).json({ message: "Error handling notification" });
  }
};

export const checkStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const statusResponse = await coreApi.transaction.status(orderId);

    res.status(200).json({
      order_id: statusResponse.order_id,
      transaction_status: statusResponse.transaction_status,
      payment_type: statusResponse.payment_type,
      fraud_status: statusResponse.fraud_status,
    });
  } catch (error) {
    console.error("Error checkStatus:", error);
    res.status(500).json({ message: "Gagal cek status transaksi" });
  }
};
