import React from "react";
import { useCustomFaq } from "../../contexts/CustomFaqContext";
import { useCssHandles } from 'vtex.css-handles'
import { cssHandles } from "./handles";

interface ColorProps {
    colorQ?: string
}

export const Icon = ({ colorQ }: ColorProps) => {
    const { icon, iconColor } = useCustomFaq();

    const { handles: css } = useCssHandles(cssHandles)

    return (
        icon ?
            <img src={icon} alt="" className={css['customFaq-icon']} />
            :

            <svg
                version="1.1"
                id="Camada_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="-298 392.8 14.6 8.2"
                fill={colorQ || iconColor || "#000"}
                className={css['customFaq-icon']}
            >
                <path d="M-284.3,393.2c-0.6-0.5-1.4-0.5-2,0l-4.4,4.4l-4.4-4.4c-0.5-0.5-1.4-0.5-2,0c-0.5,0.5-0.5,1.4,0,2l5.4,5.4l0,0 c0.3,0.3,0.6,0.4,1,0.4c0.4,0,0.7-0.1,1-0.4l5.4-5.4C-283.7,394.6-283.7,393.8-284.3,393.2z" />
            </svg>

    );
};
