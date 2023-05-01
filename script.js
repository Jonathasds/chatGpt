const inputQuestion = document.getElementById("inputQuestion");
const result = document.getElementById("result");

let resposta = JSON.parse(localStorage.getItem("Chat")) || [];

inputQuestion.addEventListener("keypress", (e) => {
  if (inputQuestion.value && e.key === "Enter") SendQuestion();
});

const OPENAI_API_KEY = "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";

function SendQuestion() {
  var sQuestion = inputQuestion.value;

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: sQuestion,
      max_tokens: 2048, // tamanho da resposta
      temperature: 0.1, // criatividade na resposta
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (result.value) result.value += "\n\n\n ";

      if (json.error?.message) {
        result.value += `Error: ${json.error.message}`;
      } else if (json.choices?.[0].text) {
        var text = json.choices[0].text || "Sem resposta";

        //  salvando no local storange
        resposta.push(text);

        localStorage.setItem("chat", JSON.stringify(resposta));

        result.value += "Chat GPT: " + resposta;
      }

      result.scrollTop = result.scrollHeight;
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      inputQuestion.value = "";
      inputQuestion.disabled = false;
      inputQuestion.focus();
    });

  if (result.value) result.value += " \n";

  result.value += `Eu: ${sQuestion}`;
  inputQuestion.value = "Carregando...";
  inputQuestion.disabled = true;

  result.scrollTop = result.scrollHeight;
}

function limpar() {
  localStorage.removeItem("chat");
}
