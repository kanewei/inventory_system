import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import schedule from "node-schedule";
import routes from './server/routes';
import dbInit from './server/db/init';
import HttpException from './server/util/httpException'
import { DailyProcess } from './server/util/schedule'

// set port, listen for requests
const PORT = process.env.PORT || 8080;

dbInit()

const app: Application = express();

app.use(cors())

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async(req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({ message: `Endpoints available at http://localhost:${PORT}/api/` })
})

app.use('/api', routes)

app.use((error:HttpException, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

schedule.scheduleJob('0 0 0 * * * ', function(){
  // 
});

app.listen(PORT, () => {
  DailyProcess()
});