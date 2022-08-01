const isAuth = require('./is-auth');
const jwt = require('jsonwebtoken');

it('should throw an error if the Authorization header is missing', () => {
    const req = {
        get: () => {
            return null;
        }
    }
    expect(isAuth.bind(this, req, {}, () => null)).toThrow('Not authorized');
})
it('should throw an error if the token cannot be verified', () => {
    const req = {
        get: () => {
            return 'Bearer NotAFakeJWT';
        }
    }
    expect(isAuth.bind(this, req, [], () => {
    })).toThrow('Failed to verify login');
})
it('should throw an error if req.userId is undefined', () => {
    const req = {
        get: () => {
            return 'Bearer xyz';
        }
    }
    const verifyMock = jest.spyOn(jwt, 'verify')
    verifyMock.mockImplementation(() => 'xyz');
    isAuth(req, [], () => {
    });
    verifyMock.mockRestore();
    expect(req).toHaveProperty('userId');
})