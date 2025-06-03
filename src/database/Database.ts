import mongoose from 'mongoose';

class Database {
  private static instance: Database;
  private isConnected = false;
  private constructor() {}
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  public async connect(uri: string): Promise<void> {
    if (this.isConnected) return;
    try {
      let a = await mongoose.connect(uri, {
        autoIndex: true,
      });
      this.isConnected = true;
      console.log('Database is connected!');
    } catch (error) {
      console.error('Database connection error: ', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    await mongoose.disconnect();

    this.isConnected = false;
    console.log('Database is disconnected!');
  }
}

export default Database;
