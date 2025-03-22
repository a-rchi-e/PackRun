import { Request, Response } from "express"
import Runner, { RunnerAttributes } from "../models/runnerModel";
import ChatRoom from "../models/chatRoomModel";
import { assignToDatabase } from "./controllerFunctions";

export async function setLocation(req: Request, res: Response) {

  if (isMissingData(req)) res.status(400).json('Missing fields');
  else {

    const { userId, longitude, latitude } = req.body;
    const runner: RunnerAttributes = { userId, longitude, latitude }

    const isRunnerLoggedIn = await Runner.findOne({ where: { userId } });

    if (isRunnerLoggedIn) {

      const updatePosition = await Runner.update({ longitude, latitude }, { where: { userId } });
      console.log('updated=', updatePosition);
    }
    else {

      const loginRunner = await Runner.create(runner);
      console.log('created', loginRunner);
    }

    const asignedChatRoom = await assignToDatabase(runner);
    res.status(201).json({ chatroom: asignedChatRoom });
    console.log(`long=${longitude} lat=${latitude} userId=${userId}`);
  }
}

export async function getAllMessages(req: Request, res: Response) {
  const chatRoomId = req.params.chatroom;
  console.log(chatRoomId);
  if (chatRoomId) {
    const room = await ChatRoom.findOne({ where: { chatRoomId } });
    if (room && room.messages) res.json(room.messages);
    else res.json([]);
  }
};

export async function postMessage(req: Request, res: Response) {
  const chatRoomId = req.params.chatroom;

  if (chatRoomId && req.body) {
    const room = await ChatRoom.findOne({ where: { chatRoomId } });
    if (room && room.messages) {
      const newMessages = room.messages ? [...room.messages, req.body] : [req.body];
      const isMessagePublished = await ChatRoom.update({ messages: newMessages }, { where: { chatRoomId } });
      if (isMessagePublished) res.status(201).send('Message published');
      else res.status(500).send('Server error');
    }
  }
};

function isMissingData(req: Request): boolean {
  return !req.body || Object.keys(req.body).length === 0
    || !Object.keys(req.body).includes('longitude') || !Object.keys(req.body).includes('latitude')
    || !Object.keys(req.body).includes('userId')
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

//! I think this function should not exist for users
export async function getAllRunners(req: Request, res: Response) {
  try {
    const allRunners = await Runner.findAll();
    res.status(200).json(allRunners)
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error })
  }
}; */