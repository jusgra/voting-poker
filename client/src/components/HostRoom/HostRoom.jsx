import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CARD_CONSTS, figureOutCardShowing, getCardAvg, getSortedResults } from "../../utils/roomUtils";
import styles from "./HostRoom.module.scss";
import Button from "../Button/Button";
import { ButtonTypes } from "../../utils/ButtonTypes";
import { textConst, toastSettings } from "../../utils/constants";
import TopBar from "../TopBar/TopBar";
import IconPersonBadge from "../Icons/IconPersonBadge";
import IconRoom from "../Icons/IconRoom";
import { toast } from "react-toastify";
import IconVoting from "../Icons/IconVoting";
import IconDidntVote from "../Icons/IconDidntVote";
import IconVoted from "../Icons/IconVoted";
import { composeClassName } from "../../utils/utilFunctions";

export default function HostRoom({ socket, roomData, handleLeave, isCardsRevealed, leftToVoteString }) {
  const { id: roomId } = useParams();
  const username = sessionStorage.getItem("username");
  const [results, setResults] = useState({});

  const isRoomEmpty = roomData.usersInRoom.length <= 1;
  const hasSomeoneVoted = roomData.usersInRoom.some((single) => single.card);

  const handleReveal = () => {
    if (isCardsRevealed) {
      socket.emit("card-reveal-toggle", { roomId, action: "RESET" });
      return;
    }
    socket.emit("card-reveal-toggle", { roomId });
    setResults(getSortedResults(roomData));
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.info(textConst.home.toasts.copySuccess, { ...toastSettings, hideProgressBar: true, autoClose: 1000 });
    });
  };

  return (
    <div className={styles.roomContainer}>
      <TopBar styling={styles.topBarContainer}>
        <div className={styles.leftSide}>
          <Button onClick={handleCopyClick} buttonText={textConst.room.copy} type={ButtonTypes.COPY} />
          <IconRoom sizeInPx={36} />
          <span className={styles.hostUsername}>{roomData.roomInfo.hostUsername} room</span>
        </div>
        <div className={styles.middle}>
          <span>{textConst.room.participants}</span>
          <span className={styles.usersNumber}>{roomData.usersInRoom.length - 1}</span>
        </div>

        <div className={styles.rightSide}>
          <IconPersonBadge sizeInPx={36} />

          <span className={styles.username}>{username}</span>

          <Button
            onClick={handleLeave}
            styling={styles.backButton}
            buttonText={textConst.room.leave}
            type={ButtonTypes.LEAVE}
          />
        </div>
      </TopBar>

      {isCardsRevealed ? (
        <Button
          onClick={handleReveal}
          styling={styles.resetButton}
          buttonText={textConst.room.reset}
          type={ButtonTypes.RESET}
        />
      ) : (
        <Button
          onClick={handleReveal}
          styling={styles.revealButton}
          buttonText={textConst.room.reveal}
          type={ButtonTypes.REVEAL}
          disabled={isRoomEmpty}
        />
      )}
      {isCardsRevealed ? (
        <h1 className={styles.leftToVote}>{textConst.room.header.cardsRevealed}</h1>
      ) : (
        <h1 className={styles.leftToVote}>{leftToVoteString}</h1>
      )}

      <div className={composeClassName(styles.wrapperContainer, isRoomEmpty && styles.emptyWrapper)}>
        {isRoomEmpty ? (
          <>
            <div className={styles.url}>{window.location.href}</div>
            <Button
              styling={styles.button}
              onClick={handleCopyClick}
              buttonText={textConst.room.copy}
              type={ButtonTypes.COPY}
            />
          </>
        ) : (
          <div className={styles.usersContainer}>
            {roomData.usersInRoom.map((userInfo, index) => {
              const currentCard = figureOutCardShowing(userInfo, isCardsRevealed);
              return (
                roomData.roomInfo.hostId !== userInfo.id && (
                  <div key={index} className={styles.userWrapper}>
                    <p className={styles.username}>{userInfo.username}</p>

                    <div
                      key={index}
                      className={composeClassName(
                        styles.cardWrapper,
                        currentCard === CARD_CONSTS.YET_TO_VOTE && styles.voting,
                        currentCard === CARD_CONSTS.VOTED && styles.voted,
                        currentCard === CARD_CONSTS.DID_NOT_VOTE && styles.didntVote
                      )}
                    >
                      {currentCard === CARD_CONSTS.YET_TO_VOTE && <IconVoting sizeInPx={42} />}
                      {currentCard === CARD_CONSTS.VOTED && <IconVoted sizeInPx={42} />}
                      {currentCard === CARD_CONSTS.DID_NOT_VOTE && (
                        <>
                          <IconDidntVote sizeInPx={42} />
                          <span className={styles.userSkipped}>{textConst.room.didNotVote}</span>
                        </>
                      )}
                      {currentCard === CARD_CONSTS.SHOW_CARD && <span>{userInfo.card}</span>}
                    </div>
                  </div>
                )
              );
            })}
          </div>
        )}
        {isCardsRevealed && (
          <>
            <div className={styles.divider} />

            <div className={composeClassName(styles.resultContainer, !hasSomeoneVoted && styles.empty)}>
              <div className={styles.votesContainer}>
                {Object.entries(results).map(([key, value]) => (
                  <div key={key} className={styles.singleResult}>
                    <div className={styles.resultCard}>{key}</div>
                    <span>
                      {textConst.room.result[0]} <span className={styles.resultValue}>{value}</span>{" "}
                      {textConst.room.result[1]}
                      {value > 1 && "s"}.
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.averageContainer}>
                {hasSomeoneVoted ? (
                  <>
                    <span className={styles.text}>{textConst.room.average}</span>
                    <span className={styles.number}>{getCardAvg(roomData)}</span>
                  </>
                ) : (
                  <span className={styles.noVotes}> {textConst.room.noVotes}</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
