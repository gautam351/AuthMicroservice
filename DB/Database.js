const mongoose = require('mongoose');

class Database {
  static _instance=null;
  static _connected=false;
  
  constructor() {
    if (Database._instance) {
      return Database._instance;
    }

    this._connected = false;
    this.#connect();
    Database._instance = this;
  }

  async #connect() {
    
    
    if (this._connected) {
      console.log('🔁 Using existing MongoDB connection');
      return;
    }

    try {
      await mongoose.connect(process.env.MONGO_URI?.toString(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this._connected = true;
      console.log('✅ MongoDB Atlas Connected');
    } catch (error) {
    

      console.error('❌ MongoDB connection error:', error.message);
      process.exit(1);
    }
  }
}

const dbInstance = new Database();
module.exports = dbInstance;
