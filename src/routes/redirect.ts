import { NextFunction, Request, Response, Router } from 'express';
import { Constants } from '../common/constants';
import { Authenticate } from '../sp/authenticate';
export class RedirectRoute {
  public router = Router();

  constructor() {
    this.router.route('/redirect')
      .get(this.index);
  }

  public async index(req: Request, res: Response, next: NextFunction) {

    const auth = new Authenticate(Constants.redirectUrl);
    const data = await auth.onReturnCallback(req);
    res.render('authenticate', {
        title: 'Authenticate',
        loginName: data.profile.loginName,
        accessToken : data.authInfo.access_token,
        refreshToken : data.authInfo.refresh_token
      });
  }
}

export default new RedirectRoute().router;
