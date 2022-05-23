import React from 'react';

const RadioButtonGroup = (props) => {
    const radioButtons = props.members.map(member => {
        return (
            <div key={member.value} className="form-check">
                <input name={props.name} id={member.id} className="form-check-input" type="radio" value={member.value} onChange={member.onChange} checked={member.checked()} />
                <label htmlFor={member.id}>{member.label}</label>
            </div>
        );
    });
    return (
        <div id={props.id}>
            {radioButtons}
        </div>
    );
};

export default RadioButtonGroup;