import React from "react";
import { ReactComponent as PauseCircleFilled } from '../../assets/icons/pause-circle-filled.svg';

import '../../styles/components/audio/audio.scss';


export default function Play(props) {
    const { handleClick } = props;

    return (
        <div className="player__button" onClick={() => handleClick()}>
            <PauseCircleFilled />
        </div>
    );
}
