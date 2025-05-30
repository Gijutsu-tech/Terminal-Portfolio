// Pls someone fix cmdHistory weird behaviour if they can!

let screen = document.getElementById("terminal");
var cmd = document.getElementsByClassName("cmd")[0];
let value, divName, text;
if (localStorage.getItem("cmdHistory") == null) {
    var cmdHistory = [];
}
else {
    var cmdHistory = JSON.parse(localStorage.getItem("cmdHistory") || "[]");
}
if (localStorage.getItem("todoList") == null) {
    var todoList = [];
    var cmdHistoryIndex = 0;
}
else {
    var todoList = JSON.parse(localStorage.getItem("todoList") || "[]");
    var cmdHistoryIndex = cmdHistory.length - 1;
}
const keyPress = new Audio('./Media/key-press.mp3');

let fileSystem = {
    "parth": {
        "notes": {
            "neovim.txt": "Hello, World!",
        },
    },
};

let pwd = fileSystem.parth;
let path = "/parth/";

const commands = {
    about: (args) => {
        createAboutDiv();
    },
    projects: (args) => {
        createProjectsDiv();
    },
    echo: (args) => {
        divName = 'echo';
        text = args.join(" ");
        createDiv(divName, text);
    },
    clear: (args) => {
        screen.innerHTML = "";
        cursorFade();
    },
    ls: (args) => {
        divName = "ls";
        text = Object.keys(pwd).join(" ");
        createDiv(divName, text);
    },
    cd: (args) => {
        divName = "cd";
        let argArr = args[0].split("/");
        let current = fileSystem;
        for (let i = 0; i < argArr.length; i++) {
            if (current[argArr[i]]) {
                if (typeof (current[argArr[i]]) == "object") {
                    current = current[argArr[i]];
                    if (argArr[i] != "parth") {
                        path = path + argArr[i] + '/';
                    }
                    pwd = current;
                }
                else {
                    text = "cd: not a directory: " + argArr[i];
                    createDiv(divName, text);
                    return;
                }

            } else {
                text = "cd: no such file or directory: " + args;
                createDiv(divName, text);
                return;
            }
        }
    },
    pwd: (args) => {
        createDiv("pwd", path);
    },
    pokedex: (args) => {
        console.log("pokedex..");

        divName = "pokedex";
        if (args.length != 1) {
            createDiv(divName, `psh: invalid number of args (${args.length})`);
            return;
        }
        let pokemon = args[0].trim();
        const url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
        return fetch(url)
            .then(response => response.json()) // Convert response to JSON
            .then(data => {

                let spriteContainer = document.createElement("img");
                let spriteUrl = data.sprites.front_default;
                spriteContainer.className = "sprite"
                spriteContainer.src = spriteUrl;
                screen.appendChild(spriteContainer);

                text = "Type: "
                data.types.forEach(typeObj => {
                    const type = typeObj.type.name;
                    text = text + " " + type
                });
                createDiv(divName, text)

                const ability1 = data.abilities[0]?.ability?.name || "N/A";
                const ability2 = data.abilities[1]?.ability?.name || "None";

                createDiv(divName, `Ability: ${ability1}, Hidden Ability: ${ability2}`);

                let BST = 0;

                data.stats.forEach(statObj => {
                    const name = statObj.stat.name;
                    const value = statObj.base_stat;
                    BST += value;
                    text = name.charAt(0).toUpperCase() + name.slice(1) + ":" + value;
                    createDiv(divName, text);
                });
                createDiv(divName, "BST: " + BST);
            })

            .catch(err => {
                createDiv(divName, `psh: error fetching data for '${pokemon}'`);
            });

    },
    todo: (args) => {
        let divName = "todo";
        let todoTask = "";
        if (args[0] == "add") {
            if (args[1] == undefined) {
                createDiv(divName, "psh: No todo specified!");
            }
            else {
                for (let i = 1; i < args.length; i++) {
                    todoTask = todoTask + ' ' + args[i];
                }
                todoTask = todoTask.slice(1);
                todoList.push(todoTask);
                createDiv(divName, "Added todo!: " + todoTask);
                localStorage.setItem("todoList", JSON.stringify(todoList));
            }
        }
        else if (args[0] == "rm") {
            if (args[1] == undefined) {
                createDiv(divName, "psh: No todo specified!");
            }
            else {
                // Get user input and convert it into a string
                for (let i = 1; i < args.length; i++) {
                    todoTask = todoTask + ' ' + args[i];
                }

                // Remove unintentionally added first character, space
                todoTask = todoTask.slice(1);

                // Remove todoTask if it exists
                for (let i = 0; i < todoList.length; i++) {
                    if (todoList[i] == todoTask) {
                        todoList.splice(i, 1);
                        createDiv(divName, "Removed todo!: " + todoTask);
                        localStorage.setItem("todoList", JSON.stringify(todoList));
                        return;
                    }
                }
                createDiv(divName, "psh: No todo named: " + todoTask);
            }
        }
        else if (args[0] == "lst") {
            if (args[1] != undefined) {
                createDiv(divName, "psh: Invalid argument: " + args[1]);
            }
            else {
                createDiv(divName, "Found " + todoList.length + " todos.")
                for (let i = 0; i < todoList.length; i++) {
                    const todoTask = todoList[i];
                    createDiv(divName, i + 1 + ". " + todoTask);
                }
            }
        }
        else {
            text = "psh: Invalid argument! Available actions are: add , rm , lst";
            createDiv(divName, text);
        }
    },
    quote: async (args) => {
        let divName = "quote";
        try {
            const res = await fetch("https://raw.githubusercontent.com/Gijutsu-tech/Programmer-inspiration/main/quotes.json");
            const data = await res.json();
            const quote = data[Math.floor(Math.random() * data.length)];
            let quoteText = document.createElement("div");
            quoteText.innerHTML = `"${quote.text}"`;
            // let quoteText = createDiv("quote", `"${quote.text}"`);
            let quoteAuthor = document.createElement("div");
            quoteAuthor.innerHTML = `— ${quote.author || "Unknown"}`;
            // let quoteAuthor = createDiv("author", `— ${quote.author || "Unknown"}`);
            quoteText.className = "quote";
            quoteAuthor.className = "quote";
            screen.appendChild(quoteText);
            screen.appendChild(quoteAuthor);
        } catch {
            createDiv(divName, "psh: Could not generate quote. Maybe Linus didn't want you to read his quotes.");
        }
    },
    sudo: (args) => {
        return new Promise((resolve) => {
            if (args[0] == 'rm' && args[1] == '-rf' && args[2] == '/') {
                createDiv("terminal", "rm: removing root directory...");
                createDiv("terminal", "rm: Deleting /home ...");
                createDiv("terminal", "rm: Deleting /bin ...");
                createDiv("terminal", "rm: Deleting /boot ...");
                setTimeout(() => {
                    document.body.style.backgroundColor = "black";
                    document.body.innerHTML = "💀";
                    document.body.style.fontSize = "50vh"
                }, 1000);
            } else {
                resolve();
            }
        });
    },
    help: (args) => {
        divName = 'help';
        text = "Available commands: " + Object.keys(commands).join(", ");
        createDiv(divName, text);
    },
    // Adding more in future like:
    // whoami, cat, touch, etc
};


