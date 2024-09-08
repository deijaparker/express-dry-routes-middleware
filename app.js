const express = require("express");
const app = express();

const PORT = process.env.PORT || 4001;

// Serve static files from the "public" directory
app.use(express.static("public"));

const jellybeanBag = {
  mystery: { number: 4 },
  lemon: { number: 5 },
  rootBeer: { number: 25 },
  cherry: { number: 3 },
  licorice: { number: 1 },
};

// Middleware for logging request method
app.use((req, res, next) => {
  console.log(`${req.method} Request Received`);
  next();
});

// GET all jellybeans
app.get("/beans/", (req, res) => {
  res.send(jellybeanBag);
  console.log("Response Sent");
});

// POST a new jellybean type
app.post("/beans/", (req, res) => {
  let queryData = "";
  req.on("data", (data) => {
    queryData += data;
  });

  req.on("end", () => {
    const body = JSON.parse(queryData);
    const beanName = body.name;
    if (jellybeanBag[beanName]) {
      return res.status(404).send("Bean with that name already exists");
    }
    const numberOfBeans = Number(body.number) || 0;
    jellybeanBag[beanName] = { number: numberOfBeans };
    res.send(jellybeanBag[beanName]);
    console.log("Response Sent");
  });
});

// GET a specific jellybean by name
app.get("/beans/:beanName", (req, res) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send("Bean with that name does not exist");
  }
  res.send(jellybeanBag[beanName]);
  console.log("Response Sent");
});

// POST to add beans to a specific type
app.post("/beans/:beanName/add", (req, res) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send("Bean with that name does not exist");
  }

  let queryData = "";
  req.on("data", (data) => {
    queryData += data;
  });

  req.on("end", () => {
    const numberOfBeans = Number(JSON.parse(queryData).number) || 0;
    jellybeanBag[beanName].number += numberOfBeans;
    res.send(jellybeanBag[beanName]);
    console.log("Response Sent");
  });
});

// POST to remove beans from a specific type
app.post("/beans/:beanName/remove", (req, res) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send("Bean with that name does not exist");
  }

  let queryData = "";
  req.on("data", (data) => {
    queryData += data;
  });

  req.on("end", () => {
    const numberOfBeans = Number(JSON.parse(queryData).number) || 0;
    if (jellybeanBag[beanName].number < numberOfBeans) {
      return res.status(400).send("Not enough beans to remove");
    }
    jellybeanBag[beanName].number -= numberOfBeans;
    res.send(jellybeanBag[beanName]);
    console.log("Response Sent");
  });
});

// DELETE a specific jellybean type
app.delete("/beans/:beanName", (req, res) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send("Bean with that name does not exist");
  }
  delete jellybeanBag[beanName];
  res.status(204).send();
  console.log("Response Sent");
});

// PUT to update the name of a specific jellybean type
app.put("/beans/:beanName/name", (req, res) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send("Bean with that name does not exist");
  }

  let queryData = "";
  req.on("data", (data) => {
    queryData += data;
  });

  req.on("end", () => {
    const newName = JSON.parse(queryData).name;
    jellybeanBag[newName] = jellybeanBag[beanName];
    delete jellybeanBag[beanName];
    res.send(jellybeanBag[newName]);
    console.log("Response Sent");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
