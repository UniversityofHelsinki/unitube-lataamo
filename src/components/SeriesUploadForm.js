import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';

const SeriesUploadForm = (props) => {
    return(
        <div>
            <form>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Sarjan nimi</label>
                    <div className="col-sm-8">
                        <input type="text" name="seriesTitle" className="form-control" required/>
                    </div>
                    <div className="col-sm-2">
                        <button className="btn btn-primary">?</button>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Kuvaus</label>
                    <div className="col-sm-8">
                        <textarea type="text" name="seriesDescription" className="form-control" maxLength="1500" required/>
                    </div>
                    <div className="col-sm-2">
                        <button className="btn btn-primary">?</button>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-10 offset-sm-9">
                        <button type="submit" className="btn btn-primary">Tallenna</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SeriesUploadForm;