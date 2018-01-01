import React from 'react';
import { array, object, func } from 'prop-types';
import classNames from 'classnames';
import util from '../../../helpers/util';
import './styles.css';

DayMenu.propTypes = {
    days: array,
    selected: object,
    handleLink: func
};

function DayMenu({ days, selected, handleLink }) {
    const sortedDays = days.sort((a, b) => {
        if (!a) return 1;
        if (!b) return -1;
        return new Date(a) - new Date(b);
    });
    var dayLinks = days.map(d => {
        const isSelected = d.getDate() === selected.getDate();
        const date = util.prettyDate(d);
        const day = util.prettyDay(d);
        // TODO: add date tooltip
        return <a className={classNames('day-link', { 'selected': isSelected })} onClick={handleLink.bind(this, d)} key={d}>{day}</a>;//<a className={classNames('day-link', {'selected': isSelected})} onClick={handleLink(d)}>{ day }</a>;
    });
    return (
        <div className="day-menu">
            { dayLinks }
        </div>
    );
};

export default DayMenu;
