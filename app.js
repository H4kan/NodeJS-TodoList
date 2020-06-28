
const fs = require("fs");
const colors = require("colors");

let store = [];
const PATH = "database.json";
let nextIndex;
let valHandler;
let mode = 0; 

// mode:
// 0 - list
// 1 - add
// 2 - remove
// 3 - find
// 4 - clear
function parseInput()
{
    let arg = process.argv[2];
    if (!arg || arg == "--list") 
    {
        mode = 0;
        return;
    }
    let [procArg, procVal] = arg.split("=");
    if (procArg == "--add")
    {
        mode = 1;
        valHandler = procVal;
    }
    else if (procArg == "--remove")
    {
        mode = 2;
        valHandler = procVal;
    }
    else if (procArg == "--find")
    {
        mode = 3;
        valHandler = procVal;
    }
    else if (procArg == "--clear")
    {
        mode = 4;
    }
    else {
        throw new Error("Unexpected parameter");
    }
}


function readFile()
{
    fs.readFile(PATH, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        store = data;
        if (store.length) nextIndex = store[store.length - 1].id + 1;
        else nextIndex = 1;
        makeTask();
    });
}

function makeTask()
{
    if (mode == 0) 
    {
        showList();
        return;
    }
    else if (mode == 1) addList();
    else if (mode == 2) removeList();
    else if (mode == 3) findList();
    else if (mode == 4) clearList();
    fs.writeFile(PATH, JSON.stringify(store), err => {
        if (err) throw err;
    })
}

function findList()
{
    store.forEach(el => {
        let index = el.name.indexOf(valHandler);
        if (index != -1) 
        {
            let strHandler = "";
            let substrs = el.name.split(valHandler);
            for (let i = 0; i < substrs.length - 1; i++)
                {
                    strHandler += `${substrs[i]}`.green;
                    strHandler += `${valHandler}`.red;
                }
                strHandler += `${substrs[substrs.length - 1]}`.green;
            console.log(`${el.id}. ` .yellow + `${strHandler}`);
        }
    })
}

function addList()
{
    if (store.length && store.findIndex(el => el.name == valHandler) != -1)
    {
        console.log("Zadanie już jest na liście");
    }
    else {
    store.push({name: valHandler, id: nextIndex});
    console.log(`Pomyślnie dodano zadanie "${valHandler}"`);
    nextIndex  = nextIndex + 1;
    }
    showList();
}

function removeList()
{
    let length = store.length;
    store = store.filter(el => el.name != valHandler);
    length == store.length ? console.log("Nie ma takiego zadania") 
        : console.log(`Pomyślnie usunięto zadanie "${valHandler}"`);
    showList();
}

function showList()
{
    if (store.length)
    {
    console.log("Lista zadań:".blue)
    store.forEach(element => {
        console.log(`${(element.id)}.   `.yellow + `${(element.name).green}`);
    });
    }
    else console.log("Lista zadań jest pusta".blue);
}

function clearList()
{
    store = [];
    showList();
}

parseInput();
fs.access(PATH, (err)=> 
{
    if (err) 
        fs.writeFile(PATH, JSON.stringify([]), err => {
            if (err) throw err;
            readFile()
        });
        else 
        {
            readFile();
        }
})


