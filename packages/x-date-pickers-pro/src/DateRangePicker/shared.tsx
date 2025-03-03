import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { LocalizedComponent, PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import {
  DefaultizedProps,
  useDefaultDates,
  useUtils,
  applyDefaultDate,
  BaseDateValidationProps,
  BasePickerInputProps,
  PickerViewRendererLookup,
} from '@mui/x-date-pickers/internals';
import { DateRangeValidationError } from '../models';
import { DateRange } from '../internals/models';
import {
  DateRangeCalendarSlotsComponent,
  DateRangeCalendarSlotsComponentsProps,
  ExportedDateRangeCalendarProps,
} from '../DateRangeCalendar';
import {
  DateRangePickerToolbar,
  DateRangePickerToolbarProps,
  ExportedDateRangePickerToolbarProps,
} from './DateRangePickerToolbar';
import { DateRangeViewRendererProps } from '../dateRangeViewRenderers';

export interface BaseDateRangePickerSlotsComponent<TDate>
  extends DateRangeCalendarSlotsComponent<TDate> {
  /**
   * Custom component for the toolbar rendered above the views.
   * @default DateTimePickerToolbar
   */
  toolbar?: React.JSXElementConstructor<DateRangePickerToolbarProps<TDate>>;
}

export interface BaseDateRangePickerSlotsComponentsProps<TDate>
  extends DateRangeCalendarSlotsComponentsProps<TDate> {
  toolbar?: ExportedDateRangePickerToolbarProps;
}

export interface BaseDateRangePickerProps<TDate>
  extends Omit<
      BasePickerInputProps<DateRange<TDate>, TDate, 'day', DateRangeValidationError>,
      'view' | 'views' | 'openTo' | 'onViewChange' | 'orientation'
    >,
    ExportedDateRangeCalendarProps<TDate>,
    BaseDateValidationProps<TDate> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BaseDateRangePickerSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BaseDateRangePickerSlotsComponentsProps<TDate>;
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be the used.
   */
  viewRenderers?: Partial<
    PickerViewRendererLookup<DateRange<TDate>, 'day', DateRangeViewRendererProps<TDate, 'day'>, {}>
  >;
}

type UseDateRangePickerDefaultizedProps<
  TDate,
  Props extends BaseDateRangePickerProps<TDate>,
> = LocalizedComponent<TDate, DefaultizedProps<Props, keyof BaseDateValidationProps<TDate>>>;

export function useDateRangePickerDefaultizedProps<
  TDate,
  Props extends BaseDateRangePickerProps<TDate>,
>(
  props: Props,
  name: string,
): UseDateRangePickerDefaultizedProps<TDate, Omit<Props, 'components' | 'componentsProps'>> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const localeText = React.useMemo<PickersInputLocaleText<TDate> | undefined>(() => {
    if (themeProps.localeText?.toolbarTitle == null) {
      return themeProps.localeText;
    }

    return {
      ...themeProps.localeText,
      dateRangePickerToolbarTitle: themeProps.localeText.toolbarTitle,
    };
  }, [themeProps.localeText]);

  return {
    ...themeProps,
    localeText,
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
    slots: {
      toolbar: DateRangePickerToolbar,
      ...themeProps.slots,
    },
  };
}
