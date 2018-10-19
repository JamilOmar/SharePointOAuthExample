
import * as request from 'request-promise';
import { parse as urlparse } from 'url';
import { Constants } from '../common';
export class TokenHelper {
    public static async getUserAccessToken(authData, url: string): Promise<any> {
        const spAuthority = urlparse(url).host;
        const resource = `${Constants.SharePointPrincipal}/${spAuthority}@${authData.realm}`;
        const appId = `${Constants.clientId}@${authData.realm}`;
        const tokenService = urlparse(authData.securityTokenServiceUri);
        const tokenUrl = `${tokenService.protocol}//${tokenService.host}/${authData.realm}${tokenService.path}`;

        const data = await request.post(tokenUrl, {
            form: {
                grant_type: 'refresh_token',
                client_id: appId,
                client_secret: Constants.clientSecret,
                refresh_token: authData.refreshToken,
                resource
            },
            json: true
        });
        return {
            value: data.access_token,
            expireOn: new Date(parseInt(data.expires_on, 10))
        };
    }
    public static async getUserAccessTokenWithAutorizationCode( code: string, url: string , redirectUri: string): Promise<any> {
        const sharepointhostname = urlparse(url).host;
        const realm = await this.getRealm(url);
        const resource = `${Constants.SharePointPrincipal}/${sharepointhostname}@${realm}`;
        const appId = `${Constants.clientId}@${realm}`;
        const authUrl = await this.getAuthUrl(realm);

        const data = await request.post(authUrl, {
            form: {
                grant_type: 'authorization_code',
                client_id: appId,
                client_secret: Constants.clientSecret,
                code,
                redirect_uri : redirectUri,
                resource
            },
            json: true
        });
        return {
            value: data.access_token,
            expireOn: new Date(parseInt(data.expires_on, 10))
        };
    }
    private static async getAuthUrl(realm: string): Promise<string> {
        const url = Constants.acsRealmUrl + realm;
        let authUrl;
        const data: any = await request.get(url, { json: true });
        for (const endpoint of data.endpoints) {
            if (endpoint.protocol === 'OAuth2') {
                authUrl = endpoint.location;
                break;
            }
        }
        return authUrl;
    }
    private static async getRealm(site): Promise<string> {
        const data = await request.post(`${site}/_vti_bin/client.svc`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer '
            },
            resolveWithFullResponse: true,
            simple: false
        });
        const header: string = data.headers['www-authenticate'];
        const index: number = header.indexOf('Bearer realm="');
        return header.substring(index + 14, index + 50);
    }
}