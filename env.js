const mode = 'dev';
const dev = {
  url: 'http://10.0.2.2:8000',
  razorpay: 'rzp_test_yoyoiR1jrrSMMg',
};
const prod = {
  url: 'https://admin.peatt.in',
  razorpay: 'rzp_test_yoyoiR1jrrSMMg',
};
export const HOST = mode === 'dev' ? dev.url : prod.url;
export const PAYMENT_KEY = mode === 'dev' ? dev.razorpay : prod.razorpay;
