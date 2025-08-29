export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res
      .status(405)
      .json({ is_success: false, error: "Method Not Allowed" });
  }

  try {
    const { data } = req.body ?? {};

    const FULL_NAME = (process.env.FULL_NAME || "john_doe").toLowerCase();
    const DOB = process.env.DOB_DDMMYYYY || "01011970";
    const EMAIL = process.env.EMAIL || "john@xyz.com";
    const ROLL_NUMBER = process.env.ROLL_NUMBER || "ABCD123";
    const user_id = `${FULL_NAME}_${DOB}`;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        user_id,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        error: "Invalid input: data must be an array",
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = []; 
    const special_characters = [];

    let sum = 0;
    let lettersConcat = "";

    for (const raw of data) {
      const item = String(raw);

      if (/^-?\d+$/.test(item)) {
        const num = parseInt(item, 10);
        if (num % 2 === 0) even_numbers.push(item);
        else odd_numbers.push(item);
        sum += num;
        continue;
      }

      if (/^[A-Za-z]+$/.test(item)) {
        alphabets.push(item.toUpperCase());
        lettersConcat += item.replace(/[^A-Za-z]/g, "");
        continue;
      }

      special_characters.push(item);

      const onlyLetters = item.match(/[A-Za-z]/g);
      if (onlyLetters) lettersConcat += onlyLetters.join("");
    }

    const concat_string = lettersConcat
      .split("")
      .reverse()
      .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");

    return res.status(200).json({
      is_success: true,
      user_id,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum), 
      concat_string,
    });
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      error: err?.message ?? "Server error",
    });
  }
}
