const FileSystem = {
    readFile: function (path) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", path, false);
        xhr.send();
        return xhr.responseText;
    },
};

const asciiArt = `

███████╗██╗   ██╗██╗   ██╗ █████╗ ███████╗██╗  ██╗    ████████╗██╗  ██╗ █████╗ ██╗  ██╗██╗   ██╗██████╗ 
██╔════╝██║   ██║╚██╗ ██╔╝██╔══██╗██╔════╝██║  ██║    ╚══██╔══╝██║  ██║██╔══██╗██║ ██╔╝██║   ██║██╔══██╗
███████╗██║   ██║ ╚████╔╝ ███████║███████╗███████║       ██║   ███████║███████║█████╔╝ ██║   ██║██████╔╝
╚════██║██║   ██║  ╚██╔╝  ██╔══██║╚════██║██╔══██║       ██║   ██╔══██║██╔══██║██╔═██╗ ██║   ██║██╔══██╗
███████║╚██████╔╝   ██║   ██║  ██║███████║██║  ██║       ██║   ██║  ██║██║  ██║██║  ██╗╚██████╔╝██║  ██║
╚══════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
                                                                                                        

`;
document.getElementById('ascii-art').innerText = asciiArt;

const output = document.getElementById("output");
const input = document.getElementById("command-input");
const prompt = document.getElementById("prompt");

const technologies = [
    ["JavaScript", "TypeScript", "NodeJS", "Rest API"],
    ["MySQL", "PostgresSQL", "MongoDB", "Redis"],
    ["ElasticSearch", "Websocket", "NGINX", "Docker"],
    ["GIT", "AWS", "Linux", "CI/CD"],
    ["Angular", "HTML", "CSS", "npm"]
];

const commands = [
    {
        name: "help",
        description: "list all available commands",
    },
    {
        name: "about",
        description: "introduction about me",
    },
    {
        name: "skills",
        description: "list of technologies I have worked with",
    },
    {
        name: "contact",
        description: "contact information",
    },
    {
        name: "projects",
        description: "list of projects",
    },
    {
        name: "clear",
        description: "clear the terminal",
  },
  {
    name: "open [link-name]",
    description: "open a link in a new tab",
  },
  {
    name: "links",
    description: "list all the links",
  }
];

const links = {
  "github": "https://github.com/suyash-thakur",
  "linkedin": "https://www.linkedin.com/in/suyash-thakur/",
  "hashnode": "https://suyashthakurblog.hashnode.dev/",
  "twitter": "https://twitter.com/SuyashThakur99",
  "nginx-github": "https://github.com/suyash-thakur/nginx-geoip-cdn-proxy",
  "hashnode-nginx": "https://suyashthakurblog.hashnode.dev/nginxs-routing-and-proxy-caching",
  "github-issues": "https://github.com/suyash-thakur/js-good-first-issues-finder",
  "website-issues": "https:://suyash-thakur.github.io/js-good-first-issues-finder",
};

const commandHistory = [];
let commandHistoryIndex = 0;


function autoCompleteCommand(command) {
  const commandName = command.split(" ")[0];
  const commandArgs = Object.keys(links).find((link) => link.startsWith(command.split(" ")[1]));
  const commandList = commands.map((command) => command.name);
  const filteredCommands = commandList.filter((command) => command.startsWith(commandName));
  let autoCompleteCommand = command;
  if (filteredCommands.length === 1) {
    autoCompleteCommand = filteredCommands[0].split(" ")[0];
  }
  if (filteredCommands?.length === 1 && commandArgs) {
      autoCompleteCommand = autoCompleteCommand +" "+commandArgs;
  }
  return autoCompleteCommand;
}


const commandFunctions = {
    help: function () {
        let helpText = "commands: <br> <br>";
        commands.forEach((command) => {
            helpText += `${command.name} - ${command.description} <br>`;
        });
        return helpText;
    },
    about: function () {
        // Read about section from about.html
        // return aboutText;
        const aboutText = FileSystem.readFile("commands/about.html");
        return aboutText;
  },
  projects: function () {
    // Read about section from about.html
    // return aboutText;
    const project = FileSystem.readFile("commands/project.html");
    return project;
  },
  contact: function () {
    // Read about section from about.html
    // return aboutText;
    const contact = FileSystem.readFile("commands/contact.html");
    return contact;
  },
    skills: function () {
        // Create a table of technologies
        const { table, maxCellLength } = createTable(technologies);
        const containerWidth = maxCellLength * technologies[0].length * 10 + 20;
        const tableContainer = `<div style="width:${containerWidth}px" class="text-green"> <pre>${table}</pre> </div>`;
        return tableContainer;
    },
  open: function (command) {
    console.log(command);

      const linkName = command.split(" ")[1];
      if (links[linkName]) {
        window.open(links[linkName], "_blank");
        return `Opening ${linkName} in a new tab`;
      } else {
        return `<span class="text-red">Invalid link name: ${linkName}</span>`;
      }
  },
  links: function () {
    let list = "";
    for (const linkName in links) {
      list += `${linkName} <br>`;
    }
    list += `<br><span class="text-orange">Type "open <span class="text-pink">[link-name]</span>" to open a link in a new tab</span>`;
    return list;
  },
};

