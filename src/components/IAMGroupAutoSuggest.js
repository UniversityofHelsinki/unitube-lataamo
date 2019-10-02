import React, { useState } from 'react';
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { iamGroupQuery, addIamGroup } from '../actions/seriesAction';

const AsyncTypeahead = asyncContainer(Typeahead);

const IAMGroupAutoSuggest = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const labelKey = (option) => {
        return option.grpName + ' ('+ option.description + ')';
    };

    const handleSearch = async (query) => {
        setLoading(true);
        setGroups(await iamGroupQuery(query));
        setLoading(false);
    };

    const clearTypeAheadSelection = () => {
        const instance = iamGroupTypeAhead.getInstance();
        instance.clear();
        instance.focus();
    };

    const addToSelection = (selection) => {
        if (selection) {
            props.onIamGroupAdd(selection.grpName);
        }
        clearTypeAheadSelection();
    };

    const [isLoading, setLoading] = useState(false);
    const [iamGroups, setGroups] = useState([]);

    let iamGroupTypeAhead;

    return (
        <div>
            <AsyncTypeahead
                id="iam-group-typeahead"
                ref={(ref) => iamGroupTypeAhead = ref}
                isLoading={isLoading}
                minLength={3}
                labelKey={(option) => labelKey(option)}
                onSearch={handleSearch}
                onChange={selected => addToSelection(selected[0])}
                options={iamGroups}
                placeholder={translate('searchForIamGroup')}
            />
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
    iamGroups : state.ser.iamGroups
});

const mapDispatchToProps = dispatch => ({
    onIamGroupAdd : (iamGroup) => dispatch(addIamGroup(iamGroup)),
});

export default connect(mapStateToProps, mapDispatchToProps) (IAMGroupAutoSuggest);