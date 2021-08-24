const express = require("express");
const axios = require("axios").default;
const cors = require("cors");
const { json, urlencoded } = require("body-parser");

const { firestore } = require("./firebase");
const app = express();

const port = process.env.PORT || 8080

// Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  if (req.headers.authorization === "Bearer autenticado") {
    next();
  } else {
    res.sendStatus(403);
  }
});

// ------------ Rotas!
// Affirmations
app.get("/affirmations", async (req, res) => {
  const affirmationsResponse = await axios.get("https://affirmations.dev");
  res.send(affirmationsResponse.data);
});

// CRUD Users
app.get("/users", async (req, res) => {
  try {
    const users = await firestore.collection("users").get();
    const usersData = users.docs.map((userDoc) => {
      const user = userDoc.data();
      delete user.password;
      return user;
    });
    res.status(200).send(usersData);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await firestore.collection("users").doc(id).get();

    if (document.exists) {
      const userData = document.data();
      delete userData.password;
      res.status(200).send(userData);
    } else {
      res.status(404).send();
    }
  } catch (e) {
    res.status(500).send("Internal Error, Sorry");
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await firestore.collection("users").doc(id).delete();
    res.status(204).send();
  } catch (e) {
    res.status(500).send("Internal Error, Sorry");
  }
});

app.post("/users", async (req, res) => {
  try {
    const docRef = firestore.collection("users").doc();
    const user = { name: req.body.name, id: docRef.id };
    const document = await firestore.collection("users").add(user);
    res.status(201).send({ id: document.id });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Error, Sorry");
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const docId = req.params.id;
    const userData = {
      id: docId,
      name: req.body.name,
      password: req.body.password,
    };
    await firestore
      .collection("users")
      .doc(docId)
      .set(userData, { merge: true });
    res.status(204).send();
  } catch (e) {
    res.status(500).send("Internal Error, Sorry");
  }
});

app.post("/users/:id/recover-password", async (req, res) => {
  try {
    const docId = req.params.id;
    let randomPassword = (Math.random() + 1).toString(36).substring(2);
    const userData = {
      password: randomPassword,
    };

    await firestore
      .collection("users")
      .doc(docId)
      .set(userData, { merge: true });

    console.log(`Manda email pro usuário com a senha dele: ${randomPassword}`);
    res.status(200).send();
  } catch (e) {
    console.error(e)
    res.status(500).send("Internal Error, Sorry");
  }
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
});
