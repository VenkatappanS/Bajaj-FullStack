import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config(); 
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.post("/bfhl", (req, res) => {
  try {
    const { FULL_NAME, DOB_DDMMYYYY, EMAIL, ROLL_NUMBER } = process.env;
    const user_id = `${FULL_NAME}_${DOB_DDMMYYYY}`;

    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        user_id,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        error: "Invalid input: data must be an array"
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];

    let sum = 0;
    let alphaConcat = "";

    data.forEach((item) => {
      if (/^-?\d+$/.test(item)) {
        const num = parseInt(item, 10);
        if (num % 2 === 0) {
          even_numbers.push(item);
        } else {
          odd_numbers.push(item);
        }
        sum += num;
      } else if (/^[a-zA-Z]+$/.test(item)) {
        alphabets.push(item.toUpperCase());
        alphaConcat += item;
      } else {
        special_characters.push(item);
      }
    });

    const concat_string = alphaConcat
      .split("")
      .reverse()
      .map((ch, idx) =>
        idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()
      )
      .join("");

    res.status(200).json({
      is_success: true,
      user_id,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    res.status(500).json({
      is_success: false,
      error: err.message
    });
  }
});


app.get("/", (req, res) => {
  res.send("BFHL API is running ");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
