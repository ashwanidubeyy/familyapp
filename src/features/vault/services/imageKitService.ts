import ImageKit from 'imagekit-javascript';

import {
  urlEndpoint,
  publicKey,
  authenticationEndpoint,
} from '../../../app/lib/imagekit';

const config: any = {
  urlEndpoint,
  publicKey
};

if (publicKey) {
  config.publicKey = publicKey;
}

if (authenticationEndpoint) {
  config.authenticationEndpoint =
    authenticationEndpoint;
}

export const imagekit = new ImageKit(config);

export const getImagekitUrl = (
    imageSrc: string,
    transformation: any[] = [],
  ) => {
    return imagekit.url({
      src: imageSrc,
      transformation,
    });
  };