let handleKeyPress = (e) => {
    if (e.key === "Enter") {
        if (!e.target.value) {
        }
        else {
            value = e.target.value;
            let cmdArr = value.trim().split(/\s+/); // Array of cmdKey and cmdArgs
            let cmdKey = cmdArr[0].toLowerCase();
            let cmdArgs = cmdArr.slice(1);
            let command = commands[cmdKey];

            if (command) {
                const result = command(cmdArgs);

                if (result instanceof Promise) {
                    result.then(() => {
                        createLine();
                    });
                } else {
                    createLine();
                }

            }
            else {
                let divName = 'err';
                createDiv(divName, `psh: command not found: ${value}`)
                createLine();
            }
            cmdHistory.push(value.trim());
            cmdHistoryIndex = cmdHistory.length - 1;
            console.log(JSON.stringify(cmdHistory));
            localStorage.setItem("cmdHistory", JSON.stringify(cmdHistory));
        }
    };
    if (e.key === "ArrowUp") {
        if (cmdHistory.length === 0) return;

        if (cmdHistoryIndex > 0) {
            cmdHistoryIndex -= 1;
        }

        e.target.value = cmdHistory[cmdHistoryIndex];
    }

    if (e.key === "ArrowDown") {
        if (cmdHistory.length === 0) return;

        if (cmdHistoryIndex < cmdHistory.length - 1) {
            cmdHistoryIndex += 1;
            e.target.value = cmdHistory[cmdHistoryIndex];
        } else {
            cmdHistoryIndex = cmdHistory.length; // move to "empty" state after last command
            e.target.value = "";
        }
    }
}

