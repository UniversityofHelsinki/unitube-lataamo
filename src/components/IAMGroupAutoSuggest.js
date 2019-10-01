import React, { useState } from 'react';
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { iamGroupQuery, addIamGroup, removeIamGroup } from '../actions/seriesAction';

const AsyncTypeahead = asyncContainer(Typeahead);

const IAMGroupAutoSuggest = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const drawSelections = () => {
        if (props.iamGroups && props.iamGroups.length > 0) {
            return props.iamGroups.map((selection, index) => {
                return (
                    <div key={index} className="form-check-inline">
                        <button disabled type="button" className="btn btn-outline-dark">{selection}<span
                            onClick={() => props.onIamGroupRemove(selection)} className="close" aria-hidden="true">&times;</span></button>
                    </div>
                );
            });
        }
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
            {drawSelections()}
            <AsyncTypeahead
                id="iam-group-typeahead"
                ref={(ref) => iamGroupTypeAhead = ref}
                isLoading={isLoading}
                minLength={3}
                labelKey={(option) => `${option.grpName}`+ ' ('+ `${option.description}` + ')'}
                onSearch={handleSearch}
                onChange={selected => addToSelection(selected[0])}
                options={iamGroups}
                placeholder={translate('chooseIamGroup')}
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
    onIamGroupRemove: (iamGroup) => dispatch(removeIamGroup(iamGroup))
});

export default connect(mapStateToProps, mapDispatchToProps) (IAMGroupAutoSuggest);