import { CalendarDate } from '@internationalized/date';
import React, { memo } from 'react';
import { useCalendarCell } from 'react-aria';
import { CalendarState } from 'react-stately';
import { maybeAddLeadingZero } from '../../../popup/ManageEvent/index.utils';
import styles from './styles.module.css';

interface CalendarCellProps {
  isPrevSelectedDate: boolean;
  state: CalendarState;
  date: CalendarDate;
}

const CalendarCell: React.FC<CalendarCellProps> = memo(
  ({ state, date, isPrevSelectedDate }) => {
    let ref = React.useRef(null);
    let {
      cellProps,
      buttonProps,
      isSelected,
      isOutsideVisibleRange,
      isDisabled,
      formattedDate,
    } = useCalendarCell({ date }, state, ref);

    return (
      <td {...cellProps}>
        <div
          {...buttonProps}
          ref={ref}
          hidden={isOutsideVisibleRange}
          className={`${styles.cell} ${isSelected ? styles.selected : ''} ${
            isDisabled ? styles.disabled : ''
          } ${isPrevSelectedDate ? styles.prevSelectedDate : ''}`}
        >
          {maybeAddLeadingZero(formattedDate)}
        </div>
      </td>
    );
  }
);

export default CalendarCell;
