import { allure } from "../integrations/wdio-allure-reporter/core/allure.js";

type Ctx = { hs?: { rootSel: string } };
type Step<C = Ctx> = (c: C) => Promise<C>;

const step =
    <C = Ctx>(name: string, f: Step<C>): Step<C> =>
    async (c: C) => {
        let out = c;
        await allure.step(name, async () => {
            out = await f(c);
        });
        return out;
    };

const pipe = async <C = Ctx>(c: C, ...ss: Step<C>[]) => {
    for (const s of ss) c = await s(c);
    return c;
};
