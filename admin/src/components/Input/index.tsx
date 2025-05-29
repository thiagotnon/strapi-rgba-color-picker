import {
  Box,
  Field,
  Flex,
  SingleSelect,
  SingleSelectOption,
  TextInput,
  Typography,
} from '@strapi/design-system';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../utils/getTranslation';
import { Color, parseColor, rgbToHsl } from './utils';

type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

interface ColorPickerProps {
  width?: string;
  label?: string;
  name: string;
  value?: string;
  format?: ColorFormat;
  onChange?: (event: { target: { name: string; value: string } }) => void;
}

const colorToString = (color: Color, format: ColorFormat): string => {
  const { r, g, b, a } = color;
  const [h, s, l] = rgbToHsl(r, g, b);
  switch (format) {
    case 'hex':
      return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
    case 'rgb':
      return `rgb(${r}, ${g}, ${b})`;
    case 'rgba':
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    case 'hsl':
      return `hsl(${h}, ${s}%, ${l}%)`;
    case 'hsla':
      return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }
};

export const ColorPicker = ({
  width,
  label,
  name,
  value = 'rgba(0, 0, 0, 1)',
  format: initialFormat = 'rgba',
  onChange,
}: ColorPickerProps) => {
  const { formatMessage } = useIntl();
  const [color, setColor] = React.useState<Color>({ r: 0, g: 0, b: 0, a: 1 });
  const [format, setFormat] = React.useState<ColorFormat>(initialFormat);
  const [inputValue, setInputValue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const initialized = React.useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const parsed = parseColor(value);
      if (parsed) setColor(parsed);
      initialized.current = true;
    }
  }, [value]);

  useEffect(() => {
    const newValue = colorToString(color, format);
    setInputValue(newValue);
    onChange?.({ target: { name, value: newValue } });
  }, [color, format]);

  return (
    <Box width={width || '100%'}>
      <Field.Root width="100%">
        <Field.Label>{label ?? formatMessage({ id: getTranslation('field.label') })}</Field.Label>

        <Flex alignItems="start" direction="column" gap={3} width="100%">
          <SingleSelect
            placeholder={formatMessage({ id: getTranslation('field.format.placeholder') })}
            value={format}
            onChange={(val: ColorFormat) => setFormat(val)}
          >
            {['hex', 'rgb', 'rgba', 'hsl', 'hsla'].map((f) => (
              <SingleSelectOption key={f} value={f}>
                {f.toUpperCase()}
              </SingleSelectOption>
            ))}
          </SingleSelect>

          <Field.Root width="100%">
            <Field.Label>{formatMessage({ id: getTranslation('field.color.label') })}</Field.Label>
            <TextInput
              type="color"
              style={{ padding: 1 }}
              value={`#${[color.r, color.g, color.b]
                .map((x) => x.toString(16).padStart(2, '0'))
                .join('')}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const hex = e.target.value;
                setColor((prev) => ({
                  ...prev,
                  r: parseInt(hex.slice(1, 3), 16),
                  g: parseInt(hex.slice(3, 5), 16),
                  b: parseInt(hex.slice(5, 7), 16),
                }));
              }}
            />
          </Field.Root>

          {(format === 'rgba' || format === 'hsla') && (
            <Field.Root width="100%">
              <Field.Label>
                {formatMessage(
                  { id: getTranslation('field.alpha.label') },
                  { percentage: Math.round(color.a * 100) }
                )}
              </Field.Label>
              <input
                type="range"
                value={color.a}
                step={0.01}
                min={0}
                max={1}
                onChange={(e) => setColor((prev) => ({ ...prev, a: parseFloat(e.target.value) }))}
              />
            </Field.Root>
          )}

          <Field.Root error={inputError} width="100%">
            <Field.Label>
              {formatMessage(
                { id: getTranslation('field.manual.label') },
                { format: format.toUpperCase() }
              )}
            </Field.Label>
            <TextInput
              name="manualInput"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                setInputValue(val);
                const parsed = parseColor(val);
                if (parsed) {
                  setColor(parsed);
                  setInputError('');
                } else {
                  setInputError(formatMessage({ id: getTranslation('field.manual.error') }));
                }
              }}
            />
            {inputError ? (
              <Field.Error>{inputError}</Field.Error>
            ) : (
              <Field.Hint>{formatMessage({ id: getTranslation('field.manual.hint') })}</Field.Hint>
            )}
          </Field.Root>

          <Typography fontWeight="bold">
            {formatMessage({ id: getTranslation('field.preview.label') })}
          </Typography>
          <Box
            padding={2}
            width="100%"
            height="100px"
            hasRadius
            style={{
              border: '1px solid #ddd',
              backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
            }}
          />
        </Flex>
      </Field.Root>
    </Box>
  );
};

export const Input = ColorPicker;
