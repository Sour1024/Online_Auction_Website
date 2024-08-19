import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"], 
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017", { dbName: "Auction_DB" })
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err.message);
  });

  const jwtSecret = "your_secret_key";
const upload = multer();

const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' }); 
}

const auctionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true,min:1 },
  imageData: { type: Buffer, required: true },
  createdAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    
  },
});

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema); 

const Auction = mongoose.model("auctions", auctionSchema);


app.post("/api/auctions", upload.single("image"), async (req, res) => {
  const { name, description, price } = req.body;
  const imageData = req.file.buffer; 

  try {
    const newAuction = await Auction.create({
      name,
      description,
      price,
      imageData,
    });
    res.status(201).json(newAuction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const result = await User.findOne({ userName });
    if (result) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "server error" });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id); 
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



app.put("/api/auctions/:id", async (req, res) => {
  try {
    const auctionId = req.params.id;
    console.log(auctionId);
    const updatedPrice = req.body.price;
    const result = await Auction.updateOne(
      { _id: auctionId },
      { $set: { price: updatedPrice } }
    ); 
    res.send(result);
  } catch (error) {
   
    console.error(error);
    res.status(500).send("An error occurred while fetching the auction.");
  }
});


app.get("/api/auctions", async (req, res) => {
  try {
    const auctions = await Auction.find();
    const auctionsWithImages = auctions.map((auction) => ({
      _id: auction._id,
      name: auction.name,
      description: auction.description,
      price: auction.price,
      imageData: auction.imageData.toString("base64"),
    }));
    res.json(auctionsWithImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
