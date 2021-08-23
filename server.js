const express = require("express");
const { firestore } = require("./firebase");
const app = express();
const port = 3000;

app.get("/users", async (req, res) => {
  try {
    const users = await firestore.collection("users").get();
    const usersData = users.docs.map((userDoc) => {
      const user = userDoc.data()
      delete user.password
      return user
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
      delete userData.password
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
    res.status(500).send("Internal Error, Sorry");
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const docId = req.params.id;
    const userData = {
      id: docId,
      name: req.body.name,
      password: req.body.password
    }
    await firestore
      .collection("users")
      .doc(docId)
      .set(userData, { merge: true });
    res.status(204).send();
  } catch (e) {
    res.status(500).send("Internal Error, Sorry");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
