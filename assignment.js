const path = require("path");
const fs = require("fs");
const os = require("os");
const EventEmitter = require("events");
const { pipeline } = require("stream");
const zlib = require("zlib");

//#1 Write a function that logs the current file path and directory
console.log({ File: __filename, Dir: __dirname });

//#2 Write a function that takes a file path and returns its file name
const getFileName = (p) => path.basename(p);
console.log(getFileName("/user/files/report.pdf"));

//#3 Write a function that builds a path from an object
const buildPath = (obj) => path.format(obj);
console.log(buildPath({ dir: "/folder", name: "app", ext: ".js" }));

//#4 Write a function that returns the file extension from a given file path
const getExt = (p) => path.extname(p);
console.log(getExt("/docs/readme.md"));

//#5 Write a function that parses a given path and returns its name and ext
const parseFile = (p) => {
    const parsed = path.parse(p);
    return { Name: parsed.name, Ext: parsed.ext.replace(".", "") };
};
console.log(parseFile("/home/app/main.js"));

//#6 Write a function that checks whether a given path is absolute
const isAbsolutePath = (p) => path.isAbsolute(p);
console.log(isAbsolutePath("/home/user/file.txt"));

//#7 Write a function that joins multiple segments
const joinSegments = (...segments) => path.join(...segments);
console.log(joinSegments("src", "components", "App.js"));

//#8 Write a function that resolves a relative path to an absolute one
const resolvePath = (p) => path.resolve(p);
console.log(resolvePath("./index.js"));

//#9 Write a function that joins two paths
const joinTwoPaths = (p1, p2) => path.join(p1, p2);
console.log(joinTwoPaths("/folder1", "folder2/file.txt"));


//#10 Write a function that deletes a file asynchronously
const deleteFile = (p) => {
    fs.unlink(p, (err) => {
        if (err) {
            console.log("file not found, create it first");
            return;
        }
        console.log("The file.txt is deleted.");
    });
};
deleteFile("./file.txt");

//#11 Write a function that creates a folder synchronously
const createFolder = (name) => {
    fs.mkdirSync(name, { recursive: true });
    console.log("Success");
};
createFolder("./newFolder");

//#12 Create an event emitter that listens for a "start" event and logs a welcome message
const emitter = new EventEmitter();
emitter.on("start", () => console.log("Welcome event triggered!"));
emitter.emit("start");


//#13 Emit a custom "login" event with a username parameter
emitter.on("login", (username) => console.log("User logged in: " + username));
emitter.emit("login", "Ahmed");

//#14 Read a file synchronously and log its contents
const content = fs.readFileSync("./notes.txt", "utf8");
console.log(content);

//#15 Write asynchronously to a file
fs.writeFile("./async.txt", "Async save", (err) => {
    if (err) throw err;
    console.log("Saved");
});

//#16 Check if a directory exists
const exists = (p) => fs.existsSync(p);
console.log(exists("./notes.txt"));

//#17 Write a function that returns the OS platform and CPU architecture
const getSystemInfo = () => ({ Platform: os.platform(), Arch: os.arch() });
console.log(getSystemInfo());

//#18 Use a readable stream to read a file in chunks and log each chunk
const readStream = fs.createReadStream("./big.txt", { encoding: "utf8" });
readStream.on("data", (chunk) => console.log(chunk));

//#19 Use readable and writable streams to copy content from one file to another
const copyFile = (src, dest) => {
    const rs = fs.createReadStream(src);
    const ws = fs.createWriteStream(dest);
    rs.pipe(ws);
    ws.on("finish", () => console.log("File copied using streams"));
};
copyFile("./source.txt", "./dest.txt");

//#20 Create a pipeline that reads a file, compresses it, and writes it to another file
pipeline(
    fs.createReadStream("./data.txt"),
    zlib.createGzip(),
    fs.createWriteStream("./data.txt.gz"),
    (err) => {
        if (err) throw err;
        console.log("File compressed");
    }
);