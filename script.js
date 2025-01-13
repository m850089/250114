const API_KEY = "AIzaSyDF188-GKR9m--EI0tHuzgfq6kshosjSfM";
const box1 = document.getElementById("box1");
const box3 = document.getElementById("box3");

const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");

// Function to speak text
const speakText = (text, lang = "zh-TW") => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
};

// Speech-to-Text with error handling
button3.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "zh-TW"; // Traditional Chinese
  recognition.interimResults = false;

  recognition.start();
  recognition.onstart = () => {
    console.log("Speech recognition started. Speak into the microphone.");
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    box3.value = speechResult; // Display collected text in Box 3
  };

  recognition.onspeechend = () => {
    recognition.stop();
    console.log("Speech recognition stopped.");
  };

  recognition.onerror = (event) => {
    let errorMessage = "Speech recognition error";
    if (event.error === "no-speech") {
      errorMessage = "No speech detected. Please try again.";
    } else if (event.error === "audio-capture") {
      errorMessage = "No microphone detected. Please ensure your microphone is connected.";
    } else if (event.error === "not-allowed") {
      errorMessage = "Microphone access denied. Please allow access to the microphone.";
    }
    alert(errorMessage);
  };
});

// Handle command input and response
button4.addEventListener("click", async () => {
  const userCommand = box3.value.trim(); // Use text in Box 3

  if (!userCommand) {
    alert("Please provide input in Box 3.");
    return;
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: userCommand,
          target: "zh-TW", // Translate to Traditional Chinese
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error.message}`);
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;

    // Update Box 1 with the translated text and speak it
    box1.value = translatedText;
    speakText(translatedText, "zh-TW");
  } catch (error) {
    console.error("Translation Service Error:", error.message);
    alert("Error with translation service: " + error.message);
  }
});
