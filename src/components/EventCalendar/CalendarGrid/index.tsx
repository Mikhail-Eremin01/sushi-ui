import { AriaCalendarGridProps, useCalendarGrid } from 'react-aria';
import { CalendarDate, getWeeksInMonth } from '@internationalized/date';
import CalendarCell from '../CalendarCell';
import useWindowSize from '../../../hooks/useWindowSize';
import { useMemo } from 'react';
import { CalendarState } from 'react-stately';
import styles from './styles.module.css';

const WEEKDAYS_DESKTOP = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const WEEKDAYS_MOBILE = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface CalendarGridProps extends AriaCalendarGridProps {
  state: CalendarState;
  prevSelectedDate: CalendarDate;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  state,
  ...props
}) => {
  const { width: windowWidth } = useWindowSize();

  const weekDays = useMemo<string[]>(() => {
    if (!windowWidth) {
      return WEEKDAYS_DESKTOP;
    }

    return windowWidth < 600 ? WEEKDAYS_MOBILE : WEEKDAYS_DESKTOP;
  }, [windowWidth]);
 
  let { gridProps, headerProps } = useCalendarGrid(props, state);
  let weeksInMonth = getWeeksInMonth(state.visibleRange.start, 'de-DE');
  return (
    <table className={styles.grid} {...gridProps}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th className={styles.heading} key={index}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.body}>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, i) => {
              if (!date) {
                return null;
              }

              const isPrevSelectedDate =
                props.prevSelectedDate.toString() === date.toString();

              return date ? (
                <CalendarCell
                  isPrevSelectedDate={isPrevSelectedDate}
                  key={i}
                  state={state}
                  date={date}
                />
              ) : (
                <td key={i} />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
