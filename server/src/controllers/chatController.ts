import { Request, Response } from "express";
import ChatRoomModel from "../models/chatRoomModel";
import Runner from "../models/runnerModel";
import { assignToChatRoom, getAssignedChatRoom } from "./helperFunctions";


export async function getAllMessages(req: Request, res: Response) {

  const chatRoomId = await getAssignedChatRoom(req.params.userId);
  if (chatRoomId) {
    const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (room && room.messages) res.json(room.messages);
    else res.json([]);
  } else res.json([]);
};

/* async function getChatRoomId(req: Request) {
  const userId = req.params.userId;
  const runner = await RunnerModel.findOne({ where: { userId } });
  return runner?.assignedChatRoom;
} */


export async function postMessage(req: Request, res: Response) {

  const chatRoomId = await getAssignedChatRoom(req.params.userId);
  if (chatRoomId && req.body) {
    const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (room && room.messages) {
      const newMessages = room.messages ? [...room.messages, req.body] : [req.body];
      const isMessagePublished = await ChatRoomModel.update({ messages: newMessages }, { where: { chatRoomId } });
      if (isMessagePublished) res.status(201).send({'success': 'Message published'});
      else res.status(500).send('Server error');
    }
  }
};

export async function assignChatRoom(req: Request, res: Response) {
  const runner: Runner = req.body;
  const response = await assignToChatRoom(runner);
  if (response) res.status(201).json(response);
  else res.status(500).json('Server error');
}
