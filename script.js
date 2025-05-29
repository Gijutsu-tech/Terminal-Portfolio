let screen = document.getElementById("terminal");
var cmd = document.getElementsByClassName("cmd")[0];
let value, divName, text;
let history = [];
let historyIndex;
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
        console.log((pwd));
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
                    console.log(path);
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
        divName = "pokedex";
        if (args.length != 1) {
            createDiv(divName, `psh: invalid number of args (${args.length})`);
            return;
        }
        let pokemon = args[0].trim();
        const url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
        console.log(pokemon);
        console.log(url);
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
    help: (args) => {
        divName = 'help';
        text = "Available commands: " + Object.keys(commands).join(", ");
        createDiv(divName, text);
    },
    // Adding more in future like:
    // whoami, cat, touch, etc
};


let handleKeyPress = (e) => {
    // keyPress.play();
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
            }
        }
        history.push(value.trim());
        historyIndex = (history.length);
    };
    if (e.key === "ArrowUp") {
        if (historyIndex >= 1) {
            historyIndex -= 1;
            e.target.value = history[historyIndex];
        }
    }
    if (e.key === "ArrowDown") {
        if (historyIndex < (history.length) - 1) {
            historyIndex += 1;
            e.target.value = history[historyIndex];
        }
        else {
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
        // console.log(`${e.clientX - 150}px ${e.clientY - 150}px`);
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