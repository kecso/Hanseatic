jest.dontMock('../src/client/views/profile.jsx');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const ProfileView = require('../src/client/views/profile.jsx');

describe('ProfileView', () => {

    it('should show the id from props', () => {
        var id = "idToShow",
            profile = TestUtils.renderIntoDocument(
                <ProfileView id={id} router={null} dispatcher={null}/>
            ),
            domNode = ReactDOM.findDOMNode(profile);

        expect(profile.props.id).toBe(id);
        expect(profile.state).toEqual({seeds: [], selectedSeed: null});
    });

});