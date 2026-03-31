const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: "AIzaSyACso1qGJj1X2wkdFhv7SQYOB7ZWTOHB50",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function run() {
  try {
    const res = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [{ role: "user", content: "Hello" }]
    });
    console.log(res.choices[0].message.content);
  } catch (e) {
    console.error(e.message);
  }
}
run();