const postRenderFunctions = {
  projects: function () {
    const outputProjects = document.getElementsByClassName("output-project");
    for (const outputProject of outputProjects) {
      outputProject.appendChild(document.createTextNode('---'.repeat(40)));
      outputProject.prepend(document.createTextNode('---'.repeat(40)));
    }
   }
};

output.innerHTML += "Type <span class='text-green'>help</span> for a list of commands. <br /> <br />";
input.focus();  
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    commandHistory.push(input.value);
      const command = input.value.trim().split(" ")[0];
      const commandArgs = input.value.trim().split(" ")[1];
      input.value = "";
      output.innerHTML += `${prompt.innerHTML}${command} ${commandArgs || ''}<br /> <br />`;
        if (commandFunctions[command]) {
          output.innerHTML += commandFunctions[command](`${command} ${commandArgs}`) + "<br />";
          if (postRenderFunctions[command]) {
            postRenderFunctions[command]();
          }
        } else if (command === "clear") {
          output.innerHTML = "";
      } else {
            output.innerHTML += `<span class="text-red">Invalid command: ${command}</span>. <br> Type <span class="text-green">help</span> for a list of commands.`
        }
        if (command !== "clear") {
            output.innerHTML += "<br> <br>"
        }
        scrollToBottom()
    }
  if (event.key === "Tab") {
    event.preventDefault();
    input.value = autoCompleteCommand(input.value);
  }
  if (event.key === "ArrowUp") {
    if (commandHistory.length === 0) {
      return;
     }
    event.preventDefault();
    if (commandHistoryIndex === commandHistory.length) {
      commandHistoryIndex = 0;
    }
    input.value = commandHistory[commandHistory.length - 1 - commandHistoryIndex];
    commandHistoryIndex++;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (commandHistory.length === 0) {
      return;
     }
    if (commandHistoryIndex === 0) {
      commandHistoryIndex = commandHistory.length;
    }
    commandHistoryIndex--;
    input.value = commandHistory[commandHistory.length - 1 - commandHistoryIndex];
  }
    resizeInput();
});

input.addEventListener("blur", function (event) {
  console.log("blurred");
    input.focus();
});

function resizeInput() {
    input.style.width = input.value.length + 1 + "ch";
}

// scroll to bottom
function scrollToBottom() {
  const shell = document.getElementById("shell");
    console.log("scrolling to bottom", document.body.scrollHeight, output.scrollHeight);
    shell.scrollTop = output.scrollHeight;
    window.scroll(0, output.scrollHeight);
}

function createTable(data) {
    // Determine the maximum length of any cell in the table
    let maxCellLength = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j].length > maxCellLength) {
                maxCellLength = data[i][j].length;
            }
        }
    }

    // Create the top border of the table
    let topBorder = "┌" + "─".repeat(maxCellLength + 2) + "┬" + "─".repeat(maxCellLength + 2) + "┬" + "─".repeat(maxCellLength + 2) + "┬" + "─".repeat(maxCellLength + 2) + "┐";

    // Create the data rows of the table
    let dataRows = "";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            let cell = data[i][j];
            let padding = " ".repeat(Math.floor((maxCellLength - cell.length) / 2));
            let extraPadding = (cell.length % 2 == maxCellLength % 2) ? "" : " ";
            let formattedCell = "│ " + padding + cell + padding + extraPadding + " ";
            dataRows += formattedCell;
        }
        dataRows += "│\n";
        if (i != data.length - 1) {
            dataRows += "├" + "─".repeat(maxCellLength + 2) + "┼" + "─".repeat(maxCellLength + 2) + "┼" + "─".repeat(maxCellLength + 2) + "┼" + "─".repeat(maxCellLength + 2) + "┤\n";
        }
    }

    // Create the bottom border of the table
    let bottomBorder = "└" + "─".repeat(maxCellLength + 2) + "┴" + "─".repeat(maxCellLength + 2) + "┴" + "─".repeat(maxCellLength + 2) + "┴" + "─".repeat(maxCellLength + 2) + "┘";

    // Concatenate all the parts to create the final table
    let table = topBorder + "\n" + dataRows + bottomBorder;

  return { maxCellLength, table };
  
}