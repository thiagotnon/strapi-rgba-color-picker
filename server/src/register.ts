import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'rgba-color-picker',
    plugin: 'rgba-color-picker',
    type: 'string',
    inputSize: {
      default: 12,
      isResizable: true,
    },
  });
};

export default register;
