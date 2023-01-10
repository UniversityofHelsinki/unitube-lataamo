import React from 'react';
import { Translate } from 'react-redux-i18n';
import { connect } from 'react-redux';

const Footer = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 section left-section">
                        <div className="row">
                            <div className="col-md-3">
                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                    viewBox="0 0 31 31" enableBackground="new 0 0 31 31">
                                    <g>
                                        <g>
                                            <g>
                                                <rect x="14" fill="white" width="3" height="3"/>
                                            </g>
                                        </g>
                                        <g>
                                            <g>
                                                <rect x="14" y="28" fill="white" width="3" height="3"/>
                                            </g>
                                        </g>
                                        <g>
                                            <g>
                                                <path fill="white" d="M25.8,16.9c-0.8-0.5-1.1-1.5-1.2-2.3c-0.7,0.1-2,0.1-2.6-1.4c-0.5-1.2-0.3-3.1-1.8-4.8
                                                    c-1.4-1.5-3.1-2-4.7-1.9c2,1.3,1.2,3.3-0.2,3.3c-2,0-2.5-2.4-5.4-2.4c-0.7,0-1.2,0.2-1.6,0.4c1.6,0.2,2,1.5,2.5,2.7
                                                    c0.4,1,1.1,1.5,2.2,1.8c-0.2,0.1-0.6,0.2-1.2,0.2c-1.3,0-2.2-0.7-3.1-1.6c-0.8-0.8-1.7-1.6-3.2-1.6c-0.7,0-1.3,0.2-1.5,0.4
                                                    c0.8,0.1,2,0.6,2,1.5c0,0.7-0.8,1-1.5,0.3c-0.7-0.8-1.8-1.4-3-1.4c-0.6,0-1.2,0.2-1.5,0.4c1.4,0.2,2.3,1.1,3.2,3.1
                                                    c0.5,1.2,1.2,2.3,3,2.3c0.8,0,2-0.4,2.7,0.3c0.6,0.6,0.4,1.4,0.7,2.1c0.4,0.8,1.1,1.3,2.6,1.3C11,20.8,8,20.2,7,19.1
                                                    c0.1,2.7,2.2,5.1,6.4,3.9c0.7-0.2,1.2-0.1,1.5,0.7c0.4,1,1.3,1.2,2.2,1.1c2-0.2,3.1,0.2,4.3,1.5c0.2-2.2-1.3-3.5-2.4-4.2
                                                    c-1-0.6-1-1.2-1.1-1.7c0.7,0.8,1.6,1.1,2.5,1.3c1.6,0.2,2.8,0.7,3.4,1.6c0.2-2.5-2.4-3-2.7-4c0.8,0.5,1.4,0.7,2.3,0.7
                                                    c1.1-0.1,2.5-1,3.5,0.8c1.3-0.8,3-0.5,4.1,0.2C29.9,18.3,27.4,18,25.8,16.9z M17,18h-3v-3h3V18z"/>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div className="col-md-9">
                                <p>
                                    <strong><Translate value="hy" /> </strong>
                                </p>
                                <p><Translate value="hy_address_part1" /><br/>
                                    <Translate value="hy_address_part2" />
                                </p>
                                <p> <Translate value="hy_switchboard" /></p>
                                <p>{translate('maintenance_info')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 section middle-section">
                        <div className="content">
                            <div className="col-md-9">
                                <p>
                                    <strong>
                                        <a href={translate('hy_contact_info_link')} target="_blank" rel="noreferrer noopener">
                                            <Translate value="hy_contact_info" />
                                            <span className="screen-reader-only">{translate('open_in_new_tab')}</span>
                                        </a>
                                    </strong>
                                </p>
                                <p>
                                    <strong>
                                        <a href={translate('hy_terms_of_use_link')} target="_blank" rel="noreferrer noopener">
                                            <Translate value="hy_terms_of_use" />
                                        </a>
                                    </strong>
                                </p>
                                <p>
                                    <strong>
                                        <a href={translate('hy_lataamo_instructions_link')} target="_blank" rel="noreferrer noopener">
                                            <Translate value="hy_lataamo_instructions" />
                                        </a>
                                    </strong>
                                </p>
                                <p>
                                    <strong>
                                        <a href={translate('hy_unitube_katsomo_link')} target="_blank" rel="noreferrer noopener">
                                            <Translate value="hy_unitube_katsomo" />
                                        </a>
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 section right-section">
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        </footer>
    );
};


const mapStateToProps = state => ({
    i18n: state.i18n
});

export default connect(mapStateToProps)(Footer);
