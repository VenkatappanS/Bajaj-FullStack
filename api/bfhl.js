export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const FULL_NAME = "venkatappan_s";
  const DOB = "24032005";
  const EMAIL = "venkatappan.s0222@vitstudent.ac.in";
  const ROLL_NUMBER = "22BKT0071";
  const user_id = `${FULL_NAME}_${DOB}`;

  if (req.method === "GET") {
    return res.status(200).json({
      is_success: true,
      user_id,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
    });
  }

  if (req.method === "POST") {
    try {
      const { data } = req.body ?? {};

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

  res.setHeader("Allow", "GET, POST, OPTIONS");
  return res.status(405).json({ is_success: false, error: "Method Not Allowed" });
}