cmd.addEventListener("keydown", handleKeyPress);

function createLine() {
    cmd.readOnly = true;
    cmd.removeEventListener("keydown", handleKeyPress);

    let line = document.createElement("div");
    screen.appendChild(line);
    line.className = "line";

    let prompt = document.createElement("div");
    prompt.innerText = "parth@arch:~$";
    line.appendChild(prompt);
    prompt.className = "prompt";

    cmd = document.createElement("input");
    cmd.type = "text";
    cmd.className = "cmd";
    line.appendChild(cmd);

    screen.scrollTop = screen.scrollHeight;

    cmd.addEventListener("keydown", handleKeyPress);

    setTimeout(() => cmd.focus(), 0);
}

// Fade around cursor logic-

function cursorFade() {
    const fadeCursor = document.createElement("div");
    fadeCursor.id = "cursor-fade";
    screen.appendChild(fadeCursor);

    screen.addEventListener('mousemove', (e) => {
        fadeCursor.style.left = `${e.clientX - 150}px`;
        fadeCursor.style.top = `${e.clientY - 150}px`;
    });
}

cursorFade();

// Command functions-

function createDiv(divName, text) {
    divName = document.createElement("div");
    divName.innerHTML = text
    screen.appendChild(divName);
}

function createAboutDiv() {
    divName = 'aboutDiv';
    text = "<h3>Hey there! I'm Parth.</h3><br>A 15-year-old developer who'd rather write C than essays. <br>Arch Linux user 🐧, because I like my system to be just like my code — fully under my control. <br>I occasionally play Minecraft which is my favorite game. <br>Built projects like DiskKnife (a partition manager) and PassMan (a terminal password vault). <br>Have learnt basic web dev, at the age of 12. <br>I dream to become a kernel dev someday (or atleast a low level job lol). <br>Until then, I'm here—building, breaking, and learning. <br>Type `projects` to see what I'm working on!";
    createDiv(divName, text);
}

function createProjectsDiv() {
    divName = "projectsDiv";
    text = "<h3>My projects (In C):</h3> <br><h4>DiskKnife:</h4>A terminal-based partition manager built in C. Supports formatting, mounting-unmounting and even burning ISOs. Inspired by the elegance of UNIX philosophy. <br><h4>PassMan:</h4>A terminal password manager with user authentication. Designed to be minimal, secure(ish 😅), and easy to use. Fully written in C with file-based storage. Planning to add encryption in the next few days. <br><h4>Terminal Tic-Tac-Toe:</h4>A retro-style game made with ANSI escape codes. But don't think it's a beginner project, though. It has a full fledged ui with arrow keys for movement written in raw ANSI.<br><h4>FileMan:</h4> Currently working on this. A basic terminal file manager which navigates through directories using arrow keys and ANSI. Plan to add real world features, soon. <br><br><h4>Upcoming: </h4>- Basic file explorer for terminal <br>- A basic shell in future <br><br>Use `about` to know the human behind the keyboard.";
    createDiv(divName, text);
}

// Focus on click

document.addEventListener("keydown", handleFocus = (e) => {
    // alert("key")
    setTimeout(() => cmd.focus(), 0);
});