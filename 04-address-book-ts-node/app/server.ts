import Koa, {type Context} from 'koa';

export const app: Koa = new Koa();

app.use(async (context: Context) => {
	const {name} = context.request.query;
	const n1: string = context.request.query.n1 as string;
	context.body = `Hello, ${name}, the number is ${10 - Number.parseInt(n1)}`;
});
