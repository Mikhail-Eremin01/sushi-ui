import { memo, useRef } from 'react';
import { AriaButtonProps, useButton } from 'react-aria';
import styles from './styles.module.css';

interface CalendarButtonProps extends AriaButtonProps<'button'> {
  children?: React.ReactNode;
}

const CalendarButton: React.FC<CalendarButtonProps> = memo((props) => {
  let ref = useRef<HTMLButtonElement>(null);

  let { buttonProps } = useButton(props, ref);

  return (
    <button {...buttonProps} ref={ref} className={styles.button}>
      {props.children}
    </button>
  );
});

export default CalendarButton;
