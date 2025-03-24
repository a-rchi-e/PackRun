import ChatRoomModel, { chatRoom } from "../models/chatRoomModel";
import RunnerModel, { Runner } from "../models/runnerModel";

const CHAT_ROOM_AREA_IN_MTS = 3 * 1000;
const CHAT_ROOM_TOLERANCY = 0;

export async function assignToChatRoom(runner: Runner): Promise<any | undefined> {

  let chatRoomId = await getNearestChatRoom(runner);
  if (!chatRoomId) chatRoomId = await createNewChatRoom(runner);
  if (!chatRoomId) return undefined;

  const nearestChatRoom = await ChatRoomModel.findOne({ where: { chatRoomId } });

  console.log('nearest', nearestChatRoom);
  if (nearestChatRoom) {

    const runnerDbObj = await RunnerModel.findOne({ where: { userId: runner.userId } });

    if (runnerDbObj && nearestChatRoom.dataValues.chatRoomId && nearestChatRoom.dataValues.chatRoomId !== runnerDbObj.assignedChatRoom) {

      const lastChatRoom = await ChatRoomModel.findOne({ where: { chatRoomId: runnerDbObj.dataValues.assignedChatRoom } });
      if (lastChatRoom) await ChatRoomModel.update(
        { usersId: lastChatRoom.usersId.filter(userId => userId !== runner.userId) },
        { where: { chatRoomId: runnerDbObj.dataValues.assignedChatRoom } });

      if (!nearestChatRoom.dataValues.usersId.includes(runner.userId)) {
        nearestChatRoom.dataValues.usersId.push(runner.userId);
        await ChatRoomModel.update(
          { usersId: nearestChatRoom.dataValues.usersId },
          { where: { chatRoomId } });
      }

      await RunnerModel.update(
        { assignedChatRoom: nearestChatRoom.chatRoomId },
        { where: { userId: runner.userId } });
    }
    const nearbyUsers = nearestChatRoom.usersId.length - 1;
    return { assignedChatRoom: chatRoomId, nearbyUsers };

  }
}

async function createNewChatRoom(runner: Runner) {
  const chatRoomId = runner.latitude + '_' + runner.longitude;
  const newChatRoom = { chatRoomId, usersId: [], messages: [] }
  const isChatRoomCreated = await ChatRoomModel.create(newChatRoom);
  return isChatRoomCreated ? chatRoomId : undefined;
}

async function getNearestChatRoom(referencePoint: Runner): Promise<string | undefined> {
  try {
    const nearestChatRoom = await ChatRoomModel.findAll();
    if (nearestChatRoom) {

      if (nearestChatRoom.length !== 0) return nearestChatRoom
        .map(chatRoom => { return { ...chatRoom, distance: calculateDistance(referencePoint, chatRoom) }; })
        .filter(chatRoom => chatRoom.distance <= CHAT_ROOM_AREA_IN_MTS + CHAT_ROOM_TOLERANCY)
        .reduce((acum, chatRoom) => chatRoom.distance <= acum.distance
          ? chatRoom
          : acum)

        .dataValues.chatRoomId;
    }
  } catch (err) {
    console.log(err);
  }
}

function calculateDistance(user: Runner, db: chatRoom) {

  const dbLatitude = Number(db.chatRoomId.split('_')[0]);
  const dbLongitude = Number(db.chatRoomId.split('_')[1]);

  const R = 6371;
  const dLat = deg2rad(dbLatitude - user.latitude);
  const dLon = deg2rad(dbLongitude - user.longitude);

  const haversFormula =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(user.latitude)) * Math.cos(deg2rad(dbLatitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const ang = 2 * Math.atan2(Math.sqrt(haversFormula), Math.sqrt(1 - haversFormula));
  const kms = R * ang;

  return kms * 1000;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);

}