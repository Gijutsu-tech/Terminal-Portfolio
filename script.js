let screen = document.getElementById("terminal");
var cmd = document.getElementsByClassName("cmd")[0];
let value, divName, text;
const keyPress = new Audio('./Media/key-press.mp3');
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
    help: (args) => {
        divName = 'help';
        text = "Available commands: " + Object.keys(commands).join(", ");
        createDiv(divName, text);
    }
    // Add more like:
    // whoami, cat, touch, etc
};

let handleKeyPress = (e) => {
    // keyPress.play();
    if (e.key === "Enter") {
        if (!e.target.value) {
            
        }
        else {
            value = e.target.value;
            let cmdArr = value.trim().split(/\s+/); // Array of cmdKey and args
            let cmdKey = cmdArr[0].toLowerCase();
            let cmdArgs = cmdArr.slice(1);
            let command = commands[cmdKey];
    
            if (command) {
                command(cmdArgs); // Run the command with its args
            } 
            else {
                let divName = 'err';
                createDiv(divName, `psh: command not found: ${value}`)
            }
        }

        createLine();
    };
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