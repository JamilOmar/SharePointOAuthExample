import { NextFunction, Request, Response, Router } from 'express';
export class IndexRoute {
  public router = Router();

  constructor() {
    this.router.route('/')
      .get(this.index);
  }

  public index(req: Request, res: Response, next: NextFunction): void {
    res.render('index', {
      title: 'Express',
      username: 'test'
    });

  }
}

export default new IndexRoute().router;
