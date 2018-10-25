import { NextFunction, Request, Response, Router } from 'express';
import { Constants } from '../common/constants';
import { Authenticate } from '../sp/authenticate';
export class IndexRoute {
  public router = Router();

  constructor() {
    this.router.route('/')
      .get(this.index);
  }

  public index(req: Request, res: Response, next: NextFunction): void {
    const auth = new Authenticate(Constants.redirectUrl);
    auth.authenticate(req , res);
  }
}

export default new IndexRoute().router;
