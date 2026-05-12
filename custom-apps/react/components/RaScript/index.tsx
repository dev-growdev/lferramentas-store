import React, { useEffect } from "react";

export function RaScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.amazonaws.com/raichu-beta/selos/bundle.js";
    script.id = "ra-embed-reputation";
    script.setAttribute("data-id", "dGwtQ05xbUhqdV9nVlRqbzpsZi1tYXF1aW5hcy1lLWZlcnJhbWVudGFz");
    script.setAttribute("data-target", "reputation-ra");
    script.setAttribute("data-model", "1");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <>
    <div id="reputation-ra"></div>
    <style>
      {`
        #reputation-ra {

        }
        @media screen and (min-width: 999px) {
          #reputation-ra {
            margin-right: 24px;
          }
        }
        `}
    </style>
  </>
}
