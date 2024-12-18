import React from "react";
import ReactDOM from "react-dom";

//import * as portals from 'react-reverse-portal';

const Portal = ({ children, parent, className }) => {
    const el = React.useMemo(() => document.createElement("div"), []);

    //const portalNode = React.useMemo(() => portals.createHtmlPortalNode("div"), []);

    React.useEffect(() => {
        const target = parent && parent.appendChild ? parent : document.body;
        const classList = ["portal-container"];
        if (className) className.split(" ").forEach((item) => classList.push(item));
        classList.forEach((item) => el.classList.add(item));
        target.appendChild(el);
        return () => {
            //   // console.log('portal close', el, parent, className)
            target.removeChild(el);
        };
    }, [el, parent, className]);

    return ReactDOM.createPortal(children, el);
}

export default Portal