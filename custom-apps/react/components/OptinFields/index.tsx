import React, { useState, useEffect, useRef } from "react";
import { useRenderSession } from 'vtex.session-client';
import { canUseDOM } from 'vtex.render-runtime';
import axios from 'axios';
import { OptinProps } from "./types/types";
import { cssHandles } from "./handles/handles";
import { useCssHandles } from "vtex.css-handles"


const OptinFields = () => {

  const [isProfilePage, setIsProfilePage] = useState<boolean>(false);
  const [isAppended, setIsAppended] = useState<boolean>(false)
  
  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [registerId, setRegisterId] = useState<string>('');
  const [optinState, setOptinState] = useState<OptinProps>({
    optin_sms: false,
    optin_whatsapp: false,
    optin_email: false
  });
  const { session } = useRenderSession();
  const userEmail: string = session?.namespaces?.profile?.email?.value;

  const handleOptinChange = (key: string, value: boolean) => {
    setOptinState(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };
  const optinContainerRef = useRef(null);
  const currentUrl = window.location.href;

  const { handles: css } = useCssHandles(cssHandles)

  useEffect(() => {
    setIsProfilePage(currentUrl.includes('profile'));
  }, [currentUrl]);

  useEffect(() => {
    let itv: any;
    if (canUseDOM && isProfilePage) {
      itv = setInterval(() => {
        const newsletterBox: HTMLDivElement | null = document.querySelector('.vtex-my-account-1-x-newsletterBoxContainer');
        const optinContainer: HTMLDivElement | null = optinContainerRef.current;
        if (newsletterBox && optinContainer) {
          newsletterBox.appendChild(optinContainer);
          setIsAppended(true)
        }
      }, 500);
    }
    return () => clearInterval(itv);
  }, [isProfilePage]);

  useEffect(() => {
    const isProd = window?.location?.href?.indexOf('myvtex') === -1
        
    const url = !isProd ? 
    `/api/dataentities/CL/search?_where=email=${userEmail}&_fields=id,optin_sms,optin_whatsapp,optin_email&v=${Date.now()}` 
    :
    `/safedata/CL/search?_where=email=${userEmail}&_fields=id,optin_sms,optin_whatsapp,optin_email&v=${Date.now()}`

    if (userEmail) {
      const getOptins = async () => {
        try {
          const response = await axios.get(url, {
            headers: {
              Accept: 'application/vnd.vtex.ds.v10+json',
              'Content-Type': 'application/json',
            },
          });
          if (response.data[0]) {
            setOptinState({
              optin_sms: response?.data[0]?.optin_sms,
              optin_whatsapp: response?.data[0]?.optin_whatsapp,
              optin_email: response?.data[0]?.optin_email,
            });
            setRegisterId(response?.data[0]?.id);
          }
        } catch (error) {
          console.error('Erro:', error);
        }
      };
      getOptins();
    }
  }, [userEmail, setOptinState, setRegisterId]);

  useEffect(() => {
    if (registerId) {
      const updateOptins = async () => {
        try {
          await axios.patch(`/safedata/CL/documents/${registerId}`, JSON.stringify(optinState));
        } catch (error) {
          console.error('Erro:', error);
        }
      };
      updateOptins();
    }
  }, [optinState, registerId]);

  useEffect(() => {
    const allChecked = Object.values(optinState).every(value => value === true);
    setCheckAll(allChecked);
  }, [optinState]);

  const handleCheckAll = () => {
    if (Object.values(optinState).some(value => value !== true)) {
      setOptinState({
        optin_sms: true,
        optin_whatsapp: true,
        optin_email: true
      })
      setCheckAll(true)
    }
  }

  return (
    <>
      <div ref={optinContainerRef} className={css['optinContainer']} style={{ display: !isProfilePage || !isAppended ? 'none' : 'flex' }}>
        <span className={css['optinTitle']}>
          Para que você receba ofertas especiais, precisamos da sua permissão para mandar mensagens com vantagens exclusivas.
        </span>
        <span className={css['optinSubtitle']}>Você pode alterar sua preferência a qualquer momento.</span>

        <label htmlFor="optin-check-all" className={css['optinCheckAllContainer']}>
          <input type="checkbox" id="optin-check-all" checked={checkAll} onClick={handleCheckAll} className={css['optinCheckAllInput']} />
          <span className={css['optinCheckAllLabel']}>Aceito receber comunicações através de todos os canais disponíveis</span>
        </label>

        <div className={css['optinCheckboxWrapper']}>
          <span className={css['optinCheckboxTitle']}>SMS</span>
          <div className={css['optinCheckboxContainer']}>
            <input
              type="radio"
              name="opt-in-sms"
              id="opt-in-sms--true"
              value="true"
              checked={optinState.optin_sms}
              onChange={() => handleOptinChange('optin_sms', true)}
              className={css['optinCheckbox']}
            />
            <label htmlFor="opt-in-sms--true" className={css['optinCheckboxLabel']}>Aceito</label>
            <input
              type="radio"
              name="opt-in-sms"
              id="opt-in-sms--false"
              value="false"
              checked={!optinState.optin_sms}
              onChange={() => handleOptinChange('optin_sms', false)}
              className={css['optinCheckbox--false']}
            />
            <label htmlFor="opt-in-sms--false" className={css['optinCheckboxLabel']}>Não aceito</label>
          </div>
        </div>
        <div className={css['optinCheckboxWrapper']}>
          <span className={css['optinCheckboxTitle']}>Whatsapp</span>
          <div className={css['optinCheckboxContainer']}>
            <input
              type="radio"
              name="opt-in-whatsapp"
              id="opt-in-whatsapp--true"
              value="true"
              checked={optinState.optin_whatsapp}
              onChange={() => handleOptinChange('optin_whatsapp', true)}
              className={css['optinCheckbox']}
            />
            <label htmlFor="opt-in-whatsapp--true" className={css['optinCheckboxLabel']}>Aceito</label>
            <input
              type="radio"
              name="opt-in-whatsapp"
              id="opt-in-whatsapp--false"
              value="false"
              checked={!optinState.optin_whatsapp}
              onChange={() => handleOptinChange('optin_whatsapp', false)}
              className={css['optinCheckbox--false']}
            />
            <label htmlFor="opt-in-whatsapp--false" className={css['optinCheckboxLabel']}>Não aceito</label>
          </div>
        </div>
        <div className={css['optinCheckboxWrapper']}>
          <span className={css['optinCheckboxTitle']}>E-mail</span>
          <div className={css['optinCheckboxContainer']}>
            <input
              type="radio"
              name="opt-in-email"
              id="opt-in-email--true"
              value="true"
              checked={optinState.optin_email}
              onChange={() => handleOptinChange('optin_email', true)}
              className={css['optinCheckbox']}
            />
            <label htmlFor="opt-in-email--true" className={css['optinCheckboxLabel']}>Aceito</label>
            <input
              type="radio"
              name="opt-in-email"
              id="opt-in-email--false"
              value="false"
              checked={!optinState.optin_email}
              onChange={() => handleOptinChange('optin_email', false)}
              className={css['optinCheckbox--false']}
            />
            <label htmlFor="opt-in-email--false" className={css['optinCheckboxLabel']}>Não aceito</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default OptinFields;