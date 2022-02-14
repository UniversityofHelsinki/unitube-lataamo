import React, { useState } from 'react';
import { withAsync, Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { personQuery, addPerson } from '../actions/seriesAction';

const AsyncTypeahead = withAsync(Typeahead);

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
        personListTypeAhead.clear();
        personListTypeAhead.focus();
    };

    const addToSelection = (selection) => {
        if (selection) {
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
                id="person-list-typeahead"
                ref={(ref) => personListTypeAhead = ref}
                isLoading={isLoading}
                minLength={4}
                emptyLabel={translate('noPersonsFound')}
                labelKey={(option) => labelKey(option)}
                onSearch={handleSearch}
                onChange={selected => addToSelection(selected[0])}
                options={persons}
                placeholder={translate('searchForPersons')}
                promptText={translate('person_searching_info')}
                searchText={translate('searching')}
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
