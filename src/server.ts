import app from "./app.js"

const PORT: number = Number(process.env.SERVER_PORT || 7001);

const server = app;

// Server listen 
server.listen(PORT, () => {
  console.log(`PORT is running in localhost:${PORT}`);
})