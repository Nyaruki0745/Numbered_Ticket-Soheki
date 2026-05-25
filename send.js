const API_URL = "https://script.google.com/macros/s/AKfycbx6aoMZRxUHYpSVyvSvzRdW7mD3BNiQvlDQ1VSowHpNvFXMf6CmaQlb_QkQsWMIqhV3jg/exec";

async function sendData() {

  const data = {
    sheet: "tickets",
    startTime: "600",
    endTime : "750",
    headCount : "2"
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  const json = await res.json();

  console.log(json);
}
