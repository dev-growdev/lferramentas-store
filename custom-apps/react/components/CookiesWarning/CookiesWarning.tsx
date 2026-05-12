import React, { useEffect, useState } from 'react';
import { useRuntime } from 'vtex.render-runtime';
import style from './style.css'

interface CookiePopup {
    activateCookie: boolean,
    text1: string,
    text2: string,
    cookiesDaysExpiration: number
    buttonText: string
}

export const CookiesWarning = (props: CookiePopup) => {
    const { activateCookie, text1, text2, cookiesDaysExpiration, buttonText } = props;
    const [ hasCookie, setHasCookie ] = useState<boolean>(false)
    const { deviceInfo } = useRuntime()
    const [ loading, setLoading ] = useState(true)
    const [ userScrolled, setUserScrolled ] = useState(false)

    useEffect(() => {
        const cookie = getCookie('cookieConsents')
        setLoading(false)
        if (cookie) {
            setHasCookie(true)
        } else {
            setHasCookie(false)
        }
    }, [])

    useEffect(() => {
        function onScroll() {
            setUserScrolled(true)
            window.removeEventListener("scroll", onScroll)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
        }
    }, [])

    function setCookie(cname: string, cvalue: string, exdays: number) {
        const d = new Date();
        d.setTime(d.getTime() + (+exdays * 24 * 60 * 60 * 1000));
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `${cname}=${cvalue};${expires};path=/`;
        setHasCookie(true)
    }

    function getCookie(cname: string,) {
        const name = `${cname}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[ i ];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    if (loading) {
        return <></>
    }

    return (
        <>
            {activateCookie && userScrolled ?
                !hasCookie ?
                    <div className={style.cookieContainer}>
                        <section>
                            <div className={style.cookieTextContainer}>
                                {
                                    deviceInfo.isMobile
                                        ? (
                                            <span className={style.cookieParagraph}>{text1} {text2}</span>
                                        )
                                        : (
                                            <>
                                                <span className={style.cookieParagraph}>{text1}</span>
                                                <span className={style.cookieParagraph}>{text2}</span>
                                            </>
                                        )
                                }
                            </div>
                            <button
                                className={style.cookieButton}
                                onClick={() =>
                                    setCookie('cookieConsents', 'true', cookiesDaysExpiration)
                                }
                            >
                                {buttonText}
                            </button>
                        </section>
                    </div> : ''
                : null}
        </>
    )
}

CookiesWarning.schema = {
    title: 'Modal de Cookies',
    type: 'object',
    properties: {
        activateCookie: {
            title: 'Ativar modal de cookie?',
            type: 'boolean',
            default: false,
        },
        text1: {
            title: 'Cookie Texto 1',
            type: 'string',
            default: null,
        },
        text2: {
            title: 'Cookie Texto 2',
            type: 'string',
            default: null,
        },
        cookiesDaysExpiration: {
            title: 'Validade do Cookie',
            description: 'Número de dias válidos',
            type: 'number',
            default: 21,
        },
        buttonText: {
            title: 'Texto do Botão',
            description: 'Texto do Botão',
            type: 'string',
            default: 'ACEITAR COOKIES',
        }
    },
}
