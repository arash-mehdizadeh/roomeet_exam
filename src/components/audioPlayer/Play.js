import React from "react";
import { ReactComponent as PlayCircleFilled } from '../../assets/icons/play-circle-filled.svg';

import '../../styles/components/audio/audio.scss';


export default function Play(props) {
    const { handleClick } = props;

    return (
        <div className="player__button" onClick={() => handleClick()}>
            <PlayCircleFilled />
        </div>
    );
}
