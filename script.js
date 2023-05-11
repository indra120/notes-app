const $ = (selector, root = document, type = "single") => root[`querySelector${type === "multiple" ? "All" : ""}`](selector),
  createEl = (tagName) => document.createElement(tagName),
  localData = (method, key, data) => method === "set" ? localStorage.setItem(key, JSON.stringify(data)) : JSON.parse(localStorage.getItem(key)),
  notes = localData("get", "notes");

if (notes) notes.forEach((note) => addNewNote(note));

$("#add").onclick = () => addNewNote();

function addNewNote(text = "") {
  const note = createEl("div");

  note.classList.add("note");
  note.innerHTML = `
    <div class="notes">
      <div class="tools">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
      </div>
      <div class="main ${text ? "" : "hidden"}"></div>
      <textarea class="${text ? "hidden" : ""}"></textarea>
    </div>
  `;

  const main = $(".main", note), textArea = $("textarea", note);

  textArea.value = text;
  main.innerHTML = marked(text);

  $(".edit", note).onclick = () => {
    main.classList.toggle("hidden");
    textArea.classList.toggle("hidden");
  };

  $(".delete", note).onclick = () => {
    note.remove();
    updateLS();
  };

  textArea.oninput = (e) => {
    main.innerHTML = marked(e.target.value);
    updateLS();
  };

  document.body.appendChild(note);
}

function updateLS() {
  const notes = [];
  $("textarea", document, "multiple").forEach((note) => notes.push(note.value));
  localData("set", "notes", notes);
}
