
require('dotenv').config();

const { app, server } = require('./api/server');

const port = process.env.PORT || 3000;
app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
