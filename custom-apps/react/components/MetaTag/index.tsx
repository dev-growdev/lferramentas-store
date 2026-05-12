import React from 'react';
import { Helmet } from 'vtex.render-runtime';
const MetaTag = () => {
  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1.0, maximum-scale = 1.0, user-scalable = no"
        />
      </Helmet>
    </>
  );
};

export default MetaTag;
