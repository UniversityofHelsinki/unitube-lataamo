import React, { useState } from 'react';
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { personQuery, addPerson } from '../actions/seriesAction';

const AsyncTypeahead = asyncContainer(Typeahead);

const PersonListAutoSuggest = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const labelKey = (option) => {
        return option.lastName + ' ' + option.firstName + ' (' +  option.email + ')';
    };

    const handleSearch = async (query) => {
        setLoading(true);
        try {
            setPersons(await personQuery(query));
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const clearTypeAheadSelection = () => {
        const instance = personListTypeAhead.getInstance();
        instance.clear();
        instance.focus();
    };

    const addToSelection = (selection) => {
        if (selection) {
            console.log(selection.userName);
            props.onPersonAdd(selection.userName);
        }
        clearTypeAheadSelection();
    };

    const [isLoading, setLoading] = useState(false);
    const [persons, setPersons] = useState([]);

    let personListTypeAhead;

    return (
        <div>
            <AsyncTypeahead
                id="iam-group-typeahead"
                ref={(ref) => personListTypeAhead = ref}
                isLoading={isLoading}
                minLength={3}
                labelKey={(option) => labelKey(option)}
                onSearch={handleSearch}
                onChange={selected => addToSelection(selected[0])}
                options={persons}
                placeholder={translate('searchForPersons')}
            />
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
    persons : state.ser.persons
});

const mapDispatchToProps = dispatch => ({
    onPersonAdd : (person) => dispatch(addPerson(person)),
});

export default connect(mapStateToProps, mapDispatchToProps) (PersonListAutoSuggest);
