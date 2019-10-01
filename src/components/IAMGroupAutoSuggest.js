import React, { useState } from 'react';
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { iamGroupQuery } from '../actions/iamQueryAction';

const AsyncTypeahead = asyncContainer(Typeahead);

const IAMGroupAutoSuggest = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };


    const drawSelections = (selections) => {
        if (selections && selections.length > 0) {
            return selections.map((selection, index) => {
                return (
                    <div key={index} className="form-check-inline">
                        <button disabled type="button" className="btn btn-outline-dark">{selection}<span
                            className="close" aria-hidden="true">&times;</span></button>
                    </div>
                );
            });
        }
    };

    const handleSearch = async (query) => {
        setLoading(true);
        console.log(query);
        let result = await iamGroupQuery(query);
        setGroups(result);
        setLoading(false);
    };

    const clearTypeAheadSelection = () => {
        const instance = iamGroupTypeAhead.getInstance();
        instance.clear();
        instance.focus();
    };

    const addToSelection = (selection) => {
        if (selection) {
            setSelection([...new Set([...selections, selection.grpName])]);
        }
        clearTypeAheadSelection();
    };

    const [selections, setSelection] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [iamGroups, setGroups] = useState([]);

    let iamGroupTypeAhead;

    return (
        <div>
            { drawSelections(selections) }
            <AsyncTypeahead
                id="iam-group-typeahead"
                ref={(ref) => iamGroupTypeAhead = ref}
                isLoading={isLoading}
                minLength={3}
                labelKey={(option) => `${option.grpName}`+' ('+ `${option.description}` + ')'}
                onSearch={handleSearch}
                onChange={selected => addToSelection(selected[0])}
                options={iamGroups}
                placeholder={translate('chooseIamGroup')}
            />
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n
});

export default connect(mapStateToProps, null) (IAMGroupAutoSuggest);