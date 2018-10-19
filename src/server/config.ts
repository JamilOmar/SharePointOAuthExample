
import { sync } from 'glob';

export default class Config {
	public static routes: string = './dist/routes/**/*.js';
	public static appUrl: string = 'https://localhost:44355';
	public static globFiles(location: string): string[] {
		return sync(location);
	}
}
