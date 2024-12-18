import { useEffect, useRef } from 'react'

export const HandleKeyDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
        alert("CTRL+S Pressed");
    } else if ((event.ctrlKey || event.metaKey) && charCode === 'c') {
        alert("CTRL+C Pressed");
    } else if ((event.ctrlKey || event.metaKey) && charCode === 'v') {
        alert("CTRL+V Pressed");
    }
}

export const useKey = (key, cb) => {
    const callback = useRef(cb);

    useEffect(() => {

        callback.current = cb;
    })


    useEffect(() => {

        function handle(event) {
            //     console.log(event, event.key, key)


            if (event.ctrlKey && event.code === 'KeyS' && key === 'save') {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                console.log(key)
                console.log(event)

                callback.current(event);
            } else if (event.ctrlKey && event.code === 'KeyS' && key === 'save') {

            }

        }

        document.addEventListener('keydown', handle);

        return () => document.removeEventListener("keydown", handle)
    }, [key])
}