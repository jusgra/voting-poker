import React from "react";

export default function RoomsList({ hostedRooms, roomClick }) {
  return (
    <>
      <h2>List of hosted rooms</h2>
      <ul>
        {hostedRooms?.length !== 0 ? (
          hostedRooms.map((single) => {
            return (
              <div>
                {single.hostUsername}'s room <button onClick={() => roomClick(single.roomId)}>Join</button>
              </div>
            );
          })
        ) : (
          <div>No rooms are created at the moment</div>
        )}
      </ul>
    </>
  );
}
