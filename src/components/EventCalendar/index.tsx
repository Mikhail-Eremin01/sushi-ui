import { useCalendar } from 'react-aria';
import { CalendarStateOptions, useCalendarState } from 'react-stately';
import { useTranslation } from 'react-i18next';
import { CalendarDate, createCalendar } from '@internationalized/date';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { CalendarGrid } from './CalendarGrid';
import CalendarButton from './CalendarButton';

import styles from './styles.module.css';

interface EventCalendarProps {
  calendarStateOptions: Partial<CalendarStateOptions>;
  prevSelectedDate: CalendarDate;
}

export const EventCalendar: React.FC<EventCalendarProps> = (props) => {
  const { t } = useTranslation();
  const state = useCalendarState({
    ...props.calendarStateOptions,
    locale: 'ru-RU',
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(props.calendarStateOptions, state);

  const [, year] = title.split(' ');

  return (
    <div {...calendarProps} className={styles.calendar}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {t(`Popup.ManageEvent.Months.${state.focusedDate.month}`)} {year}
        </h2>
        <div className={styles.navigationContainer}>
          <CalendarButton {...prevButtonProps}>
            <Arrow />
          </CalendarButton>

          <CalendarButton {...nextButtonProps}>
            <Arrow className={styles.forwardButton} />
          </CalendarButton>
        </div>
      </div>
      <CalendarGrid prevSelectedDate={props.prevSelectedDate} state={state} />
    </div>
  );
};
