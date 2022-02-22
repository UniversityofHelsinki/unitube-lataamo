import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { changeDeletionDate } from '../actions/eventsAction';
import DatePicker, { registerLocale } from 'react-datepicker';
import { addYears } from 'date-fns';
import fi from 'date-fns/locale/fi';
registerLocale('fi', fi);
import 'react-datepicker/dist/react-datepicker.css';

const SelectDeletionDate = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [deletionDate, setDeletionDate] = useState(null);

    useEffect( () => {
        if(props.deletionDate){
            setDeletionDate(new Date(props.deletionDate));
        }
    }, [props.deletionDate]);

    return (
        <div>
            <div className="form-group row">
                <label className="col-sm-2">{translate('deletion_date_title')}</label>
                <div className="col-sm-8">
                    <DatePicker
                        required
                        dateFormat="dd.MM.yyyy"
                        locale="fi"
                        showPopperArrow={false}
                        minDate={new Date()}
                        maxDate={addYears(new Date(), 3)}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        selected={deletionDate}
                        onChange={(date) => {
                            setDeletionDate(date);
                            props.onDeletionDayChange(date);
                        }} />
                </div>
                <div className="col-sm-2">
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('deletion_date_info')}</Tooltip>}>
                        <span className="d-inline-block">
                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                        </span>
                    </OverlayTrigger>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    deletionDate : state.er.deletionDate,
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onDeletionDayChange: (date) => dispatch(changeDeletionDate(date))
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectDeletionDate);
