import express from 'express';


const app = express();

app.route('/')
  .get((_req, res) => {
    res.json({
      message: 'Olá NLW#05',
    });
  })
  .post((_req, res) => {
    res.json({
      message: 'Usuário salvo com sucesso!',
    });
  });

app.listen(3333, () => {
  console.log('Server is running on port 3333');
});
