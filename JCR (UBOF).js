* * * block
*##+js(document-start, function() {
  // Function to create the UI
  function createUI() {
    const container = document.createElement("div");
    container.id = "js-code-runner";
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.backgroundColor = "#fff";
    container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    container.style.borderRadius = "10px";
    container.style.padding = "20px";
    container.style.maxWidth = "500px";
    container.style.width = "90%";
    container.style.zIndex = "1000";
    container.innerHTML = `
      <div id="popup">
        <h1 style="text-align: center;">JavaScript Code Runner</h1>
        <textarea id="code-editor" style="width: 100%; height: 100px; margin-bottom: 10px;" placeholder="Enter your JavaScript code here"></textarea>
        <div id="saved-scripts">
          <h2>Saved Scripts</h2>
          <input id="script-title" type="text" placeholder="Title your script">
          <ul id="script-list" style="list-style: none; padding: 0;"></ul>
        </div>
        <div id="buttons">
          <button id="execute-button" style="background-color: #4CAF50; color: white; border: none; padding: 10px; cursor: pointer;">Execute</button>
          <button id="save-button" style="background-color: #008CBA; color: white; border: none; padding: 10px; cursor: pointer; margin-left: 10px;">Save</button>
          <button id="clear-button" style="background-color: #f44336; color: white; border: none; padding: 10px; cursor: pointer; margin-left: 10px;">Clear</button>
          <button id="close-button" style="background-color: #555555; color: white; border: none; padding: 10px; cursor: pointer; position: absolute; top: 10px; right: 10px;">X</button>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  // Function to save scripts to local storage
  function saveScript(title, code) {
    const maxCodeLength = 50; // Set your maximum code length here
    if (code.length > maxCodeLength) {
      // Truncate the code if it exceeds the character limit
      code = code.substring(0, maxCodeLength - 3) + "...";
    }
    let scripts = JSON.parse(localStorage.getItem("savedScripts")) || [];
    scripts.push({ title, code });
    localStorage.setItem("savedScripts", JSON.stringify(scripts));
  }

  // Function to load saved scripts from local storage
  function loadScripts() {
    const scriptList = document.getElementById("script-list");
    scriptList.innerHTML = "";
    const scripts = JSON.parse(localStorage.getItem("savedScripts")) || [];
    scripts.forEach(({ title, code }, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = '<strong>' + title + ':</strong> <span>' + code + '</span>';

      // Create a run button for each saved script
      const runButton = document.createElement("button");
      runButton.textContent = "Run";
      runButton.style.backgroundColor = "#4CAF50";
      runButton.style.color = "white";
      runButton.style.border = "none";
      runButton.style.padding = "5px 10px";
      runButton.style.marginLeft = "10px";
      runButton.style.cursor = "pointer";
      runButton.addEventListener("click", function() {
        try {
          eval(code);
        } catch (error) {
          console.error(error);
        }
      });

      // Create a delete button for each saved script
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.backgroundColor = "#f44336";
      deleteButton.style.color = "white";
      deleteButton.style.border = "none";
      deleteButton.style.padding = "5px 10px";
      deleteButton.style.marginLeft = "10px";
      deleteButton.style.cursor = "pointer";
      deleteButton.addEventListener("click", function() {
        scripts.splice(index, 1);
        localStorage.setItem("savedScripts", JSON.stringify(scripts));
        loadScripts();
      });

      listItem.appendChild(runButton);
      listItem.appendChild(deleteButton);
      scriptList.appendChild(listItem);
    });
  }

  // Function to initialize the UI
  function init() {
    createUI();
    loadScripts();

    const codeEditor = document.getElementById("code-editor");
    const executeButton = document.getElementById("execute-button");
    const saveButton = document.getElementById("save-button");
    const clearButton = document.getElementById("clear-button");
    const closeButton = document.getElementById("close-button");
    const scriptTitleInput = document.getElementById("script-title");

    executeButton.addEventListener("click", function() {
      try {
        const code = codeEditor.value;
        eval(code);
      } catch (error) {
        console.error(error);
      }
    });

    saveButton.addEventListener("click", function() {
      const title = scriptTitleInput.value;
      const code = codeEditor.value;
      saveScript(title, code);
      loadScripts();
      codeEditor.value = "";
      scriptTitleInput.value = "";
    });

    clearButton.addEventListener("click", function() {
      codeEditor.value = "";
      scriptTitleInput.value = "";
    });

    closeButton.addEventListener("click", function() {
      const container = document.getElementById("js-code-runner");
      container.parentNode.removeChild(container);
    });
  }

  // Call the init function to create the UI
  init();
});
