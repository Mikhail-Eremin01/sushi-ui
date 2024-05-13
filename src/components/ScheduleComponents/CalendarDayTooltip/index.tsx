import React from 'react'
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';

import './styles.css'

interface IToolTipProps {
    id: string
}

const CalendarDayTooltip: React.FC<IToolTipProps> = props => {
    const { t } = useTranslation();
    return (
        <Tooltip
            anchorSelect={props.id}
            place="bottom-end"
            opacity={1}
            offset={5}
            className='calendar__day__tooltip'
        >
            {["red", "yellow", "green"].map(color => (
                <div key={color}>
                    <span className={`calendar__day__tooltip-text calendar__day__tooltip-text--${color}`}>
                        {t(`Calendar.Tooltip.${color}.title`)}
                    </span>
                    {t(`Calendar.Tooltip.${color}.text`)}
                </div>
            ))}
        </Tooltip>
    )
}

export default CalendarDayTooltip