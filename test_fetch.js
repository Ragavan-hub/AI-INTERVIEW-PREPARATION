async function check() {
  const apiKey = "AIzaSyACso1qGJj1X2wkdFhv7SQYOB7ZWTOHB50";
  const url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  console.log("Checking", url);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gemini-1.5-flash",
        messages: [{ role: "user", content: "Hello" }]
      })
    });
    const text = await res.text();
    console.log(res.status, text);
  } catch(e) { console.error(e); }
}
check();
