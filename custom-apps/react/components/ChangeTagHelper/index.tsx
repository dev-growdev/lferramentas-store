import React from 'react';
import { canUseDOM } from 'vtex.render-runtime';

interface Props {
  classIdentifier: string;
  toTag: string;
  fromTag: string;
  setNewTagClass: string | null;
  changeOnlyFirstItem: boolean | null;
  changeChildren: boolean | null;
}

const ChangeTagHelper = (props: Props) => {
  const replace = (link: any) => {
    if (props.setNewTagClass) {
      link.classList.add(`${props.setNewTagClass}`);
    }
    if(props.changeChildren) {
      link.innerHTML = link.innerHTML
        .replace(`<${props.fromTag} `, `<${props.toTag} `)
        .replace(`</${props.fromTag}>`, `</${props.toTag}>`);
      return
    }
    const elToTag = document.createElement(props.toTag);
    elToTag.setAttribute('class', Array.from(link.classList).join(' '));
    elToTag.innerHTML = link.innerHTML;
    
    link.parentNode.replaceChild(elToTag, link);
  }

  const replaceTags = (links: NodeList) => {
    if(props.changeOnlyFirstItem) {
      return replace(links[0]);
    }

    links.forEach((link: any) => {
      replace(link);
    });
  };

  React.useEffect(() => {
    if(!canUseDOM) {
      return;
    }

    if (window.parent.location.pathname.includes('site-editor')) {
      return;
    }

    if (!props.classIdentifier || !props.fromTag || !props.toTag) {
      return;
    }

    const links = document?.querySelectorAll(`.${props.classIdentifier}`);
    
    if(links.length <= 0) return;
    replaceTags(links);
  }, [canUseDOM]);
  return <></>;
};

export default ChangeTagHelper;
