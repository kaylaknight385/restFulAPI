const mongoose = require('mongoose');

// my function that will handle connecting to the database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // if we get here, the connection was successful!
    console.log('omg mongodb connected successfully');
  } catch (error) {
    // if something goes wrong, catch the error and log it
    console.error('Womp womp mongodb connection failed:', error.message);
    
    // exit the process since we can't run the app without a database
    process.exit(1);
  }
};

// export this function so server.js can use it
module.exports = connectDB;
