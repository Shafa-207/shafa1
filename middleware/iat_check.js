export const iat_check = (req, res, next) => {
  const time_iat = req.user.iat;
  const time_now = Math.floor(Date.now() / 1000);
  const time_diff = time_now - time_iat;

  if (time_diff > 3) {
    return res.status(403).json({
      success: false,
      message: "Token ini sudah kadaluarsa!",
    });
  }

  next();
};
