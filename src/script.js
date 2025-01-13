const custom = document.querySelector("input[type='checkbox']#custom-short-url");
const inputId = document.querySelector("input#id");
const buttonRefresh = document.querySelector("#button-refresh");
const valueTypes = document.querySelectorAll("input[name='value_type']");
const inputValueDiv = document.querySelector("div#input-value");
const listValues = document.querySelector("div#list-values");
const submitButton = document.querySelector("button#submit");
const errorMessage = document.querySelector("#error-message");

let type = "string";
let typingTimer;

custom.addEventListener("change", (e) => {
  inputId.disabled = !custom.checked;

  if (custom.checked) {
    buttonRefresh.classList.add("hide");
    inputId.classList.remove("sm:mr-3", "mr-0");
  } else {
    buttonRefresh.classList.remove("hide");
    inputId.classList.add("sm:mr-3", "mr-0");
  }
});

const checkId = () => {
  fetch(`./${inputId.value}`, { headers: { 'Content-Type': 'application/json', } }).then(x => x.json()).then(() => errorMessage.classList.remove("hide")).catch(() => errorMessage.classList.add("hide"))
}

const getId = () => {
  fetch('./?random', { headers: { 'Content-Type': 'application/json' } }).then(x => x.json()).then(x => inputId.value = x);
}

buttonRefresh.addEventListener("click", getId);

inputId.addEventListener("keyup", (e) => {
  clearTimeout(typingTimer);
  if (inputId.value !== "")
    typingTimer = setTimeout(checkId, 500); // fetch after .5 seconds
});

inputId.addEventListener("keydown", () => clearTimeout(typingTimer));

for (const input of Array.from(valueTypes)) {
  input.addEventListener("change", (e) => {
    type = e.target.id;
    switch (e.target.id) {
      case "string":
        genInputString();
        break;
      case "map":
        genInputMap();
        break;
      case "list":
        genInputList();
    }
  });
}

const clear = () => {
  inputValueDiv.innerHTML = "";
  listValues.innerHTML = "";

  listValues.className = "col-span-5";
}

const genInputString = () => {
  clear();
  inputValueDiv.classList.remove("flex", "mb-2");
  const input = document.createElement("input");
  input.classList.add(
    "sm:p-2",
    "p-1",
    "mb-2",
    "border",
    "focus:outline-violet-700",
    "disabled:bg-slate-200",
    "focus:shadow-outline",
    "border-violet-300",
    "w-full",
    "h-7",
    "h-10",
    "rounded-lg",
  );
  input.id = "dest";
  input.value = "";
  input.setAttribute("placeholder", "destination url...");
  input.setAttribute("type", "text");
  input.setAttribute("name", "id");
  input.addEventListener("keyup", e => { if (e.key == "Enter") {
    handleSubmit();
  }})

  inputValueDiv.appendChild(input);
};
const genInputList = () => {
  clear();
  inputValueDiv.classList.add("flex", "mb-2");
  const input = document.createElement("input");
  const btn = document.createElement("button");
  input.classList.add(
    "sm:p-2",
    "p-1",
    "grow",
    "mr-0",
    "sm:mr-3",
    "border",
    "focus:outline-violet-700",
    "disabled:bg-slate-200",
    "focus:shadow-outline",
    "border-violet-300",
    "w-full",
    "h-7",
    "sm:h-10",
    "rounded-lg",
  );

  input.id = "id";
  input.value = "";
  input.addEventListener("keyup", e => { if (e.key == "Enter") {
    addToList(e.target.value, [e.target]);
  }});
  input.setAttribute("placeholder", "destination url...");
  input.setAttribute("type", "text");
  input.setAttribute("name", "id");
  btn.addEventListener("click", () => { addToList(input.value, [e.target]); });
  btn.id = "add";
  btn.classList.add(
    "shrink",
    "text-xl",
    "sm:text-3xl",
    "text-slate-900",
    "hover:text-violet-600",
    "active:text-slate-200",
  );
  btn.innerHTML = `<i class='bx bx-plus m-auto' ></i>`;
  inputValueDiv.appendChild(input);
  inputValueDiv.appendChild(btn);
};
const genInputMap = () => {
  const keys = [];
  clear();
  inputValueDiv.classList.add("flex", "mb-2");
  const div = document.createElement("div");
  const btn = document.createElement("button");
  const input1 = document.createElement("input");
  const input2 = document.createElement("input");

  div.classList.add("grow", "grid", "gap-2", "sm:gap-1", "grid-cols-4", "mr-0", "sm:mr-3");
  btn.id = "add";
  btn.classList.add(
    "shrink",
    "text-xl",
    "sm:text-3xl",
    "text-slate-900",
    "hover:text-violet-600",
    "active:text-slate-200",
  );

  input1.classList.add("col-span-2", "sm:col-span-1", "p-1", "sm:p-2", "border", "focus:outline-violet-700", "disabled:bg-slate-200", "focus:shadow-outline", "border-violet-300", "h-7", "sm:h-10", "rounded-lg");
  input1.setAttribute("type", "text");
  input1.setAttribute("name", "id");
  input1.setAttribute("maxlength", "7");
  input1.setAttribute("placeholder", "key...");

  input2.classList.add("col-span-2", "sm:col-span-3", "p-1", "sm:p-2", "border", "focus:outline-violet-700", "disabled:bg-slate-200", "focus:shadow-outline", "border-violet-300", "h-7", "sm:h-10", "rounded-lg");
  input2.setAttribute("type", "text");
  input2.setAttribute("name", "dest");
  input2.setAttribute("placeholder", "destination url...");

  div.appendChild(input1);
  div.appendChild(input2);

  btn.innerHTML = `<i class='bx bx-plus m-auto' ></i>`;

  const handler = () => {
    if (input1.value == "" || input2.value == "")
      return;
    const obj = {};
    obj[input1.value] = input2.value;

    if (keys.includes(input1.value)) {
      Swal.fire({
        icon: "info",
        text: "key already taken",
      });

      return;
    }

    keys.push(input1.value);

    addToList(obj, [input1, input2]);
  };
  btn.addEventListener("click", handler);

  input2.addEventListener("keyup", (e) => {
    if (e.key === "Enter")
      handler();
  });

  inputValueDiv.appendChild(div);
  inputValueDiv.appendChild(btn);
};

