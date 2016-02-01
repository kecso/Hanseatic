/**
 * @author kecso / https://github.com/kecso
 */

var jqueryMock = jest.genMockFromModule('jquery');

function ajax(options){
    if(options.success){
        options.success(['one','two']);
    } else {
        console.log('what is wrong with you?');
    }
}

jqueryMock.ajax.mockImplementation(ajax);

module.exports = jqueryMock;