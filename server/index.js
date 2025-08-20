const express = require('express');
const cors = require('cors');
const initDB = require('./config/seed');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swagger/swagger')
const specialityRoutes = require('./routes/specialtyRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const upload = require('./middlewares/upload');


(async () => {
    await initDB();
  })();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/speciality', specialityRoutes);
app.use('/api/v1/role', roleRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use('/api/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));


// Start server
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
 