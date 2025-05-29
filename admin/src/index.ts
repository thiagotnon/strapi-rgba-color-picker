import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.customFields.register({
      name: 'rgba-color-picker',
      pluginId: 'rgba-color-picker', // the custom field is created by a color-picker plugin
      type: 'string', // the color will be stored as a string
      intlLabel: {
        id: 'rgba-color-picker.color.label',
        defaultMessage: 'Color',
      },
      intlDescription: {
        id: 'rgba-color-picker.color.description',
        defaultMessage: 'Select any color',
      },
      icon: PluginIcon, // don't forget to create/import your icon component
      components: {
        Input: async () =>
          import('./components/Input').then((module) => ({
            default: module.Input,
          })),
      },
      options: {
        base: [
          /*
            Declare settings to be added to the "Base settings" section
            of the field in the Content-Type Builder
          */
          /*  {
            sectionTitle: {
              id: 'rgba-color-picker.color.section.format',
              defaultMessage: 'Format',
            },
            items: [
              {
             
                intlLabel: {
                  id: 'rgba-color-picker.color.format.label',
                  defaultMessage: 'Color format',
                },
                name: 'options.format',
                type: 'select',
                value: 'hex', 
                options: [
               
                  {
                    key: 'hex',
                    defaultValue: 'hex',
                    value: 'hex',
                    metadatas: {
                      intlLabel: {
                        id: 'rgba-color-picker.color.format.hex',
                        defaultMessage: 'Hexadecimal',
                      },
                    },
                  },
                  {
                    key: 'hsl',
                    defaultValue: 'hsl',
                    value: 'hsl',
                    metadatas: {
                      intlLabel: {
                        id: 'rgba-color-picker.color.format.hsl',
                        defaultMessage: 'HSL',
                      },
                    },
                  },
                  {
                    key: 'rgb',
                    value: 'rgb',
                    metadatas: {
                      intlLabel: {
                        id: 'rgba-color-picker.color.format.rgb',
                        defaultMessage: 'RGB',
                      },
                    },
                  },
                ],
              },
            ],
          }, */
        ],
        advanced: [
          /*
            Declare settings to be added to the "Advanced settings" section
            of the field in the Content-Type Builder
          */
        ],
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
