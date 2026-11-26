const http = require("http");
const fs = require("fs");

// helper: read users from the JSON file
const readUsers = () => {
    const data = fs.readFileSync("./users.json", "utf8");
    return data ? JSON.parse(data) : [];
};

// helper: write users to the JSON file
const writeUsers = (users) =>
    fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));

// helper: send a JSON response
const send = (res, status, obj) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(obj));
};

const server = http.createServer((req, res) => {
    const method = req.method;
    const url = req.url;
    const parts = url.split("/").filter(Boolean); // "/user/1" => ["user", "1"]

    // 4) GET /user - get all users
    if (method === "GET" && url === "/user") {
        return send(res, 200, readUsers());
    }

    // 5) GET /user/:id - get user by id
    if (method === "GET" && parts[0] === "user" && parts[1]) {
        const user = readUsers().find((u) => u.id === Number(parts[1]));
        if (!user) return send(res, 404, { message: "User not found." });
        return send(res, 200, user);
    }

    // 1) POST /user - add a new user
    if (method === "POST" && url === "/user") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            const newUser = JSON.parse(body);
            const users = readUsers();
            const emailExists = users.some((u) => u.email === newUser.email);
            if (emailExists) {
                return send(res, 400, { message: "Email already exists." });
            }
            newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
            users.push(newUser);
            writeUsers(users);
            send(res, 201, { message: "User added successfully." });
        });
        return;
    }

    // 2) PATCH /user/:id - update name, age, or email
    if (method === "PATCH" && parts[0] === "user" && parts[1]) {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            const updates = JSON.parse(body);
            const users = readUsers();
            const user = users.find((u) => u.id === Number(parts[1]));
            if (!user) return send(res, 404, { message: "User ID not found." });
            Object.assign(user, updates);
            writeUsers(users);
            const key = Object.keys(updates)[0];
            send(res, 200, { message: "User " + key + " updated successfully." });
        });
        return;
    }

    // 3) DELETE /user/:id - delete a user
    if (method === "DELETE" && parts[0] === "user" && parts[1]) {
        const users = readUsers();
        const index = users.findIndex((u) => u.id === Number(parts[1]));
        if (index === -1) return send(res, 404, { message: "User ID not found." });
        users.splice(index, 1);
        writeUsers(users);
        return send(res, 200, { message: "User deleted successfully." });
    }

    send(res, 404, { message: "Route not found." });
});

server.listen(3000, () => console.log("Server running on port 3000"));