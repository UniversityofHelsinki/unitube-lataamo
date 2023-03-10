import React, { useState } from 'react';
import { withAsync, Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { iamGroupQuery, addIamGroup } from '../actions/seriesAction';

const AsyncTypeahead = withAsync(Typeahead);

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
        try {
            setGroups(await iamGroupQuery(query));
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const clearTypeAheadSelection = () => {
        iamGroupTypeAhead.clear();
        iamGroupTypeAhead.focus();
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
                inputProps={ { id: 'iam_group_auto_suggest' } }
                ref={(ref) => iamGroupTypeAhead = ref}
                isLoading={isLoading}
                minLength={4}
                labelKey={(option) => labelKey(option)}
                emptyLabel={translate('noIamGroupsFound')}
                onSearch={handleSearch}
                onChange={selected => addToSelection(selected[0])}
                options={iamGroups}
                placeholder={translate('searchForIamGroup')}
                promptText={translate('iam_group_searching_info')}
                searchText={translate('searching')}
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