/**
 *
 * @param { string | Record<string, string> } value
 * @param { any[] } elems
 */
const addToList = (value, elems) => {
  const id = typeof value === "string" ? ("" + (new Date).getTime()) : Object.keys(value)[0];
  const v = typeof value === "string" ? value : value[id];

  if (v == "" || !isValidUrl(v)) return;
  
  // El is the super container
  const el = document.createElement("div");
  listValues.classList.add("rounded-lg", "border", "border-violet-300");
  el.classList.add("text-sm", "sm:text-xl", "border", "border-violet-200", "p-1", "flex", "flex-row", "justify-between", "items-center");
  el.id = id;
  
  // Value.
  if (typeof value === "string") {
    const span = document.createElement("span");
    span.classList.add("basis-10/12");
    span.innerText = v;
    el.appendChild(span);
  } else {
    const div = document.createElement("div");
    div.classList.add("basis-10/12");
    div.innerHTML = `
      ${v}<span class="text-xs hidden sm:inline px-1 ml-2 rounded-lg bg-slate-300">${id}</span>
    `;
    el.appendChild(div);
  }

  // button have two action
  const buttons = document.createElement("div");
  buttons.classList.add("basis-2/12", "md:basis-1/12", "flex", "justify-around", "items-center");

  // first is for delete
  const delbut = document.createElement("button");
  delbut.innerHTML = `<i class='bx bxs-trash-alt hover:text-red-500 active:text-red-800' ></i>`;

  // seccond is drag button
  const dragbut = document.createElement("button");
  dragbut.classList.add("drag", "hidden", "sm:block");
  dragbut.innerHTML = `<i class='bx bx-menu'></i>`;

   // when delete button is clicked, it will be remove the super div / super container
  delbut.addEventListener("click", () => {
    el.remove();
    if (!listValues.hasChildNodes()) { // this will remove the border and padding rather than changing it to display none
      listValues.classList.remove("rounded-lg", "border", "border-violet-300");
    }
  });

  buttons.appendChild(delbut);
  buttons.appendChild(dragbut);

  el.appendChild(buttons);

  listValues.appendChild(el);

  new Sortable(listValues, {
    handle: '.drag',
    animation: 150
  });

  elems.forEach(e => e.value = "");
};

/** @param { string } url */
const isValidUrl = (url) => {
  try {
    const tmpUrl = new URL(url);
    if (["http:", "https"].includes(tmpUrl.protocol))
      throw new Error("");
  } catch (_) {
    Swal.fire({
      title: "Error!!!",
      icon: "error",
      text: "Url not valid",
    });
    return false;
  }

  return true;
};

function handleSubmit() {
  /** @type { string | string[] | Record<string, string> } */
  const value =
    type === "string" ?
      document.querySelector("input#dest").value
    : type === "list" ?
      Array.from(document.querySelectorAll("#list-values > div > span")).map(x => x.textContent)
    :
      Object.assign({}, ...Array.from(document.querySelectorAll("#list-values > div > div")).map(x => {
        const obj = {};
        const key = x.querySelector("span");
        if (!key) return "";
        obj[key.textContent] = Array.from(x.childNodes).filter(x => x.nodeType == Node.TEXT_NODE).map(x => x.textContent).join("").trim();
        return obj
      }).filter(x => x != ""));
  
  // if empty value
  if (
    (inputId.value === "") ||
    (typeof value === 'string' && value === "") ||
    (Array.isArray(value) && value.length == 0) ||
    (typeof value !== 'string' && Object.keys(value).length == 0)
  ) {
    Swal.fire({
      icon: 'info',
      text: 'Otaknya dipake',
    });

    return;
  }

  if (typeof value === 'string')
    if (!isValidUrl(value)) return;
    else document.querySelector("input#dest").value = "";

  const body = {
    to: value,
    from: inputId.value,
  };

  console.log(body);

  fetch("./", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((x) => {
      if (x.ok) return x.json();
      throw new Error("");
    })
    .then((x) => {
      console.log(x);
      Swal.fire({
        icon: "success",
        text: "Short Link Created Successfully"
      });
    })
    .catch((x) => console.log(x));
}

submitButton.addEventListener("click", handleSubmit);

valueTypes[0].checked = true;
genInputString();
getId();
