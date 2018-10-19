
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as request from 'request-promise';
import { Constants } from '../common/constants';
import { TokenHelper } from './token-helper';
export class Authenticate {
    private callbackUrl: string;
    constructor(callbackUrl: string) {
        this.callbackUrl = callbackUrl;
    }

    public authenticate(req: Request, res: Response): void {
        const hostUrl = this.ensureTrailingSlash(Constants.sharePointUrl);
        const returnUrl = this.callbackUrl;
        const encodedReturnUrl = encodeURIComponent(returnUrl);
        const postRedirectUrl: string = `${hostUrl}_layouts/15/OAuthAuthorize.aspx?client_id=${Constants.clientId}&scope=Site.Manage&response_type=code&redirect_uri=${encodedReturnUrl}`;
        res.redirect(postRedirectUrl);
    }

    public async onReturnCallback(req: Request): Promise<any> {
        const hostUrl = this.ensureTrailingSlash(Constants.sharePointUrl);
        const code = req.query[Constants.SPCode];
        if (!code) {
            throw new Error('Unable to find code');
        }
        const accessToken = await TokenHelper.getUserAccessTokenWithAutorizationCode( code, hostUrl , Constants.redirectUrl );

        const headers = {
            Accept: 'application/json;odata=verbose',
            Authorization: 'Bearer ' + accessToken.value
        };
        const data = await request.get(`${hostUrl}_api/web/currentuser`, {
            json: true,
            headers
        });
        const profile = {
            loginName: data.d.LoginName,
            displayName: data.d.Title,
            email: data.d.Email
        };

        return {
            accessToken,
            profile
        };

    }
    private ensureTrailingSlash(url: string): string {
        if (!url.endsWith('/')) {
            return url + '/';
        }

        return url;
    }
}