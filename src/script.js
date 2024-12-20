const checkbox = document.querySelector("input[type='checkbox']");
const inputFrom = document.querySelector("#from");
const inputTo = document.querySelector("#to");
checkbox.addEventListener('change', e => {
  if (e.target.checked)
    inputFrom.removeAttribute('disabled');
  else
    inputFrom.setAttribute('disabled', '');
});
document.querySelector("button").addEventListener("click", handleSubmit);
inputFrom.addEventListener("keypress", (e) => e.key === 'Enter' && handleSubmit());
inputTo.addEventListener("keypress", (e) => e.key === 'Enter' && handleSubmit());

function handleSubmit() {
  if (inputTo.value == "" || (checkbox.checked && inputFrom.value == "")) {
    alert("Harap isi semua");
    return;
  }
  try {
    const tmpUrl = new URL(inputTo.value);
    if (tmpUrl.protocol != "http:" && tmpUrl.protocol != "https:")
      throw new Error('');
  } catch (_) {
    alert("URL tidak valid");
    return;
  }
  fetch("./", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({to: inputTo.value, from: checkbox.checked ? inputFrom.value : null}),
  })
  .then(x => {
    if (x.ok)
      return x.json();
    throw new Error("");
  })
  .then(x => console.log(x))
  .catch(() => alert(inputFrom.value + " is exist"))
}
