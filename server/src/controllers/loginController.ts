import { Request, Response } from "express"
import RunnerModel, { Runner } from "../models/runnerModel";
import { removeRunnerFromChatRoom } from "./helperFunctions";

//minutes of inactivity to autologout users
const LOGIN_EXPIRES_MINUTES = 5;

export async function logUser(req: Request, res: Response, next: Function) {

  if (isMissingFields(req)) res.status(400).json('Missing fields');
  else if (incorrectCoordinates(req)) res.status(400).json('Incorrect coordinates ');
  else {

    const { userId, longitude, latitude } = req.body;
    const runner: Runner = { userId, longitude, latitude }

    const isRunnerLoggedIn = await RunnerModel.findOne({ where: { userId } });

    if (isRunnerLoggedIn) await RunnerModel.update({ longitude, latitude }, { where: { userId } });
    else await RunnerModel.create(runner);

    console.log(`long=${longitude} lat=${latitude} userId=${userId}`);
    next();
  }
}

function isMissingFields(req: Request): boolean {
  return !req.body || Object.keys(req.body).length === 0
    || !Object.keys(req.body).includes('longitude') || !Object.keys(req.body).includes('latitude')
    || !Object.keys(req.body).includes('userId')

  /*//! next incoming format 
  return !req.body || Object.keys(req.body).length === 0
    || !Object.keys(req.body).includes('userId') || !Object.keys(req.body).includes('coords')
    || !Object.keys(req.body.coords).includes('longitude')
    || !Object.keys(req.body.coords).includes('latitude'); 
    */
}

function incorrectCoordinates(req: Request) {
  return req.body.latitude < -90 || req.body.latitude > 90 || req.body.longitude < -180 || req.body.longitude > 180;
}

function checkExpiringSessions() {

  const now = Date.now();

  RunnerModel.findAll()
    .then(res => res.forEach(runner => {
      if (!runner.dataValues.updatedAt) logoutUser(runner);
      else now - runner.dataValues.updatedAt.getTime() >= LOGIN_EXPIRES_MINUTES * 1000 * 60 && logoutUser(runner);
    }))
    .catch(err => console.log('ERROR', err));

}
async function logoutUser(runner: Runner) {
  const runnerEntry = await RunnerModel.findOne({ where: { userId: runner.userId } });
  if (runnerEntry) {
    await removeRunnerFromChatRoom(runner.userId, runnerEntry.assignedChatRoom);
    runnerEntry.destroy();
  }
}

setInterval(checkExpiringSessions, 1000 * 60 * LOGIN_EXPIRES_MINUTES / 2);
