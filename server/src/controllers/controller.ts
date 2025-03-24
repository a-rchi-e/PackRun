import { Request, Response } from "express"
import RunnerModel, { Runner } from "../models/runnerModel";
import ChatRoomModel from "../models/chatRoomModel";
import { assignToChatRoom } from "./controllerFunctions";
import sequelize from "../models/model";

export async function setLocation(req: Request, res: Response, next: Function) {

  if (isMissingFields(req)) res.status(400).json('Missing fields');
  else if (incorrectCoordinates(req)) res.status(400).json('Incorrect coordinates ');
  else {

    const { userId, longitude, latitude } = req.body;
    const runner: Runner = { userId, longitude, latitude }

    const isRunnerLoggedIn = await RunnerModel.findOne({ where: { userId } });

    if (isRunnerLoggedIn) {

      const updatePosition = await RunnerModel.update({ longitude, latitude }, { where: { userId } });
      console.log('updated=', updatePosition);
    }
    else {

      const loginRunner = await RunnerModel.create(runner);
      console.log('created', loginRunner);
    }

    console.log(`long=${longitude} lat=${latitude} userId=${userId}`);
    next();
  }
}
export async function logUserInChatRoom(req: Request, res: Response) {
  const runner: Runner = req.body;
  const response = await assignToChatRoom(runner);
  if (response) res.status(201).json(response);
  else res.status(500).json('Server error');
}

export async function getAllMessages(req: Request, res: Response) {
  const chatRoomId = await getChatRoomId(req);
  if (chatRoomId) {
    const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (room && room.messages) res.json(room.messages);
    else res.json([]);
  } else res.json([]);

};
async function getChatRoomId(req: Request) {
  const userId = req.params.userId;
  const runner = await RunnerModel.findOne({ where: { userId } });
  return runner?.assignedChatRoom;
}
export async function postMessage(req: Request, res: Response) {
  const chatRoomId = await getChatRoomId(req);

  if (chatRoomId && req.body) {
    const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (room && room.messages) {
      const newMessages = room.messages ? [...room.messages, req.body] : [req.body];
      const isMessagePublished = await ChatRoomModel.update({ messages: newMessages }, { where: { chatRoomId } });
      if (isMessagePublished) res.status(201).send('Message published');
      else res.status(500).send('Server error');
    }
  }
};

function isMissingFields(req: Request): boolean {
  return !req.body || Object.keys(req.body).length === 0
    || !Object.keys(req.body).includes('longitude') || !Object.keys(req.body).includes('latitude')
    || !Object.keys(req.body).includes('userId')
}

function incorrectCoordinates(req: Request) {
  return req.body.latitude < -90 || req.body.latitude > 90 || req.body.longitude < -180 || req.body.longitude > 180;
}


/* 
export function getNearbyRunners(req: Request, res: Response) {
  async (req: Request, res: Response) => {
    const runnerId = req.params.id;
    const distance = req.params.distance;
    sequelize.query(
      `SELECT * FROM get_nearby_runners(:runner_id, :distance)`,
      {
        replacements: { runner_id: runnerId, distance: distance },
        type: QueryTypes.SELECT
      }
    )
      .then((results) => {
        console.log("Function results:", results);
        res.status(200).json(results);
      })
      .catch((error) => {
        console.error("Error calling function:", error);
        res.status(404);
      });
  }
}
*/