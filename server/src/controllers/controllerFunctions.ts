import ChatRoom from "../models/chatRoomModel";
import { RunnerAttributes } from "../models/runnerModel";

export async function assignToDatabase(runner: RunnerAttributes): Promise<string | undefined> {

  let chatRoomId = await getUniqueChatRoomId();

  if (!chatRoomId) {
    chatRoomId = runner.longitude + '-' + runner.latitude;
    const newChatRoom = { chatRoomId, usersId: [], messages: [] }
    const isChatRoomCreated = await ChatRoom.create(newChatRoom);
    if (isChatRoomCreated) console.log('chatroomcreated');
    else return undefined;
  }
  const uniqueChatRoom = await ChatRoom.findOne({ where: { chatRoomId } });
  if (uniqueChatRoom) {
    if (!uniqueChatRoom.usersId.includes(runner.userId)) uniqueChatRoom.usersId.push(runner.userId);
    console.log('pushed', uniqueChatRoom.usersId);

    const isUserAdded = await ChatRoom.update({ usersId: uniqueChatRoom.usersId }, { where: { chatRoomId } });
    if (isUserAdded) return chatRoomId
    else return undefined;
  }
}

export async function getUniqueChatRoomId(): Promise<string | undefined> {
  const result = await ChatRoom.findOne();
  return result?.chatRoomId;
}







// function calculateDistance(user: any, db: any) {
//   const R = 3958.8;
//   const dLat = deg2rad(db.latitude - user.latitude);
//   const dLon = deg2rad(db.longitude - user.longitude);
//   const haversFormula =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(user.latitude)) * Math.cos(deg2rad(db.latitude)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const ang = 2 * Math.atan2(Math.sqrt(haversFormula), Math.sqrt(1 - haversFormula));
//   const kms = R * ang;
//   const kmsRounded = Math.round(kms);

// }
// function deg2rad(deg: number) {
//   return deg * (Math.PI / 180);

// }