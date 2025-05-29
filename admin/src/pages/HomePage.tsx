import { Box, Main, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { Input } from '../components/Input';
import { getTranslation } from '../utils/getTranslation';

export function HomePage() {
  const { formatMessage } = useIntl();
  const pluginName = formatMessage({ id: getTranslation('plugin.name') });

  return (
    <Main padding={5}>
      <Box paddingBottom={4} margin={20}>
        <Typography variant="alpha" as="h1">
          {formatMessage({ id: getTranslation('homepage.welcome') }, { pluginName })}
        </Typography>
        <Box>
          <Typography variant="epsilon" textColor="neutral600">
            {formatMessage({ id: getTranslation('homepage.description') })}
          </Typography>
        </Box>
      </Box>

      <Box padding={4} background="neutral0" shadow="tableShadow" hasRadius>
        <Typography variant="beta" as="h2">
          {formatMessage({ id: getTranslation('homepage.about.title') })}
        </Typography>
        <Typography>
          {formatMessage({ id: getTranslation('homepage.about.description') }, { pluginName })}
        </Typography>

        <Box background="neutral100" padding={6} marginTop={4} marginBottom={4} hasRadius>
          <Input name="" />
        </Box>

        <Box paddingTop={6}>
          <Typography variant="beta" as="h2">
            {formatMessage({ id: getTranslation('homepage.howToUse.title') })}
          </Typography>
          <Typography>
            {formatMessage({ id: getTranslation('homepage.howToUse.description') }, { pluginName })}
          </Typography>
        </Box>
      </Box>
    </Main>
  );
}
