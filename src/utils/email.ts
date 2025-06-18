import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOrderConfirmation = async (order: any) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: order.email,
    subject: 'Order Confirmation - NPlusOne',
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${order.id}</p>
      <p>Total: $${order.total}</p>
      <!-- Add more order details -->
    `,
  });
};